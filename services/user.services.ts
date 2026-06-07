import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { User as FirebaseUser } from "firebase/auth";
import { User as AppUser } from "@/app/(routes)/caodangnghe/types";
import { OperationType, handleFirestoreError } from "@/app/(routes)/caodangnghe/cdn.services";

export interface UserProfile {
  uid: string;
  name: string | null;
  email: string | null;
  avatar: string | null;
  location?: [number, number] | null;
  onboardingComplete: boolean;
  createdAt: Timestamp | Date; // Đổi từ any sang kiểu chuẩn
  bio?: string;
  interests?: string[];
  socials?: {
    facebook?: string;
    instagram?: string;
    zalo?: string;
  };
}

export async function syncUserProfile(firebaseUser: FirebaseUser): Promise<AppUser> {
  const userDocRef = doc(db, "users", firebaseUser.uid);
  const path = `users/${firebaseUser.uid}`;
  try {
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      return docSnap.data() as AppUser;
    } else {
      const defaultProfile: AppUser = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || "Sinh viên ẩn danh",
        email: firebaseUser.email || "",
        photoUrl: firebaseUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(firebaseUser.displayName || firebaseUser.uid)}`,
        faculty: "Kinh tế - Tổng hợp",
        joinDate: new Date().toLocaleDateString("vi-VN"),
      };
      await setDoc(userDocRef, defaultProfile);
      return defaultProfile;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    throw error;
  }
}


export const updateLocation = async (uid: string, lat: number, lng: number) => {
  const userRef = doc(db, "users", uid);
  // Sử dụng updateDoc an toàn hơn setDoc merge khi cập nhật một phần
  await updateDoc(userRef, {
    location: [lat, lng],
    onboardingComplete: true,
    lastActive: serverTimestamp(),
  });
};

// Hàm update chung cho profile
export const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
  const userRef = doc(db, "users", uid);
  
  // Xử lý flat object nếu cần update nested object như socials, 
  // tránh việc setDoc merge đè mất các mạng xã hội khác.
  await updateDoc(userRef, {
    ...data,
    lastUpdated: serverTimestamp(),
  });
};