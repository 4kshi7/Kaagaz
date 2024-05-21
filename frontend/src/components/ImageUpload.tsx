// ImageUpload.tsx
import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebaseConfig";
import { v4 } from "uuid";

const ImageUpload: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image first!");
      return;
    }

    const imageRef = ref(storage, `images/${v4()}`);
    try {
      await uploadBytes(imageRef, image);
      const downloadUrl = await getDownloadURL(imageRef);
      setUrl(downloadUrl);
      console.log("Image uploaded successfully, URL:", downloadUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleUpload}>Upload Image</button>
      {url && (
        <div>
          <p>Image uploaded successfully!</p>
          <img src={url} alt="Uploaded" />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
