import { useState } from "react";
import { deleteBook } from "../firebase/firebaseCRUD";

import { deleteThumbnail, uploadImage } from "../firebase/storage";

export const ModifyBookCard = (props: {
  bookName: string;
  bookId: string;
  thumbnailURL: string;
  stage: number;
  bookUID: string;
  thumbnailSrc: string;
}) => {
  const bookId = props.bookId;
  const bookName = props.bookName;
  const stage = props.stage;
  const bookUID = props.bookUID;
  const thumbnailURL = props.thumbnailSrc;

  const [thumbnailUpload, setThumbnailUpload] = useState<File>();
  if (thumbnailURL !== "") {
    const formHTMLObject = document.getElementById(`book-card-${bookId}`);

    if (formHTMLObject) {
      formHTMLObject.style.backgroundImage = `url(${thumbnailURL})`;
    }
  }

  return (
    <form
      id={`book-card-${bookId}`}
      action=""
      className={`modify-book-card ${
        thumbnailURL !== ""
          ? "modify-book-card-with-background"
          : "modify-book-card-no-background"
      }`}
    >
      <div className="card-head">
        <h3>{bookId}</h3>
        <h2>{bookName}</h2>
      </div>

      <div className="buttons">
        <input
          type="file"
          accept="image/*"
          title=" "
          id="file-input"
          className="custom-file-input"
          onChange={(e) => {
            if (e.target.files) {
              setThumbnailUpload(e.target.files[0]);
              uploadImage(e.target.files[0], "thumbnails", bookId);
            }
          }}
        />
        <button
          className="btn-delete-thumbnail"
          onClick={(e) => {
            e.preventDefault();
            deleteThumbnail(bookId);
          }}
        >
          {" "}
          Delete thumbnail
        </button>

        <select name="select-stage" id="select-stage">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
        </select>

        <button
          className="btn-delete-book"
          onClick={(e) => {
            deleteBook(bookId);
            e.preventDefault();
          }}
        >
          {" "}
          Delete Book
        </button>
      </div>
    </form>
  );
};
