// @/data/mapMarkersData.ts
import { MainCategory } from "@/stores/useViewStore";

export const mapCategoriesData: MainCategory[] = [
  {
    id: 'market',
    title: 'Chợ Phan Rang',
    position: [11.573281710540968, 108.99317309988206],
    iconType: 'market',
    /* subMarkers: [
      { id: 'm1', position: [11.5745, 108.9942], title: 'Quán Bánh Căn Đêm', type: 'food', rating: 5 },
      { id: 'm2', position: [11.5721, 108.9925], title: 'Sạp Trái Cây Cô Ba', type: 'shop' },
      { id: 'm3', position: [11.5735, 108.9910], title: 'Bánh Xèo Quê Hương', type: 'food' },
      { id: 'm4', position: [11.5750, 108.9955], title: 'Khu Đồ Lưu Niệm', type: 'shop' },
    ] */
  },
  {
    id: 'startup',
    title: 'Cộng đồng Startup',
    position: [10.762622, 106.660172],
    iconType: 'startup',
    /* subMarkers: [
      { id: 'st1', position: [10.7635, 106.6615], title: 'Co-working Space', type: 'office' },
      { id: 'st2', position: [10.7612, 106.6588], title: 'CinaLabs Hub', type: 'tech' },
      { id: 'st3', position: [10.7650, 106.6630], title: 'Văn Phòng Sáng Tạo GenZ', type: 'office' },
      { id: 'st4', position: [10.7595, 106.6570], title: 'Quỹ Đầu Tư Thiên Thần', type: 'finance' },
    ] */
  },
  {
    id: 'cinema',
    title: 'Hội yêu điện ảnh',
    position: [16.4637, 107.5909],
    iconType: 'cinema',
    /* subMarkers: [
      { id: 'c1', position: [16.4650, 107.5925], title: 'Studio Quay Phim Tài Liệu', type: 'studio' },
      { id: 'c2', position: [16.4620, 107.5890], title: 'Cine Cafe - Thảo Luận Kịch Bản', type: 'script' },
      { id: 'c3', position: [16.4670, 107.5950], title: 'Hội Biên Tập Video Trẻ', type: 'team' },
    ] */
  },
  {
    id: 'jobs',
    title: 'Kết Nối Việc Làm',
    position: [21.01584, 105.83637],
    iconType: 'jobs',
    /* subMarkers: [
      { id: 'j1', position: [21.0170, 105.8385], title: 'Tuyển Dụng Full-Stack Dev', type: 'tech' },
      { id: 'j2', position: [21.0145, 105.8340], title: 'Tìm Kiếm Video Editor', type: 'media' },
      { id: 'j3', position: [21.0190, 105.8400], title: 'Trung Tâm Hướng Nghiệp Sinh Viên', type: 'edu' },
    ] */
  },
  {
    id: 'driver',
    title: 'Tài xế Phan Rang',
    position: [11.57455, 108.98268],
    iconType: 'driver',
    /* subMarkers: [
      { id: 'd1', position: [11.5760, 108.9840], title: 'Trạm Tiếp Tế Tài Xế 1', type: 'station' },
      { id: 'd2', position: [11.5730, 108.9810], title: 'Điểm Tập Kết Xe Đêm', type: 'station' },
      { id: 'd3', position: [11.5715, 108.9855], title: 'Quán Cafe Võng Tài Xế', type: 'driver' },
    ] */
  },
  {
    id: 'study',
    title: 'Sinh Viên Cao Đẳng Nghề',
    position: [11.56370, 109.01373],
    iconType: 'caodangnghe',
    /* subMarkers: [
      { id: 's1', position: [11.5650, 109.0150], title: 'Hợp Tác Xã Gốm Bàu Trúc', type: 'craft' },
      { id: 's2', position: [11.5620, 109.0110], title: 'Làng Dệt Thổ Cẩm Mỹ Nghiệp', type: 'craft' },
      { id: 's3', position: [11.5680, 109.0185], title: 'Nhóm Sinh Viên Tình Nguyện', type: 'student' },
      { id: 's4', position: [11.5605, 109.0090], title: 'CLB Khởi Nghiệp Trường Nghề', type: 'student' },
    ] */
  },
  {
    id: 'langnghe',
    title: 'Làng Nghề Mỹ Nghiệp',
    position: [11.521836, 108.942515],
    iconType: 'langnghe',
    /* subMarkers: [
      { id: 's1', position: [11.5250, 108.9550], title: 'Hợp Tác Xã Gốm Bàu Trúc', type: 'gom' },
      { id: 's2', position: [11.5220, 108.8010], title: 'Làng Dệt Thổ Cẩm Mỹ Nghiệp', type: 'craft' },
      { id: 's3', position: [11.5280, 108.7985], title: 'Trang phục dệt tay chăm', type: 'craft' },
      { id: 's4', position: [11.5205, 108.6990], title: 'Cơ sở dệt thổ cẩm', type: 'gom' },
    ] */
  },
];