import React, { useState } from 'react';

const useSelectFile = () => {
  const [selectedFile, setSelectedFile] = useState<string>();

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    const uploadedImage = e.target.files?.[0];

    if (uploadedImage) {
      reader.readAsDataURL(uploadedImage);
    }

    reader.onload = readerEvent => {
      if (readerEvent.target?.result) {
        setSelectedFile(readerEvent.target.result as string);
      }
    };
  };

  return { selectedFile, setSelectedFile, onSelectFile };
};

export default useSelectFile;
