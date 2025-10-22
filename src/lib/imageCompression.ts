/**
 * Compress an image file to reduce its size before upload
 * @param file - The original image file
 * @param maxSizeMB - Maximum size in MB (default: 3MB for Vercel safety margin)
 * @param maxWidthOrHeight - Maximum width or height in pixels (default: 1920)
 * @returns Compressed image file or original if compression fails
 */
export async function compressImage(
  file: File,
  maxSizeMB: number = 3,
  maxWidthOrHeight: number = 1920
): Promise<File> {
  // If file is already small enough, return it
  const fileSizeMB = file.size / 1024 / 1024;
  if (fileSizeMB <= maxSizeMB) {
    console.log(`✅ Image already optimized: ${fileSizeMB.toFixed(2)}MB`);
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        if (width > height && width > maxWidthOrHeight) {
          height = (height * maxWidthOrHeight) / width;
          width = maxWidthOrHeight;
        } else if (height > maxWidthOrHeight) {
          width = (width * maxWidthOrHeight) / height;
          height = maxWidthOrHeight;
        }

        // Create canvas to draw resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          console.error('❌ Failed to get canvas context');
          resolve(file); // Return original on error
          return;
        }

        // Draw resized image
        ctx.drawImage(img, 0, 0, width, height);

        // Try different quality levels until we get under maxSizeMB
        let quality = 0.9;
        const attemptCompression = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                console.error('❌ Failed to create blob');
                resolve(file);
                return;
              }

              const compressedSizeMB = blob.size / 1024 / 1024;
              
              // If still too large and quality can be reduced, try again
              if (compressedSizeMB > maxSizeMB && quality > 0.5) {
                quality -= 0.1;
                attemptCompression();
                return;
              }

              // Create new file from blob
              const compressedFile = new File(
                [blob],
                file.name,
                {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                }
              );

              console.log(`📦 Image compressed: ${fileSizeMB.toFixed(2)}MB → ${compressedSizeMB.toFixed(2)}MB (${((1 - compressedSizeMB / fileSizeMB) * 100).toFixed(1)}% reduction)`);
              resolve(compressedFile);
            },
            'image/jpeg',
            quality
          );
        };

        attemptCompression();
      };

      img.onerror = () => {
        console.error('❌ Failed to load image');
        resolve(file); // Return original on error
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      console.error('❌ Failed to read file');
      resolve(file); // Return original on error
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Compress multiple images in parallel
 */
export async function compressImages(
  files: File[],
  maxSizeMB: number = 3,
  maxWidthOrHeight: number = 1920
): Promise<File[]> {
  return Promise.all(
    files.map(file => compressImage(file, maxSizeMB, maxWidthOrHeight))
  );
}
