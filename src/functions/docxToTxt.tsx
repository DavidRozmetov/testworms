import JSZip from "jszip";

export const docxToTxt = async (file: File) => {
  const fileReader = new FileReader();

  fileReader.onload = (event) => {
    const content = event.target?.result;
    if (!content) {
      return;
    }

    // Parse the .docx file content as a JSZip object
    const zip = new JSZip();
    zip.loadAsync(content).then((zip: any) => {
      // Extract the text from the "word/document.xml" file in the .docx file
      zip
        .file("word/document.xml")
        .async("string")
        .then((documentXml: any) => {
          // Use a regular expression to extract the text from the document XML
          const text = documentXml.match(/[^<>]+/g);
          if (!text) {
            return;
          }

          // Create a new .txt file with the extracted text
          const txtFile = new Blob(text, { type: "text/plain" });

          // Download the .txt file
          const a = document.createElement("a");
          a.href = URL.createObjectURL(txtFile);
          a.download = "document.txt";
          a.click();
        });
    });
  };

  fileReader.readAsArrayBuffer(file);
};
