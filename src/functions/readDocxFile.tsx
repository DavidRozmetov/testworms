import JSZip from "jszip";

export const readDocxFile = async (file: File) => {
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

          // Convert the text to HTML
          const html = text
            .map((line: any) => {
              return `<p>${line}</p>`;
            })
            .join("");

          // Insert the HTML into the page
          const container = document.getElementById("docx-container");
          if (container) {
            container.innerHTML = html;
          }
        });
    });
  };

  fileReader.readAsArrayBuffer(file);
};
