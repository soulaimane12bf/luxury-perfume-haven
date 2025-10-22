import { put, del, list } from '@vercel/blob';

/**
 * Generate a short, clean filename
 * @param {string} originalName - Original file name
 * @returns {string} - Short clean filename (e.g., 'abc123.jpg')
 */
function generateShortFilename(originalName) {
  // Get file extension
  const ext = originalName.split('.').pop().toLowerCase();
  
  // Generate short random ID (6 characters)
  const randomId = Math.random().toString(36).substring(2, 8);
  
  return `${randomId}.${ext}`;
}

/**
 * Upload an image file to Vercel Blob Storage
 * @param {File} file - The file object to upload
 * @param {string} folder - Folder name (e.g., 'sliders', 'products')
 * @returns {Promise<string>} - The public URL of the uploaded file
 */
export async function uploadImageToVercel(file, folder = 'sliders') {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error('BLOB_READ_WRITE_TOKEN is not configured in environment variables');
    }

    // Generate short filename: sliders/abc123.jpg
    const shortFilename = generateShortFilename(file.originalname);
    const filename = `${folder}/${shortFilename}`;
    
    console.log(`📤 Uploading image to Vercel Blob: ${filename}`);
    
    const blob = await put(filename, file.buffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    console.log(`✅ Image uploaded successfully: ${blob.url}`);
    return blob.url;
  } catch (error) {
    console.error('❌ Error uploading to Vercel Blob:', error);
    throw error;
  }
}

/**
 * Delete an image from Vercel Blob Storage
 * @param {string} url - The URL of the image to delete
 * @returns {Promise<void>}
 */
export async function deleteImageFromVercel(url) {
  try {
    if (!url || !url.includes('vercel-storage.com')) {
      console.log('⚠️ Not a Vercel Blob URL, skipping deletion');
      return;
    }

    console.log(`🗑️  Deleting image from Vercel Blob: ${url}`);
    
    await del(url, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    console.log(`✅ Image deleted successfully`);
  } catch (error) {
    console.error('❌ Error deleting from Vercel Blob:', error);
    // Don't throw - allow deletion to continue even if blob deletion fails
  }
}

/**
 * List all images in a folder
 * @param {string} folder - Folder name to list
 * @returns {Promise<Array>} - Array of blob objects
 */
export async function listImagesInFolder(folder = 'sliders') {
  try {
    const { blobs } = await list({
      prefix: `${folder}/`,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return blobs;
  } catch (error) {
    console.error('❌ Error listing images:', error);
    return [];
  }
}
