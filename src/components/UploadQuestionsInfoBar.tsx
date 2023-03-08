import { useState } from "react";

export const UploadQuestionsInfoBar = (props: {
  loadedBooks: number;
  failedBooks: string[];
}) => {
  const loadedBooks = props.loadedBooks;
  const failedBooks = props.failedBooks;
  const failedBooksNumber = props.failedBooks.length;
  const [isShown, setIsShown] = useState(false);

  const renderFailedBooks = () => {
    failedBooks.map((book) => {
      return <li>{book}</li>;
    });
  };
  return (
    <div className="upload-info-div">
      <ul className="upload-info-list">
        <li className="uploaded-info-success">
          {" "}
          <b>{loadedBooks}</b> were uploaded{" "}
        </li>
        <li
          className="uploaded-info-fail"
          onMouseEnter={() => setIsShown(true)}
          onMouseLeave={() => setIsShown(false)}
        >
          {" "}
          <b>{failedBooksNumber}</b> failed
          {isShown && failedBooks.length > 0 && (
            <ul className="failed-books-list">
              {failedBooks.map((book) => {
                return <li>{book}</li>;
              })}
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
};
