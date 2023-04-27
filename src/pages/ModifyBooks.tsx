import { useEffect, useState } from "react";
import { readBooksData } from "../firebase/firebaseCRUD";
import { Book, Thumbnail } from "../interfaces/modifyBooksInterface";
import { ModifyBookCard } from "../components/ModifyBookCard";
import "../scss/modifyBooks.scss";
import "../scss/searchBar.scss";
import { getStorage } from "firebase/storage";
import { getApp } from "firebase/app";
import { loadAllImages } from "../firebase/storage";
import { toast } from "react-toastify";
import { SearchBarModifyBookCard } from "../components/SearchBarModifyBookCard";

// const firebaseApp = getApp();

export const ModifyBooks = () => {
  const [booksObject, setBooksObject] = useState<
    {
      bookUID: string;
      bookId: string;
      bookName: string;
      stage: string | undefined;
    }[]
  >();
  const [thumbnails, setThumbnails] = useState<Book[] | any>();
  const [thumbnailNameArray, setThumbnailNameArray] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<
    {
      bookUID: string;
      bookId: string;
      bookName: string;
      stage: string | undefined;
    }[]
  >();
  const [isGrouped, setIsGrouped] = useState(false);
  const [stages, setStages] = useState<string[]>([]);

  useEffect(() => {
    readBooksData()
      .then((res) => {
        setBooksObject(res.message.books);

        setSearchResults(res.message.books);

        const books = res.message.books;
        books.map(
          (book: {
            bookUID: string;
            bookId: string;
            bookName: string;
            stage: string | undefined;
          }) => {
            if (book.stage && !stages.includes(book.stage)) {
              stages.push(book.stage);
              setStages((current: any) => [current, book.stage]);
            }
            if (book.stage == undefined && !stages.includes("undefined")) {
              stages.push("undefined");
              setStages((current: any) => [current, book.stage]);
            }
          }
        );
        setStages(stages.sort());
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
      <div className="modify-books-container">
        <SearchBarModifyBookCard
          booksObject={booksObject}
          setBooksObject={setBooksObject}
          setSearchResults={setSearchResults}
          searchResults={searchResults}
          isGrouped={isGrouped}
          setIsGrouped={setIsGrouped}
        />
        {!isGrouped && (
          <div className="modify-books-div">
            {searchResults?.map((book: any) => {
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
                  setSearchResults={setSearchResults}
                ></ModifyBookCard>
              );
            })}
            {searchResults?.length === 0 && (
              <div className="no-books-found">
                <h2>No books found</h2>
              </div>
            )}
          </div>
        )}
        {isGrouped && (
          <div className={`modify-books-div `}>
            {stages.map((stage) => {
              return (
                <div
                  className={`stages-div ${
                    searchResults?.filter((book) => {
                      if (stage === "undefined") {
                        return book.stage === undefined;
                      }
                      return book.stage === stage;
                    }).length === 0
                      ? "staged-div-hidden"
                      : ""
                  }`}
                  id="stages-div"
                  key={"stage-" + stage}
                >
                  {stage !== "undefined" && (
                    <h3 className="stage-name">Stage {stage}</h3>
                  )}
                  {stage === "undefined" && (
                    <h3 className="stage-name">No staged books</h3>
                  )}
                  <div className="stage-cards">
                    {searchResults
                      ?.filter((book: any) => {
                        if (stage === "undefined") {
                          return book.stage === undefined;
                        }
                        return book.stage === stage;
                      })
                      .map((book: any) => {
                        return (
                          <ModifyBookCard
                            key={book.bookId}
                            bookId={book.bookId}
                            bookName={book.bookName}
                            thumbnailURL={
                              book.thumbnailURL ? book.thumbnailURL : ""
                            }
                            stage={book.stage ? book.stage : 0}
                            bookUID={book.bookUID}
                            thumbnailSrc={findThumbnailUrl(book.bookId)}
                            setThumbnailNameArray={setThumbnailNameArray}
                            thumbnailNameArray={thumbnailNameArray}
                            setThumbnails={setThumbnails}
                            booksObject={booksObject}
                            setBooksObject={setBooksObject}
                            setSearchResults={setSearchResults}
                          ></ModifyBookCard>
                        );
                      })}
                  </div>
                </div>
              );
            })}

            {searchResults?.length === 0 && (
              <div className={`no-books-found `}>
                <h2>No books found</h2>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return <div className="modify-books-page">{renderBookCards()}</div>;
};
