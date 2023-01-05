import React, { useState } from "react";
import { docxToTxt } from "../functions/docxToTxt";
import { readDocxFile } from "../functions/readDocxFile";
import { readTxtFile } from "../functions/readTxtFile";

export const UploadQuestions = () => {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(Array.from(event.target.files as FileList));
  };

  files.forEach((file) => {
    // readDocxFile(file);
    // readTxtFile(file);
    docxToTxt(file);
  });
  return (
    <form>
      <label htmlFor="file-input">Select .docx files:</label>
      <input
        type="file"
        accept=".docx"
        id="file-input"
        multiple
        onChange={handleFileChange}
      />
      <ul>
        {files.map((file) => (
          <li key={file.name}>{file.name}</li>
        ))}
      </ul>
      <div id="docx-container"></div>
      <div id="txt-container"></div>
    </form>
  );
};
