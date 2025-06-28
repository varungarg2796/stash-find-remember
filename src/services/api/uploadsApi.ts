import { apiClient } from './apiClient';

/**
 * Handles the upload of a single image file.
 * @param imageFile - The File object to upload.
 * @returns A promise that resolves to an object with the uploaded image's URL.
 */
const uploadImage = (imageFile: File): Promise<{ url: string }> => {
  // Use a FormData object to send the file
  const formData = new FormData();
  formData.append('file', imageFile); // 'file' must match the backend FileInterceptor key

  // The apiClient's post method is smart enough to handle FormData.
  // We should NOT pass any custom headers here. The browser will set the
  // 'Content-Type: multipart/form-data' with the correct boundary automatically.
  return apiClient.post('/uploads/image', formData);
};

export const uploadsApi = {
  uploadImage,
};