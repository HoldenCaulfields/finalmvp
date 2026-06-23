import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, query, where, GeoPoint } from "firebase/firestore";
import { MainCategory, SubMarker } from "@/stores/useViewStore";

// Fetch danh sách 7 chủ đề chính
export const fetchMainCategories = async (): Promise<MainCategory[]> => {
  const querySnapshot = await getDocs(collection(db, "main_categories"));
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      position: [data.position.latitude, data.position.longitude],
      iconType: data.iconType,
    };
  });
};

// Fetch sub-markers theo danh mục cụ thể (Lazy loading)
export const fetchSubMarkersByCategory = async (categoryId: string): Promise<SubMarker[]> => {
  const q = query(collection(db, "sub_markers"), where("categoryId", "==", categoryId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      categoryId: data.categoryId,
      title: data.title,
      position: [data.position.latitude, data.position.longitude],
      type: data.type,
      rating: data.rating,
      createdBy: data.createdBy,
    };
  });
};

// Lưu sub-marker mới do user khởi tạo
export const createSubMarker = async (
  markerData: Omit<SubMarker, "id">
): Promise<string> => {
  const docRef = await addDoc(collection(db, "sub_markers"), {
    categoryId: markerData.categoryId,
    title: markerData.title,
    position: new GeoPoint(markerData.position[0], markerData.position[1]),
    type: markerData.type,
    rating: markerData.rating || null,
    createdBy: markerData.createdBy,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
};

// Thêm vào file map.services.ts hiện tại của bạn
export const createMainCategory = async (catData: {
  title: string;
  position: [number, number];
  iconType: string;
  zoomLevel: number;
  createdBy: string;
}): Promise<string> => {
  const docRef = await addDoc(collection(db, "main_categories"), {
    title: catData.title,
    position: new GeoPoint(catData.position[0], catData.position[1]),
    iconType: catData.iconType,
    zoomLevel: catData.zoomLevel,
    isSystem: false, // Đợi admin kiểm duyệt kích hoạt
    createdBy: catData.createdBy,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
};

// Fetch sub-markers do chính user tạo ra
export const fetchSubMarkersByUser = async (userId: string): Promise<SubMarker[]> => {
  const q = query(collection(db, "sub_markers"), where("createdBy", "==", userId));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      categoryId: data.categoryId,
      title: data.title,
      position: [data.position.latitude, data.position.longitude],
      type: data.type,
      rating: data.rating,
      createdBy: data.createdBy,
      // Thêm các trường hiển thị (nếu có lưu trong DB, nếu không có thể fallback)
      views: data.views || 0,
      status: data.status || "active", 
      revenue: data.revenue || "0đ",
    };
  });
};