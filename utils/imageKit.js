const FormData = require('form-data');
const fetch = require('node-fetch');

const getAuthHeader = () => {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  
  console.log('ImageKit Private Key:', privateKey ? privateKey.substring(0, 20) + '...' : 'MISSING');
  
  // ImageKit API requires: username = privateKey, password = empty
  const auth = 'Basic ' + Buffer.from(privateKey + ':').toString('base64');
  return auth;
};

const uploadImageToImageKit = async (base64Data, fileName) => {
  try {
    const formData = new FormData();
    
    formData.append('file', base64Data);
    formData.append('fileName', fileName);
    formData.append('useUniqueFileName', 'false');

    const response = await fetch(
      'https://upload.imagekit.io/api/v1/files/upload',
      {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
          ...formData.getHeaders()
        },
        body: formData
      }
    );

    console.log('ImageKit response status:', response.status);
    
    const data = await response.json();
    
    // Check for errors
    if (!response.ok || data.error) {
      console.log('ImageKit error:', data.message || data.error);
      return null; // Signal failure for fallback
    }

    return {
      url: data.url,
      fileId: data.fileId
    };
  } catch (error) {
    console.error('ImageKit upload error:', error.message);
    return null;
  }
};

const deleteImageFromImageKit = async (fileId) => {
  try {
    const response = await fetch(
      `https://upload.imagekit.io/api/v1/files/${fileId}/delete`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': getAuthHeader()
        }
      }
    );

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    return true;
  } catch (error) {
    console.error('ImageKit delete error:', error);
    throw error;
  }
};

const bufferToDataURL = (buffer, mimeType) => {
  const base64 = buffer.toString('base64');
  return `data:${mimeType};base64,${base64}`;
};

module.exports = {
  uploadImageToImageKit,
  deleteImageFromImageKit,
  bufferToDataURL
};
