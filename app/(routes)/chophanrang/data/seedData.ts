import { doc, setDoc, getDocs, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Stall, Dish } from '../types';

export const SEED_STALLS: Stall[] = [
  {
    id: 'stall_1_comga',
    name: 'Cơm Gà Khánh Kỳ',
    description: 'Thương hiệu cơm gà Ninh Thuận nổi tiếng nhất xứ Phan. Gà thả vườn thịt săn chắc, da giòn, cơm dẻo nấu nước luộc gà thơm béo cốt nghệ, kết hợp cùng nước chấm gừng ớt siêu cay đặc trưng.',
    category: 'Cơm Gà',
    address: '61 Trần Quang Diệu, Mỹ Hải, Phan Rang-Tháp Chàm',
    banner: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&q=80&w=800',
    ownerId: 'system_seed_admin',
    rating: 4.8,
    reviewsCount: 15,
  },
  {
    id: 'stall_2_banhcan',
    name: 'Bánh Căn Quê Khán (Chợ Phan Rang)',
    description: 'Bánh căn Phan Rang đổ khuôn đất nung truyền thống siêu giòn. Nhân bánh đa dạng: trứng, thịt heo băm, tôm tươi và mực ống Ninh Thuận tươi rói từ cảng Đông Hải. Ăn cùng mắm nêm cá cơm nguyên chất hoặc nước mắm đậu phộng béo bùi.',
    category: 'Món Ăn Vặt / Bánh Căn',
    address: 'Sảnh ngoài Chợ Phan Rang, Thống Nhất, Phan Rang-Tháp Chàm',
    banner: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=800',
    ownerId: 'system_seed_admin',
    rating: 4.9,
    reviewsCount: 22,
  },
  {
    id: 'stall_3_banhxeo',
    name: 'Bánh Xèo Mực Đêm Chợ cũ',
    description: 'Bánh xèo đổ bằng khuôn đất đỏ rực lửa. Đặc sản bánh xèo mực Phan Rang siêu mỏng giòn, nhân ngập giá đỗ và mực sữa tươi rói cuốn kèm rau rừng sông Dinh chấm ngập trong mắm đậu phộng chua ngọt.',
    category: 'Món Ăn Vặt / Bánh Xèo',
    address: 'Đường Quang Trung (gần Chợ Phan Rang), Phan Rang-Tháp Chàm',
    banner: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800',
    ownerId: 'system_seed_admin',
    rating: 4.7,
    reviewsCount: 18,
  },
  {
    id: 'stall_4_laude',
    name: 'Lẩu Dê & Đùi Cừu Nướng Hương Sơn',
    description: 'Ninh Thuận là thủ phủ của dê núi và cừu thả thảo nguyên cát. Quán phục vụ đùi cừu nướng mọi tẩm ướp hương quế hồi, lẩu dê bốc khói ngọt ngào nước xương hầm thuốc bắc bổ dưỡng, vị thanh mát dễ chịu.',
    category: 'Nhậu / Đặc Sản Dê Cừu',
    address: 'Đường 16 Tháng 4, Mỹ Bình, Phan Rang-Tháp Chàm',
    banner: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800',
    ownerId: 'system_seed_admin',
    rating: 4.6,
    reviewsCount: 12,
  },
  {
    id: 'stall_5_dacsan',
    name: 'Trái Cây & Mật Nho Sông Dinh',
    description: 'Gian hàng trực thuộc hợp tác xã nho Ninh Thuận. Chuyên bán sỉ & lẻ nho đỏ, nho xanh Ba Mọi, mật nho cô đặc không đường hóa học, vang nho hảo hạng phục vụ giải khát trực tiếp tại chợ.',
    category: 'Giải Khát / Đặc Sản Quà Tặng',
    address: 'Ki-ốt 42 Chợ Phan Rang, Phan Rang-Tháp Chàm',
    banner: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&q=80&w=800',
    ownerId: 'system_seed_admin',
    rating: 4.9,
    reviewsCount: 30,
  }
];

export const SEED_DISHES: Dish[] = [
  // Stall 1: Cơm gà Khánh Kỳ
  {
    id: 'dish_1_comgaduôi',
    stallId: 'stall_1_comga',
    name: 'Cơm Đùi Gà Hải Nam Phan Rang',
    description: 'Đùi gà ta luộc vừa chín tới da vàng bóng giòn rụm, thịt bên trong dai dẻo mọng nước. Đi kèm đĩa cơm dẻo nấu nước dùng luộc gà, dưa chua bắp cải muối chua ngọt, dưa leo và một bát nước súp lá hành thanh dịu.',
    price: 55000,
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&q=80&w=600',
    category: 'Cơm Gà',
    rating: 4.8,
    reviewsCount: 8,
    ownerId: 'system_seed_admin',
  },
  {
    id: 'dish_2_comgaxe',
    stallId: 'stall_1_comga',
    name: 'Cơm Gà Xé Phay Lá Chanh',
    description: 'Cơm dẻo rưới mỡ hành thơm phức, phủ đầy ắp thịt gà ta xé phay trộn gỏi hành tây ram lá chanh, tiêu đen, dấm tỏi cay ngọt và rau răm cay ấm nồng nàn.',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&q=80&w=600',
    category: 'Cơm Gà',
    rating: 4.7,
    reviewsCount: 5,
    ownerId: 'system_seed_admin',
  },
  {
    id: 'dish_3_ganuong',
    stallId: 'stall_1_comga',
    name: 'Gà Ta Nướng Mật Ong Rừng (Cả Con)',
    description: 'Nguyên con gà ta thả đồi tẩm ướp mật nho Ninh Thuận và lá mật nhân siêu thơm nướng lu rực hồng thơm phức ngọt giòn ngậy béo tụ hội tinh túy cát nắng Phan Rang.',
    price: 280000,
    image: 'https://images.unsplash.com/photo-1598515214211-89d3e73ae83b?auto=format&fit=crop&q=80&w=600',
    category: 'Nướng / Đặc Sản',
    rating: 4.9,
    reviewsCount: 4,
    ownerId: 'system_seed_admin',
  },

  // Stall 2: Bánh Căn Quê Khán
  {
    id: 'dish_4_banhcantrung',
    stallId: 'stall_2_banhcan',
    name: 'Bánh Căn Trứng Cút Mỡ Hành (Phần 8 cái)',
    description: 'Bánh căn gạo quê xay mịn đập kèm trứng cút béo ngậy đổ đều tay dưới lò đất lung lay, rưới mỡ hành lá tươi xào ngập ngụ béo ấm nồng thơm ngon.',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&q=80&w=600',
    category: 'Bánh Căn',
    rating: 4.9,
    reviewsCount: 12,
    ownerId: 'system_seed_admin',
  },
  {
    id: 'dish_5_banhcanmuc',
    stallId: 'stall_2_banhcan',
    name: 'Bánh Căn Tôm Mực Đại Dương (Phần 8 cái)',
    description: 'Thượng phẩm bánh căn biển cả với tôm đất ngọt dẻo và khoanh mực ống giòn sần sật tươi xanh từ tàu cá vừa cập bến buổi sớm cực hấp dẫn.',
    price: 60000,
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=600',
    category: 'Bánh Căn',
    rating: 4.8,
    reviewsCount: 10,
    ownerId: 'system_seed_admin',
  },

  // Stall 3: Bánh xèo mực
  {
    id: 'dish_6_banhxeomuc',
    stallId: 'stall_3_banhxeo',
    name: 'Bánh Xèo Mực Tươi Ninh Chữ (Bộ 4 cái)',
    description: 'Những đĩa bánh xèo ròn giã vừa đổ chín rực. Nhân bánh là mực ống Ninh Chữ tươi giòn sừn sựt ngọt béo, kẹp giá đỗ thanh mát.',
    price: 40000,
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=600',
    category: 'Bánh Xèo',
    rating: 4.7,
    reviewsCount: 11,
    ownerId: 'system_seed_admin',
  },
  {
    id: 'dish_7_banhxeotomthit',
    stallId: 'stall_3_banhxeo',
    name: 'Bánh Xèo Tôm Thịt Đặc Biệt Phan Rang',
    description: 'Món bánh xèo cuốn ngập chả giòn chua, rau cải ngọt, chấm ngập chén mắm nêm cá sọc hoặc mắm đậu phộng sánh béo mịn tuyệt hảo hảo.',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&q=80&w=600',
    category: 'Bánh Xèo',
    rating: 4.8,
    reviewsCount: 7,
    ownerId: 'system_seed_admin',
  },

  // Stall 4: Lẩu Dê
  {
    id: 'dish_8_laudetruyenthong',
    stallId: 'stall_4_laude',
    name: 'Lẩu Dê Hương Sơn Bốc Khói (Nồi Lớn)',
    description: 'Thịt dê núi Ninh Thuận nạm sườn hầm sả mật nho cùng táo tàu, củ sen, ngải cứu và đậu phụ chiên. Ăn kèm phở tươi hoặc bún, rau má rừng đắng ngọt cực khoái chí.',
    price: 280000,
    image: 'https://images.unsplash.com/photo-1547928576-a4a33237ecd3?auto=format&fit=crop&q=80&w=600',
    category: 'Lẩu / Dê Mountain',
    rating: 4.6,
    reviewsCount: 8,
    ownerId: 'system_seed_admin',
  },
  {
    id: 'dish_9_duicuunuong',
    stallId: 'stall_4_laude',
    name: 'Đùi Cừu Thảo Nguyên Nướng Mọi (Phần)',
    description: 'Đùi cừu non thả thảo nguyên Ninh Thuận lọc xương xắt lát tẩm mỡ hành sả ớt nướng nóng hổi xèo xèo ngọt mềm tan đầu lưỡi, không hề hôi tanh.',
    price: 180000,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600',
    category: 'Món Nướng / Cừu Ninh Thuận',
    rating: 4.9,
    reviewsCount: 6,
    ownerId: 'system_seed_admin',
  },

  // Stall 5: Đặc sản nho
  {
    id: 'dish_10_nuocnho',
    stallId: 'stall_5_dacsan',
    name: 'Mật Nho Ninh Thuận Nguyên Chất (Chai 500ml)',
    description: 'Mật làm hoàn toàn từ trái nho chín mọng đỏ sẫm vùng Ninh Thuận cô đặc đặc sánh, vị ngọt tự nhiên, sảng khoái thanh mát khi hòa thêm đá và chanh tươi.',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&q=80&w=600',
    category: 'Giải Khát Đặc Sản',
    rating: 4.9,
    reviewsCount: 15,
    ownerId: 'system_seed_admin',
  },
  {
    id: 'dish_11_nhotuoi',
    stallId: 'stall_5_dacsan',
    name: 'Nho Đỏ Ninh Thuận Loại 1 Hái Luôn Tại Vườn',
    description: 'Nho đỏ Ninh Thuận trái mọc chùm bóng bẩy mọng nước giòn, ngọt thanh có hậu vị chua dốc nhẹ đặc trưng giàu vitamin mát lạnh ngon miệng.',
    price: 50000,
    image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&q=80&w=600',
    category: 'Trái Cây',
    rating: 4.8,
    reviewsCount: 10,
    ownerId: 'system_seed_admin',
  }
];

/**
 * Automatically populates the Firestore database with stalls and dishes if there is no data.
 * Safe to execute on every boot because we use static identifiers to prevent duplicates.
 */
export async function seedPhanRangDatabase() {
  try {
    const stallsColl = collection(db, 'stalls');
    const existingStallsSnapshot = await getDocs(stallsColl);
    
    // Check if the database needs seeding
    if (existingStallsSnapshot.empty) {
      console.log('No food stalls detected in Firestore. Initiating automatic seeding...');
      
      // Post all stalls with custom document keys
      for (const stall of SEED_STALLS) {
        await setDoc(doc(db, 'stalls', stall.id), {
          ...stall,
          createdAt: new Date().toISOString()
        });
      }

      // Post all corresponding dishes with custom document keys
      for (const dish of SEED_DISHES) {
        await setDoc(doc(db, 'dishes', dish.id), dish);
      }
      
      console.log('Database seeding successfully rounded up!');
    } else {
      console.log('Database already populated. Skipping automatic seeding.');
    }
  } catch (err) {
    console.error('Failure seeding initial Phan Rang food database:', err);
  }
}
