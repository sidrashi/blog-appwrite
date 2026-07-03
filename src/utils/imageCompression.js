import imageCompression from "browser-image-compression";

export async function compressImage(file) {
  const options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: "image/webp",
  };
  const compressedBlob = await imageCompression(file, options);
  return new File(
    [compressedBlob],
    file.name.replace(/\.[^/.]+$/, ".webp"),
    {
      type: compressedBlob.type,
      lastModified: Date.now(),
    },
  );
}
