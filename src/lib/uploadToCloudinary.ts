export const uploadToCloudinary = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'roommate_upload');
    
    const res = await fetch(`https://api.cloudinary.com/v1_1/dkierfkuf/image/upload`, {
      method: 'POST',
      body: formData,
    });
  
    const data = await res.json();
    return data.secure_url || null;
  };
  