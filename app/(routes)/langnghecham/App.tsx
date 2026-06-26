'use client';
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HomeTab from './components/HomeTab';
import ScheduleTab from './components/ScheduleTab';
import CheckInTab from './components/CheckInTab';
import MarketplaceTab from './components/MarketplaceTab';
import ArtisansTab from './components/ArtisansTab';
import { CheckIn, Stall, Artisan, ScheduleItem, Product, CartItem } from './types';
import { Home, Calendar, Camera, ShoppingBag, Award, Sparkles, MapPin, CheckCircle2, ChevronRight, ShoppingCart, Plus, Minus, Trash2, X } from 'lucide-react';
import { collection, onSnapshot, addDoc, updateDoc, doc, query, orderBy, increment } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './lib/firebase';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);

  // Core synchronized application state
  const [checkins, setCheckins] = useState<CheckIn[]>([]);
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [artisans, setArtisans] = useState<Artisan[]>([]);

  // Shopping Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Checkout form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [orderNote, setOrderNote] = useState('');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Helper price functions
  const parsePrice = (priceStr: string): number => {
    const clean = priceStr.replace(/[^0-9]/g, '');
    const parsed = parseInt(clean, 10);
    return isNaN(parsed) ? 0 : parsed;
  };

  const formatPrice = (amount: number): string => {
    return amount.toLocaleString('vi-VN') + 'đ';
  };

  // Cart Handlers
  const handleAddToCart = (product: Product, stall: Stall) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        showToast(`⚡ Tăng số lượng "${product.name}" lên ${existing.quantity + 1}`);
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      showToast(`🛒 Đã thêm "${product.name}" vào giỏ hàng!`);
      return [
        ...prev,
        {
          id: `cart-${Date.now()}-${product.id}`,
          product,
          stallId: stall.id,
          stallName: stall.name,
          quantity: 1,
        },
      ];
    });
  };

  const handleUpdateCartQty = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart((prev) => {
      const item = prev.find((i) => i.id === itemId);
      if (item) {
        showToast(`🗑️ Đã xóa "${item.product.name}" khỏi giỏ hàng`);
      }
      return prev.filter((i) => i.id !== itemId);
    });
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerPhone.trim()) {
      showToast('⚠️ Vui lòng nhập số điện thoại để đặt hàng!');
      return;
    }
    if (cart.length === 0) {
      showToast('⚠️ Giỏ hàng của bạn đang trống!');
      return;
    }

    setIsSubmittingOrder(true);

    // Compute subtotal and prepare items
    let grandTotalNum = 0;
    const orderItems = cart.map(item => {
      const pNum = parsePrice(item.product.price);
      const subtotal = pNum * item.quantity;
      grandTotalNum += subtotal;
      return {
        productId: item.product.id,
        productName: item.product.name,
        productPrice: item.product.price,
        stallId: item.stallId,
        stallName: item.stallName,
        quantity: item.quantity,
        subtotalPrice: formatPrice(subtotal)
      };
    });

    const orderData = {
      customerName: customerName.trim() || 'Khách du lịch lễ hội',
      customerPhone: customerPhone.trim(),
      address: shippingAddress.trim() || 'Nhận tại ngày hội',
      note: orderNote.trim(),
      items: orderItems,
      totalPrice: formatPrice(grandTotalNum),
      createdAt: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, 'orders'), orderData);
      
      showToast(`🎉 Đặt hàng thành công! Chủ gian hàng sẽ sớm liên hệ số: ${customerPhone}`);
      
      // Clear cart & state
      setCart([]);
      setCustomerName('');
      setCustomerPhone('');
      setShippingAddress('');
      setOrderNote('');
      setIsCartOpen(false);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'orders');
    } finally {
      setIsSubmittingOrder(false);
    }
  };


  const seedCheckins = async () => {
    const defaults = [
      {
        name: "Nguyễn Hoàng Nam",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80",
        image: "https://images.unsplash.com/photo-1518235506717-e1ed3306a89b?auto=format&fit=crop&w=600&q=400",
        caption: "Lần đầu tiên được xem điệu múa lu uyển chuyển của các cô gái Chăm tại Lễ hội Khánh Hòa! Thần thái của các nghệ nhân múa mộc mạc mà vô cùng duyên dáng luôn.",
        location: "Sân khấu chính Quảng trường 2/4",
        likes: 42,
        createdAt: "2026-06-25T14:30:00Z"
      },
      {
        name: "Mary Chăm",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
        image: "https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=600&q=400",
        caption: "Mọi người ghé gian hàng dệt thổ cẩm Mỹ Nghiệp số 15 của nhà em check-in nhé! Rất nhiều mẫu ví cầm tay, khăn choàng dệt thủ công sắc hồng rose hiện đại xinh xắn lắm ạ! ❤️",
        location: "Gian hàng dệt Mỹ Nghiệp - Làng nghề",
        likes: 85,
        createdAt: "2026-06-25T15:12:00Z"
      },
      {
        name: "Hải Đăng Nha Trang",
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80",
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=400",
        caption: "Vừa trải nghiệm ẩm thực Chăm chiều nay tại gian hàng Sakay! Bánh gừng giòn béo bùi, trà thảo mộc thơm thanh mát. Mùa lễ hội năm nay làm quy mô và chỉn chu thực sự.",
        location: "Khu ẩm thực Chăm Lễ Hội",
        likes: 56,
        createdAt: "2026-06-25T16:45:00Z"
      }
    ];
    try {
      for (const item of defaults) {
        await addDoc(collection(db, 'checkins'), item);
      }
    } catch (err) {
      console.error("Seeding checkins failed", err);
    }
  };

  const seedStalls = async () => {
    const defaults = [
      {
        name: "Gốm Chăm Bàu Trúc - Gia tộc Đàng Thị",
        owner: "Nghệ nhân Đàng Thị Phan",
        ownerTitle: "Nghệ nhân Ưu tú",
        description: "Sản phẩm gốm hoàn toàn tự nhiên nung lộ thiên, độc đáo không dùng bàn xoay từ làng gốm cổ nhất Đông Nam Á - Bàu Trúc, Ninh Thuận.",
        category: "pottery",
        phone: "0912345678",
        avatar: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=200&q=80",
        banner: "https://images.unsplash.com/photo-1518235506717-e1ed3306a89b?auto=format&fit=crop&w=800&q=400",
        address: "Gian số 12, Khu trưng bày di sản văn hóa, Quảng trường 2/4",
        products: [
          {
            id: "prod-101",
            name: "Bình Hoa Gốm Chăm Hoa Văn Khắc Tay",
            price: "350.000đ",
            description: "Bình hoa dáng cổ tròn mộc mạc, có màu đỏ đất pha lẫn vệt khói đen xám ngẫu nhiên cực đẹp mắt từ lửa rơm lộ thiên.",
            image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=400&q=80",
            isFeatured: true
          },
          {
            id: "prod-102",
            name: "Tượng Vũ Nữ Apsara Chăm Đất Sét",
            price: "450.000đ",
            description: "Tượng điêu khắc vũ nữ múa Apsara duyên dáng, phù hợp trưng bày phòng khách, kệ sách hay làm quà tặng phong thủy trang nhã.",
            image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=400&q=80",
            isFeatured: true
          }
        ]
      },
      {
        name: "Hợp tác xã Thổ Cẩm Mỹ Nghiệp Chăm",
        owner: "Nghệ nhân Thuận Thị Trào",
        ownerTitle: "Nghệ nhân kỳ cựu",
        description: "Sản phẩm dệt tay thổ cẩm 100% sợi bông nhuộm củ nâu, hạt điều, lá cây tự nhiên dệt tay tỉ mỉ bởi nghệ nhân Chăm Mỹ Nghiệp.",
        category: "weaving",
        phone: "0987654321",
        avatar: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=200&q=80",
        banner: "https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=800&q=400",
        address: "Gian số 15, Khu dệt thổ cẩm truyền thống, Quảng trường 2/4",
        products: [
          {
            id: "prod-201",
            name: "Khăn Choàng Cổ Hoa Văn Tháp Chăm Cổ",
            price: "180.000đ",
            description: "Khăn choàng dệt tay hai mặt, màu hồng rose phối đen thanh lịch, thêu họa tiết tháp Chăm truyền thống tinh xảo.",
            image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80",
            isFeatured: true
          }
        ]
      }
    ];
    try {
      for (const item of defaults) {
        await addDoc(collection(db, 'stalls-cham'), item);
      }
    } catch (err) {
      console.error("Seeding stalls failed", err);
    }
  };

  const seedSchedule = async () => {
    const defaults = [
      {
        date: "2026-06-26",
        time: "08:00 - 10:30",
        title: "Lễ Khai mạc Ngày hội Văn hóa dân tộc Chăm lần thứ VI",
        location: "Quảng trường 2/4, Nha Trang, Khánh Hòa",
        description: "Sự kiện khai mạc trọng thể với các chương trình diễu hành nghệ thuật, múa hội Chăm quy mô lớn từ các đoàn Ninh Thuận, Bình Thuận, Phú Yên, Khánh Hòa, TP.HCM.",
        type: "main"
      },
      {
        date: "2026-06-26",
        time: "14:00 - 17:00",
        title: "Trình diễn dệt thổ cẩm và làm gốm truyền thống",
        location: "Khu vực Làng nghề Lễ hội (Bên cạnh Quảng trường)",
        description: "Các nghệ nhân nổi tiếng biểu diễn dệt vải thổ cẩm thủ công bằng khung cửi tre và nhào nặn đất sét Bàu Trúc bằng đôi tay trần không cần bàn xoay.",
        type: "workshop"
      },
      {
        date: "2026-06-26",
        time: "19:30 - 22:00",
        title: "Liên hoan nghệ thuật quần chúng & Trình diễn trang phục Chăm",
        location: "Sân khấu nổi ngoài trời, Quảng trường 2/4",
        description: "Trình diễn các bài dân ca Chăm, điệu múa quạt, múa lu uyển chuyển và trình diễn trang phục cưới, trang phục hội hè truyền thống của đồng bào Chăm.",
        type: "culture"
      },
      {
        date: "2026-06-27",
        time: "08:30 - 11:30",
        title: "Hội thảo: Bảo tồn và Phát triển Di sản Văn hóa Chăm",
        location: "Trung tâm Hội nghị Tỉnh Khánh Hòa",
        description: "Nơi các nhà khoa học, nhà nghiên cứu và nghệ nhân Chăm thảo luận về phương hướng số hóa di sản, xây dựng thương hiệu sản phẩm gốm, dệt dệt Chăm trên Internet.",
        type: "exhibition"
      }
    ];
    try {
      for (const item of defaults) {
        await addDoc(collection(db, 'schedule'), item);
      }
    } catch (err) {
      console.error("Seeding schedule failed", err);
    }
  };

  const seedArtisans = async () => {
    const defaults = [
      {
        name: "Đàng Thị Phan",
        title: "Nghệ nhân Ưu tú Gốm Bàu Trúc",
        experience: "Hơn 50 năm truyền nghề",
        specialty: "Tạo hình gốm hoàn toàn bằng tay không dùng bàn xoay",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
        bio: "Nghệ nhân Đàng Thị Phan là một trong những cây đại thụ của làng gốm cổ Bàu Trúc (Ninh Thuận). Bà nổi tiếng với đôi tay điêu luyện, tạo ra các sản phẩm gốm Chăm mộc mạc mang linh hồn của đất và lửa, được nung lộ thiên bằng rơm củi đặc trưng.",
        location: "Khu trình diễn Làng nghề - Gian hàng số 12",
        phone: "0912345678"
      },
      {
        name: "Thuận Thị Trào",
        title: "Nghệ nhân Dệt thổ cẩm Mỹ Nghiệp",
        experience: "Hơn 40 năm gìn giữ khung cửi",
        specialty: "Dệt hoa văn cổ Chăm phỏng theo di tích cổ",
        avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=200&q=80",
        bio: "Bà Trào đã dành cả đời mình bên khung cửi tre, giữ gìn các mẫu hoa văn cổ như hoa văn tháp Chăm, mắt rồng, và vân mây. Bà là người trực tiếp dệt tặng nhiều nguyên thủ quốc gia khi ghé thăm làng nghề Mỹ Nghiệp.",
        location: "Khu trình diễn Làng nghề - Gian hàng số 15",
        phone: "0987654321"
      }
    ];
    try {
      for (const item of defaults) {
        await addDoc(collection(db, 'artisans'), item);
      }
    } catch (err) {
      console.error("Seeding artisans failed", err);
    }
  };

  // On mount: Fetch all initial state from the server DB
  useEffect(() => {
    // 1. Sync checkins real-time
    const qCheckins = query(collection(db, 'checkins'), orderBy('createdAt', 'desc'));
    const unsubscribeCheckins = onSnapshot(qCheckins, (snapshot) => {
      const items: CheckIn[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as CheckIn);
      });
      if (items.length > 0) {
        setCheckins(items);
      } else {
        seedCheckins();
      }
    }, (err) => {
      console.warn("Firestore checkins error:", err);
      loadOfflineDefaults();
    });

    // 2. Sync stalls real-time
    const unsubscribeStalls = onSnapshot(collection(db, 'stalls-cham'), (snapshot) => {
      const items: Stall[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        items.push({
          id: doc.id,
          ...data,
          products: data.products || []
        } as Stall);
      });
      if (items.length > 0) {
        setStalls(items);
      } else {
        seedStalls();
      }
    }, (err) => {
      console.warn("Firestore stalls error:", err);
    });

    // 3. Sync schedule
    const unsubscribeSchedule = onSnapshot(collection(db, 'schedule'), (snapshot) => {
      const items: ScheduleItem[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as ScheduleItem);
      });
      if (items.length > 0) {
        setSchedule(items);
      } else {
        seedSchedule();
      }
    }, (err) => {
      console.warn("Firestore schedule error:", err);
    });

    // 4. Sync artisans
    const unsubscribeArtisans = onSnapshot(collection(db, 'artisans'), (snapshot) => {
      const items: Artisan[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as Artisan);
      });
      if (items.length > 0) {
        setArtisans(items);
      } else {
        seedArtisans();
      }
    }, (err) => {
      console.warn("Firestore artisans error:", err);
    });

    setLoading(false);

    return () => {
      unsubscribeCheckins();
      unsubscribeStalls();
      unsubscribeSchedule();
      unsubscribeArtisans();
    };
  }, []);

  const loadOfflineDefaults = () => {
    // Exact copy of pre-seeded data for absolute offline/static resilience
    setCheckins([
      {
        id: "chk-1",
        name: "Nguyễn Hoàng Nam",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80",
        image: "https://images.unsplash.com/photo-1518235506717-e1ed3306a89b?auto=format&fit=crop&w=600&q=400",
        caption: "Lần đầu tiên được xem điệu múa lu uyển chuyển của các cô gái Chăm tại Lễ hội Khánh Hòa! Thần thái của các nghệ nhân múa mộc mạc mà vô cùng duyên dáng luôn.",
        location: "Sân khấu chính Quảng trường 2/4",
        likes: 42,
        createdAt: "2026-06-25T14:30:00Z"
      },
      {
        id: "chk-2",
        name: "Mary Chăm",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
        image: "https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=600&q=400",
        caption: "Mọi người ghé gian hàng dệt thổ cẩm Mỹ Nghiệp số 15 của nhà em check-in nhé! Rất nhiều mẫu ví cầm tay, khăn choàng dệt thủ công sắc hồng rose hiện đại xinh xắn lắm ạ! ❤️",
        location: "Gian hàng dệt Mỹ Nghiệp - Làng nghề",
        likes: 85,
        createdAt: "2026-06-25T15:12:00Z"
      },
      {
        id: "chk-3",
        name: "Hải Đăng Nha Trang",
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80",
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=400",
        caption: "Vừa trải nghiệm ẩm thực Chăm chiều nay tại gian hàng Sakay! Bánh gừng giòn béo bùi, trà thảo mộc thơm thanh mát. Mùa lễ hội năm nay làm quy mô và chỉn chu thực sự.",
        location: "Khu ẩm thực Chăm Lễ Hội",
        likes: 56,
        createdAt: "2026-06-25T16:45:00Z"
      }
    ]);

    setStalls([
      {
        id: "stall-1",
        name: "Gốm Chăm Bàu Trúc - Gia tộc Đàng Thị",
        owner: "Nghệ nhân Đàng Thị Phan",
        ownerTitle: "Nghệ nhân Ưu tú",
        description: "Sản phẩm gốm hoàn toàn tự nhiên nung lộ thiên, độc đáo không dùng bàn xoay từ làng gốm cổ nhất Đông Nam Á - Bàu Trúc, Ninh Thuận.",
        category: "pottery",
        phone: "0912345678",
        avatar: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=200&q=80",
        banner: "https://images.unsplash.com/photo-1518235506717-e1ed3306a89b?auto=format&fit=crop&w=800&q=400",
        address: "Gian số 12, Khu trưng bày di sản văn hóa, Quảng trường 2/4",
        products: [
          {
            id: "prod-101",
            name: "Bình Hoa Gốm Chăm Hoa Văn Khắc Tay",
            price: "350.000đ",
            description: "Bình hoa dáng cổ tròn mộc mạc, có màu đỏ đất pha lẫn vệt khói đen xám ngẫu nhiên cực đẹp mắt từ lửa rơm lộ thiên.",
            image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=400&q=80",
            isFeatured: true
          },
          {
            id: "prod-102",
            name: "Tượng Vũ Nữ Apsara Chăm Đất Sét",
            price: "450.000đ",
            description: "Tượng điêu khắc vũ nữ múa Apsara duyên dáng, phù hợp trưng bày phòng khách, kệ sách hay làm quà tặng phong thủy trang nhã.",
            image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=400&q=80",
            isFeatured: true
          }
        ]
      },
      {
        id: "stall-2",
        name: "Hợp tác xã Thổ Cẩm Mỹ Nghiệp Chăm",
        owner: "Nghệ nhân Thuận Thị Trào",
        ownerTitle: "Nghệ nhân kỳ cựu",
        description: "Sản phẩm dệt tay thổ cẩm 100% sợi bông nhuộm củ nâu, hạt điều, lá cây tự nhiên dệt tay tỉ mỉ bởi nghệ nhân Chăm Mỹ Nghiệp.",
        category: "weaving",
        phone: "0987654321",
        avatar: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=200&q=80",
        banner: "https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=800&q=400",
        address: "Gian số 15, Khu dệt thổ cẩm truyền thống, Quảng trường 2/4",
        products: [
          {
            id: "prod-201",
            name: "Khăn Choàng Cổ Hoa Văn Tháp Chăm Cổ",
            price: "180.000đ",
            description: "Khăn choàng dệt tay hai mặt, màu hồng rose phối đen thanh lịch, thêu họa tiết tháp Chăm truyền thống tinh xảo.",
            image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80",
            isFeatured: true
          }
        ]
      }
    ]);

    setSchedule([
      {
        id: "sch-1",
        date: "2026-06-26",
        time: "08:00 - 10:30",
        title: "Lễ Khai mạc Ngày hội Văn hóa dân tộc Chăm lần thứ VI",
        location: "Quảng trường 2/4, Nha Trang, Khánh Hòa",
        description: "Sự kiện khai mạc trọng thể với các chương trình diễu hành nghệ thuật, múa hội Chăm quy mô lớn từ các đoàn Ninh Thuận, Bình Thuận, Phú Yên, Khánh Hòa, TP.HCM.",
        type: "main"
      },
      {
        id: "sch-2",
        date: "2026-06-26",
        time: "14:00 - 17:00",
        title: "Trình diễn dệt thổ cẩm và làm gốm truyền thống",
        location: "Khu vực Làng nghề Lễ hội (Bên cạnh Quảng trường)",
        description: "Các nghệ nhân nổi tiếng biểu diễn dệt vải thổ cẩm thủ công bằng khung cửi tre và nhào nặn đất sét Bàu Trúc bằng đôi tay trần không cần bàn xoay.",
        type: "workshop"
      },
      {
        id: "sch-3",
        date: "2026-06-26",
        time: "19:30 - 22:00",
        title: "Liên hoan nghệ thuật quần chúng & Trình diễn trang phục Chăm",
        location: "Sân khấu nổi ngoài trời, Quảng trường 2/4",
        description: "Trình diễn các bài dân ca Chăm, điệu múa quạt, múa lu uyển chuyển và trình diễn trang phục cưới, trang phục hội hè truyền thống của đồng bào Chăm.",
        type: "culture"
      },
      {
        id: "sch-4",
        date: "2026-06-27",
        time: "08:30 - 11:30",
        title: "Hội thảo: Bảo tồn và Phát triển Di sản Văn hóa Chăm",
        location: "Trung tâm Hội nghị Tỉnh Khánh Hòa",
        description: "Nơi các nhà khoa học, nhà nghiên cứu và nghệ nhân Chăm thảo luận về phương hướng số hóa di sản, xây dựng thương hiệu sản phẩm gốm, dệt dệt Chăm trên Internet.",
        type: "exhibition"
      }
    ]);

    setArtisans([
      {
        id: "artisan-1",
        name: "Đàng Thị Phan",
        title: "Nghệ nhân Ưu tú Gốm Bàu Trúc",
        experience: "Hơn 50 năm truyền nghề",
        specialty: "Tạo hình gốm hoàn toàn bằng tay không dùng bàn xoay",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
        bio: "Nghệ nhân Đàng Thị Phan là một trong những cây đại thụ của làng gốm cổ Bàu Trúc (Ninh Thuận). Bà nổi tiếng với đôi tay điêu luyện, tạo ra các sản phẩm gốm Chăm mộc mạc mang linh hồn của đất và lửa, được nung lộ thiên bằng rơm củi đặc trưng.",
        location: "Khu trình diễn Làng nghề - Gian hàng số 12",
        phone: "0912345678"
      },
      {
        id: "artisan-2",
        name: "Thuận Thị Trào",
        title: "Nghệ nhân Dệt thổ cẩm Mỹ Nghiệp",
        experience: "Hơn 40 năm gìn giữ khung cửi",
        specialty: "Dệt hoa văn cổ Chăm phỏng theo di tích cổ",
        avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=200&q=80",
        bio: "Bà Trào đã dành cả đời mình bên khung cửi tre, giữ gìn các mẫu hoa văn cổ như hoa văn tháp Chăm, mắt rồng, và vân mây. Bà là người trực tiếp dệt tặng nhiều nguyên thủ quốc gia khi ghé thăm làng nghề Mỹ Nghiệp.",
        location: "Khu trình diễn Làng nghề - Gian hàng số 15",
        phone: "0987654321"
      }
    ]);
  };

  // Add a new visitor check-in photo & caption
  const handleAddCheckIn = async (newCheckIn: Omit<CheckIn, 'id' | 'likes' | 'createdAt'>) => {
    try {
      const finalCheckIn = {
        ...newCheckIn,
        likes: 0,
        createdAt: new Date().toISOString()
      };
      await addDoc(collection(db, 'checkins'), finalCheckIn);
      showToast('🎉 Đăng check-in kỷ niệm thành công!');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'checkins');
    }
  };

  // Handle Loving/Liking a check-in post
  const handleLikeCheckIn = async (id: string) => {
    try {
      const docRef = doc(db, 'checkins', id);
      await updateDoc(docRef, {
        likes: increment(1)
      });
      showToast('❤️ Đã gửi lượt thích!');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `checkins/${id}`);
    }
  };

  // Register a new digital stall/booth
  const handleAddStall = async (newStall: Omit<Stall, 'id' | 'products'>) => {
    try {
      const finalStall = {
        ...newStall,
        products: []
      };
      await addDoc(collection(db, 'stalls-cham'), finalStall);
      showToast(`🏪 Đăng ký gian hàng "${newStall.name}" thành công!`);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'stalls-cham');
    }
  };

  // Register/Add product to a specific stall
  const handleAddProduct = async (stallId: string, newProduct: Omit<Product, 'id'>) => {
    try {
      const docRef = doc(db, 'stalls-cham', stallId);
      const stall = stalls.find(s => s.id === stallId);
      if (!stall) throw new Error("Không tìm thấy gian hàng");
      
      const localProduct: Product = {
        ...newProduct,
        id: `prod-${Date.now()}`
      };
      
      await updateDoc(docRef, {
        products: [...stall.products, localProduct]
      });
      showToast(`🏷️ Đã thêm sản phẩm "${newProduct.name}" vào kệ hàng!`);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `stalls-cham/${stallId}`);
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab setActiveTab={setActiveTab} checkins={checkins} />;
      case 'schedule':
        return <ScheduleTab schedule={schedule} />;
      case 'checkin':
        return (
          <CheckInTab
            checkins={checkins}
            onAddCheckIn={handleAddCheckIn}
            onLikeCheckIn={handleLikeCheckIn}
          />
        );
      case 'stalls':
        return (
          <MarketplaceTab
            stalls={stalls}
            onAddStall={handleAddStall}
            onAddProduct={handleAddProduct}
            onAddToCart={handleAddToCart}
            onOpenCart={() => setIsCartOpen(true)}
            cartCount={cart.reduce((total, item) => total + item.quantity, 0)}
          />
        );
      case 'artisans':
        return <ArtisansTab artisans={artisans} />;
      default:
        return <HomeTab setActiveTab={setActiveTab} checkins={checkins} />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans select-none pb-20 md:pb-0">
      {/* Syncing Header logo & desktop navigation */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={cart.reduce((total, item) => total + item.quantity, 0)}
      />

      {/* Main body canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-4 border-rose-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-rose-600 animate-spin"></div>
            </div>
            <p className="text-zinc-500 font-display text-xs font-semibold uppercase tracking-widest">
              Đang tải dữ liệu văn hóa Chăm...
            </p>
          </div>
        ) : (
          renderActiveTab()
        )}
      </main>

      {/* Footer copyright */}
      <footer className="bg-white border-t border-zinc-100 py-6 text-center text-xs text-zinc-600 mt-auto hidden md:block">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 Lễ Hội Văn Hóa Dân Tộc Chăm Lần Thứ VI. Đồng hành bởi đồng bào người Chăm.</p>
          <p className="mt-1 text-zinc-500">Khánh Hòa, Ngày 26 - 28 tháng 06 năm 2026</p>
        </div>
      </footer>

      {/* Mobile Sticky Navigation bottom bar - ergonomic & high usability */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-rose-100 py-2 px-2 flex justify-around items-center md:hidden z-40 shadow-lg">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            activeTab === 'home' ? 'text-rose-600' : 'text-zinc-500 hover:text-rose-400'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Trang chủ</span>
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            activeTab === 'schedule' ? 'text-rose-600' : 'text-zinc-500 hover:text-rose-400'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Lịch trình</span>
        </button>
        <button
          onClick={() => setActiveTab('checkin')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative ${
            activeTab === 'checkin' ? 'text-rose-600' : 'text-zinc-500 hover:text-rose-400'
          }`}
        >
          <div className="w-10 h-10 -mt-5 bg-rose-600 hover:bg-rose-700 text-white rounded-full flex items-center justify-center shadow-md border-2 border-white transform transition-transform active:scale-95">
            <Camera className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-semibold mt-0.5">Check-in</span>
        </button>
        <button
          onClick={() => setActiveTab('stalls')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            activeTab === 'stalls' ? 'text-rose-600' : 'text-zinc-500 hover:text-rose-400'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Gian hàng</span>
        </button>
        <button
          onClick={() => setActiveTab('artisans')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            activeTab === 'artisans' ? 'text-rose-600' : 'text-zinc-500 hover:text-rose-400'
          }`}
        >
          <Award className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Nghệ nhân</span>
        </button>
      </nav>

      {/* Floating Dynamic Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-16 sm:bottom-6 right-4 bg-zinc-950 text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-xl shadow-xl border border-zinc-800 flex items-center gap-2 z-50 animate-slide-up">
          <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Shopping Cart Slide-over Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex justify-end animate-fade-in">
          {/* Backdrop Click Closer */}
          <div className="absolute inset-0 cursor-default" onClick={() => setIsCartOpen(false)}></div>
          
          {/* Drawer Body */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden border-l border-rose-100 animate-slide-left">
            {/* Header */}
            <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-rose-600" />
                <h3 className="text-base font-extrabold text-zinc-900 font-serif">Giỏ Hàng Của Bạn</h3>
                <span className="bg-rose-100 text-rose-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  {cart.reduce((total, item) => total + item.quantity, 0)} món
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-lg hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
                aria-label="Đóng giỏ hàng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto border border-rose-100">
                    <ShoppingCart className="w-8 h-8 text-rose-300" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-zinc-800">Giỏ hàng rỗng</p>
                    <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                      Hãy ghé qua mục <strong>Gian Hàng Chăm</strong> để khám phá và thêm các sản phẩm văn hóa, đặc sản truyền thống vào giỏ hàng nhé!
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('stalls');
                      setIsCartOpen(false);
                    }}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-all active:scale-95 cursor-pointer"
                  >
                    Ghé thăm Gian hàng ngay
                  </button>
                </div>
              ) : (
                <>
                  {/* Cart Items List */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider text-left">Sản phẩm đã chọn</p>
                    <div className="divide-y divide-zinc-100">
                      {cart.map((item) => {
                        const priceNum = parsePrice(item.product.price);
                        const itemSubtotal = priceNum * item.quantity;
                        return (
                          <div key={item.id} className="py-3 flex gap-3 text-left">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              referrerPolicy="no-referrer"
                              className="w-16 h-16 rounded-lg object-cover bg-zinc-100 border border-zinc-100 flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                              <div>
                                <h4 className="text-xs font-bold text-zinc-900 truncate">{item.product.name}</h4>
                                <p className="text-[10px] text-zinc-400 truncate">Gian hàng: {item.stallName}</p>
                              </div>
                              <div className="flex items-center justify-between">
                                {/* Quantity buttons */}
                                <div className="flex items-center border border-zinc-200 rounded-md bg-zinc-50 p-0.5">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateCartQty(item.id, item.quantity - 1)}
                                    className="p-1 text-zinc-500 hover:bg-zinc-200 rounded transition-all cursor-pointer"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="px-2.5 text-xs font-bold text-zinc-800">{item.quantity}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateCartQty(item.id, item.quantity + 1)}
                                    className="p-1 text-zinc-500 hover:bg-zinc-200 rounded transition-all cursor-pointer"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                                <span className="text-xs font-bold text-rose-600">
                                  {formatPrice(itemSubtotal)}
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveFromCart(item.id)}
                              className="p-1 text-zinc-400 hover:text-rose-600 transition-colors self-start cursor-pointer"
                              title="Xóa khỏi giỏ"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Order Summary Summary */}
                  <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100 space-y-2 text-left">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Tóm tắt thanh toán</p>
                    <div className="flex justify-between text-xs text-zinc-600">
                      <span>Tạm tính ({cart.reduce((t, i) => t + i.quantity, 0)} sản phẩm)</span>
                      <span>
                        {formatPrice(
                          cart.reduce((sum, item) => sum + parsePrice(item.product.price) * item.quantity, 0)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-zinc-600">
                      <span>Vận chuyển</span>
                      <span className="text-emerald-600 font-medium">Nhận tại Lễ hội (Free)</span>
                    </div>
                    <div className="h-[1px] bg-zinc-200 my-1"></div>
                    <div className="flex justify-between text-sm font-extrabold text-zinc-950">
                      <span>Tổng cộng (VND)</span>
                      <span className="text-rose-600 text-base">
                        {formatPrice(
                          cart.reduce((sum, item) => sum + parsePrice(item.product.price) * item.quantity, 0)
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Checkout Information Form */}
                  <form onSubmit={handlePlaceOrder} className="space-y-4 text-left border-t border-zinc-100 pt-4">
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Thông tin nhận hàng</p>
                    
                    <div className="space-y-1">
                      <label htmlFor="customerName" className="block text-xs font-bold text-zinc-700">Họ và Tên khách hàng</label>
                      <input
                        id="customerName"
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Ví dụ: Nguyễn Văn A"
                        className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all bg-white text-zinc-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="customerPhone" className="block text-xs font-bold text-zinc-700 flex items-center justify-between">
                        <span>Số điện thoại liên hệ <span className="text-rose-500">*</span></span>
                        <span className="text-[10px] text-rose-500 font-normal">Bắt buộc</span>
                      </label>
                      <input
                        id="customerPhone"
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        required
                        placeholder="Ví dụ: 0912345678"
                        className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs sm:text-sm font-bold focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all bg-white text-rose-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="shippingAddress" className="block text-xs font-bold text-zinc-700">Tên khách sạn / Địa chỉ nhận hàng tại Nha Trang</label>
                      <input
                        id="shippingAddress"
                        type="text"
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        placeholder="Ví dụ: Khách sạn Sheraton Nha Trang, hoặc Nhận tại Hội Chợ"
                        className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all bg-white text-zinc-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="orderNote" className="block text-xs font-bold text-zinc-700 font-sans">Ghi chú đơn hàng (Kích cỡ, màu sắc...)</label>
                      <textarea
                        id="orderNote"
                        value={orderNote}
                        onChange={(e) => setOrderNote(e.target.value)}
                        rows={2}
                        placeholder="Ghi chú thêm cho chủ gian hàng Chăm..."
                        className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all bg-white text-zinc-800 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingOrder}
                      className="w-full py-3 bg-rose-600 hover:bg-rose-700 active:scale-98 disabled:bg-rose-400 text-white font-extrabold text-sm rounded-xl transition-all shadow-md shadow-rose-900/15 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {isSubmittingOrder ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>ĐANG XỬ LÝ ĐƠN HÀNG...</span>
                        </>
                      ) : (
                        <>
                          <span>XÁC NHẬN ĐẶT ĐƠN HÀNG</span>
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
