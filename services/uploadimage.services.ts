

export const uploadImage  = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'sinhviennet'); // Replace with your Cloudinary upload preset

    const res = await fetch('https://api.cloudinary.com/v1_1/dgmvr9lnh/image/upload', {
        method: 'POST',
        body: formData,
    });

    const data = await res.json();
    return data.secure_url;
}