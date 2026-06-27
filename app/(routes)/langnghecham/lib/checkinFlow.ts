export interface CheckInPresetPhoto {
  id: string;
  name: string;
  url: string;
  desc: string;
}

export const CHECKIN_LOCATIONS = [
  'Sân khấu chính Quảng trường 16/4',
  'Gian hàng dệt Mỹ Nghiệp - Làng nghề',
  'Khu ẩm thực Chăm Lễ Hội',
  'Khu triển lãm gốm cổ Bàu Trúc',
  'Đền Tháp Bà Po Nagar',
  'Trung tâm Hội nghị tỉnh Khánh Hòa',
  'Khu thi đấu Thể thao bãi biển'
];

export const CHECKIN_PRESET_PHOTOS: CheckInPresetPhoto[] = [
  {
    id: 'p1',
    name: 'Múa Quạt',
    url: '/muacham.jpg',
    desc: 'Điệu múa quạt Chăm rực rỡ'
  },
  {
    id: 'p2',
    name: 'Làng Gốm',
    url: '/gombautruc.jpg',
    desc: 'Bàn tay nghệ nhân làm gốm'
  },
  {
    id: 'p3',
    name: 'Dệt vải',
    url: '/vhoa-cham.jpg',
    desc: 'Sợi tơ thổ cẩm rạng ngời'
  },
  {
    id: 'p4',
    name: 'Văn Hóa',
    url: 'thapcham.webp',
    desc: 'Khoảnh khắc biểu diễn và văn hóa Chăm'
  }
];

export const getDefaultAvatar = () => {
  const avatarIds = [
    '1534528741775-53994a69daeb',
    '1539571696357-5a69c17a67c6',
    '1507003211169-0a1dd7228f2d',
    '1494790108377-be9c29b29330',
    '1500648767791-00dcc994a43e'
  ];
  const randomId = avatarIds[Math.floor(Math.random() * avatarIds.length)];
  return `https://images.unsplash.com/photo-${randomId}?auto=format&fit=crop&w=100&h=100&q=80`;
};

export const getCheckInCoordinates = (
  locationName: string,
  id: string,
  lat?: number,
  lng?: number
): [number, number] => {
  if (lat !== undefined && lng !== undefined) {
    return [lat, lng];
  }

  const normalized = locationName.toLowerCase();

  if (normalized.includes('sân khấu') || normalized.includes('quảng trường 16/4') || normalized.includes('16/4')) {
    return [11.5679, 108.9897];
  }

  if (normalized.includes('gốm') || normalized.includes('bàu trúc')) {
    return [11.5738, 108.9375];
  }

  if (normalized.includes('dệt') || normalized.includes('mỹ nghiệp') || normalized.includes('làng nghề')) {
    return [11.5868, 108.9705];
  }

  if (normalized.includes('ẩm thực') || normalized.includes('food') || normalized.includes('sakaya')) {
    return [11.5687, 108.9908];
  }

  if (normalized.includes('tháp') || normalized.includes('po klong') || normalized.includes('poklong')) {
    return [11.5798, 108.9956];
  }

  if (normalized.includes('bãi biển') || normalized.includes('biển') || normalized.includes('ninh chữ') || normalized.includes('bình sơn')) {
    return [11.5822, 109.0368];
  }

  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }

  const latJitter = ((Math.abs(hash) % 100) / 10000) - 0.005;
  const lngJitter = ((Math.abs(hash >> 2) % 100) / 10000) - 0.005;

  return [11.5679 + latJitter, 108.9897 + lngJitter];
};
