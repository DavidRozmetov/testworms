import { useEffect, useState } from "react";
import { readBooksData } from "../firebase/firebaseCRUD";
import { Book, Thumbnail } from "../interfaces/modifyBooksInterface";
import { ModifyBookCard } from "../components/ModifyBookCard";
import "../scss/modifyBooks.scss";
import { getStorage } from "firebase/storage";
import { getApp } from "firebase/app";
import { loadAllImages } from "../firebase/storage";
import { toast } from "react-toastify";

// const firebaseApp = getApp();

export const ModifyBooks = () => {
  const [booksObject, setBooksObject] =
    useState<{ bookUID: string; bookId: string; bookName: string }[]>();
  const [thumbnails, setThumbnails] = useState<Book[] | any>();
  const [thumbnailNameArray, setThumbnailNameArray] = useState<string[]>([]);

  useEffect(() => {
    readBooksData()
      .then((res) => {
        setBooksObject(res.message.books);
      })
      .catch((error: any) => {
        console.error("Error reading books data:", error);
      });

    loadAllImages("thumbnails")
      .then((thumbnailURLs) => {
        setThumbnails(thumbnailURLs);

        thumbnailURLs.forEach((thumbnailUrl) => {
          setThumbnailNameArray((oldArray) => [...oldArray, thumbnailUrl.name]);
        });
      })

      .catch((error) => {
        console.error(error);
      });
  }, []);

  const thumbnailExists = (bookId: string) => {
    return thumbnailNameArray.includes(bookId);
  };

  const findThumbnailUrl = (bookId: string) => {
    if (thumbnailExists(bookId)) {
      return thumbnails.filter((thumbnail: Thumbnail) => {
        return thumbnail.name === bookId;
      })[0].url;
    } else {
      return "";
    }
  };
  const renderBookCards = () => {
    return (
      <div className="modify-books-div">
        {booksObject?.map((book: any) => {
          return (
            <ModifyBookCard
              key={book.bookId}
              bookId={book.bookId}
              bookName={book.bookName}
              thumbnailURL={book.thumbnailURL ? book.thumbnailURL : ""}
              stage={book.stage ? book.stage : 0}
              bookUID={book.bookUID}
              thumbnailSrc={findThumbnailUrl(book.bookId)}
              setThumbnailNameArray={setThumbnailNameArray}
              thumbnailNameArray={thumbnailNameArray}
              setThumbnails={setThumbnails}
              booksObject={booksObject}
              setBooksObject={setBooksObject}
            ></ModifyBookCard>
          );
        })}
      </div>
    );
  };

  return <div className="modify-books-page">{renderBookCards()}</div>;
};
