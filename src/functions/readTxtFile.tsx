export const readTxtFile = (file: any) => {
  const fileReader = new FileReader();

  fileReader.onload = (event) => {
    const content: any = event.target?.result;
    if (!content) {
      return;
    }

    // Split the content into lines
    const lines = content.split("\n");

    // Convert the lines to HTML
    const html = lines
      .map((line: any) => {
        return `<p>${line}</p>`;
      })
      .join("");

    // Insert the HTML into the page
    const container = document.getElementById("txt-container");
    if (container) {
      container.innerHTML = html;
      //   console.log("content");
    }
    // console.log(content);
  };

  fileReader.readAsText(file);
};
