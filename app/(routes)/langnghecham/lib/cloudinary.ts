/**
 * Utility for uploading files to Cloudinary
 */
export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'sinhviennet'); // Replace with your Cloudinary upload preset

  const res = await fetch('https://api.cloudinary.com/v1_1/dgmvr9lnh/image/upload', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Không thể tải ảnh lên Cloudinary. Vui lòng kiểm tra lại cấu hình hoặc kết nối mạng.');
  }

  const data = await res.json();
  return data.secure_url as string;
};
