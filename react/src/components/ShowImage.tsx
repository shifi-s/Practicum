import { useState } from "react";
import jsmediatags from "jsmediatags";


const UploadSong = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      jsmediatags.read(file, {
        onSuccess: (tag) => {
          if (tag.tags.picture) {
            const { data, format } = tag.tags.picture;
            const base64String = btoa(String.fromCharCode(...new Uint8Array(data)));
            setImageSrc(`data:${format};base64,${base64String}`);
          }
        },
        onError: (error) => {
          console.error("Error reading metadata:", error);
        },
      });
    }
  };

  return (
    <div>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      {imageSrc && <img src={imageSrc} alt="Album Art" style={{ width: 200, height: 200 }} />}
    </div>
  );
};

export default UploadSong;
