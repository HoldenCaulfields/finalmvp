/**
 * Cloudinary Unsigned Image Upload helper
 * Enables browser-to-cloud serverless uploading using unsigned presets.
 */
export async function uploadToCloudinary(
  file: File, 
  cloudName: string, 
  preset: string
): Promise<string> {

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'sinhviennet');

  const endpoint = `https://api.cloudinary.com/v1_1/dgmvr9lnh/image/upload`;
  
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cloudinary raw error details:', errorText);
      throw new Error(`Cloudinary upload returned status ${response.status}. Please check your CloudName and Upload Preset in the app's settings panel.`);
    }

    const jsonResult = await response.json();
    if (jsonResult && jsonResult.secure_url) {
      return jsonResult.secure_url;
    }
    throw new Error('Cloudinary response missing secure_url field.');
  } catch (err: any) {
    console.error('Error during Cloudinary uploading process:', err);
    throw err;
  }
}

/**
 * Custom Base64 client-side backup tool
 * Utilized if the user wants to test quickly without full Cloudinary setups.
 */
export function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}
