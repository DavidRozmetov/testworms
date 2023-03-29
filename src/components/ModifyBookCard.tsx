import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { deleteBook, updateData } from "../firebase/firebaseCRUD";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { RxCross1 } from "react-icons/rx";
import { FiEdit2 } from "react-icons/fi";
import { BsEraserFill, BsInfoCircle } from "react-icons/bs";
import { toast } from "react-toastify";
import { deleteThumbnail, loadImage, uploadImage } from "../firebase/storage";
import { BiUpload } from "react-icons/bi";

export const ModifyBookCard = (props: {
  bookName: string;
  bookId: string;
  thumbnailURL: string;
  stage: number;
  bookUID: string;
  thumbnailSrc: string;
  setThumbnailNameArray: Dispatch<SetStateAction<string[]>>;
  thumbnailNameArray: string[];
  setThumbnails: Dispatch<SetStateAction<any[]>>;
  booksObject:
    | {
        bookUID: string;
        bookId: string;
        bookName: string;
        stage: string | undefined;
      }[]
    | undefined;
  setBooksObject: Dispatch<
    SetStateAction<
      | {
          bookUID: string;
          bookId: string;
          bookName: string;
          stage: string | undefined;
        }[]
      | undefined
    >
  >;
  setSearchResults: Dispatch<
    SetStateAction<
      | {
          bookUID: string;
          bookId: string;
          bookName: string;
          stage: string | undefined;
        }[]
      | undefined
    >
  >;
}) => {
  const bookId = props.bookId;
  const bookName = props.bookName;
  const stage = props.stage;
  const bookUID = props.bookUID;
  const booksObject = props.booksObject;
  const setBooksObject = props.setBooksObject;
  const [thumbnailURL, setThumbnailURL] = useState("");
  const setThumbnailNameArray = props.setThumbnailNameArray;
  const thumbnailNameArray = props.thumbnailNameArray;
  const setThumbnails = props.setThumbnails;
  const setSearchResults = props.setSearchResults;
  const [progress, setProgress] = useState<number>(0);
  const [thumbnailUpload, setThumbnailUpload] = useState<File>();
  const [isThumbnailDeleted, setIsThumbnailDeleted] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [infoEditThumbnailVisible, setInfoEditThumbnailVisible] =
    useState(false);
  const [infoDeleteThumbnailVisible, setInfoDeleteThumbnailVisible] =
    useState(false);

  if (thumbnailURL !== "") {
    const formHTMLObject = document.getElementById(`book-card-${bookId}`);

    if (formHTMLObject) {
      // formHTMLObject.style.backgroundImage = `url(${thumbnailURL})`;
    }
  }
  useEffect(() => {
    setThumbnailURL(props.thumbnailSrc);
  }, [props.thumbnailSrc]);

  return (
    <div
      id={`book-card-${bookId}`}
      className={`modify-book-card ${"modify-book-card-no-background"}`}
    >
      <div className="card-image-div">
        {thumbnailURL && (
          <>
            <img
              src={thumbnailURL}
              id={`book-${bookId}`}
              alt="book-thumbnail"
              className="card-image-img"
            />

            {thumbnailURL !== "" && (
              <div className="thumbnail-buttons">
                <div className="edit-thumbnail-container">
                  {infoEditThumbnailVisible && (
                    <span className="edit-thumbnail-info">
                      Change the book Thumbnail
                    </span>
                  )}
                  <div
                    className="edit-thumbnail-div"
                    onMouseEnter={() => {
                      setInfoEditThumbnailVisible(true);
                    }}
                    onMouseLeave={() => {
                      setInfoEditThumbnailVisible(false);
                    }}
                  >
                    <label
                      htmlFor="file-input"
                      className="edit-thumbnail-label"
                    >
                      <FiEdit2 />
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      title="upload thumbail here"
                      id="file-input"
                      className="custom-file-input"
                      onChange={(e) => {
                        if (e.target.files) {
                          setThumbnailUpload(e.target.files[0]);
                          uploadImage(
                            e.target.files[0],
                            "thumbnails",
                            bookId,
                            setProgress
                          ).then((newThumbnailData) => {
                            setThumbnails((oldArray) => [
                              ...oldArray,
                              newThumbnailData,
                            ]);
                            setThumbnailNameArray((oldArray) => [
                              ...oldArray,
                              newThumbnailData.name,
                            ]);
                            toast.success(
                              "Thumbnail has been uploaded successfully!",
                              {
                                position: "top-right",
                                autoClose: 2000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "light",
                              }
                            );
                          });
                        }
                      }}
                    />
                  </div>
                </div>

                {infoDeleteThumbnailVisible && (
                  <span className="delete-thumbnail-info">
                    Delete Thumbnail
                  </span>
                )}

                <button
                  className="btn-delete-thumbnail"
                  onMouseEnter={() => {
                    setInfoDeleteThumbnailVisible(true);
                  }}
                  onMouseLeave={() => {
                    setInfoDeleteThumbnailVisible(false);
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    deleteThumbnail(
                      bookId,
                      thumbnailNameArray,
                      setThumbnailNameArray
                    ).then((res) => {
                      setIsThumbnailDeleted(true);
                      setThumbnailURL("");
                      const formHTMLObject = document.getElementById(
                        `book-card-${bookId}`
                      );

                      if (formHTMLObject) {
                        setTimeout(() => {
                          formHTMLObject.style.backgroundImage = "none";
                        }, 300);
                      }
                      if (res.status === 200) {
                        toast.success(res.message, {
                          position: "top-right",
                          autoClose: 2000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                          theme: "light",
                        });
                      } else {
                        toast.error(res.message, {
                          position: "top-right",
                          autoClose: 2000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                          theme: "light",
                        });
                      }
                    });
                  }}
                >
                  <BsEraserFill />
                </button>
              </div>
            )}
          </>
        )}
        {!thumbnailURL && (
          <div className="no-thumbnail-available">
            <span>[no thumbnail available!]</span>

            <input
              data-label-text={
                <span>
                  Upload here <BiUpload />
                </span>
              }
              type="file"
              accept="image/*"
              title=" "
              id="file-input"
              className="custom-file-input"
              onChange={(e) => {
                if (e.target.files) {
                  setThumbnailUpload(e.target.files[0]);
                  uploadImage(
                    e.target.files[0],
                    "thumbnails",
                    bookId,
                    setProgress
                  ).then((newThumbnailData) => {
                    setThumbnails((oldArray) => [
                      ...oldArray,
                      newThumbnailData,
                    ]);
                    setThumbnailNameArray((oldArray) => [
                      ...oldArray,
                      newThumbnailData.name,
                    ]);
                    setThumbnailURL(props.thumbnailSrc);
                    toast.success("Thumbnail has been uploaded successfully!", {
                      position: "top-right",
                      autoClose: 2000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "light",
                    });
                  });
                }
              }}
            />
            <label
              htmlFor="file-input"
              className="custom-file-input-label"
              data-label-text="Upload here"
            >
              <BiUpload /> Upload here
            </label>
          </div>
        )}
        <div
          className={`progress-bar-upload-thumbnail-div 
        ${
          progress > 0 && progress < 100
            ? "progress-bar-upload-thumbnail-visible"
            : "progress-bar-upload-thumbnail-hidden"
        } 
        
      `}
        >
          <CircularProgressbar
            className="progress-bar-upload-thumbnail"
            value={progress}
            text={`${progress}%`}
          />
        </div>
      </div>

      <div className="outer-buttons">
        <button
          className="btn-delete-book"
          title={`delete ${bookName}`}
          onClick={(e) => {
            deleteBook(bookId).then((res) => {
              toast.success(res.message, { autoClose: 2000 });
            });
            e.preventDefault();
            setSearchResults(
              booksObject?.filter((book) => {
                return book.bookId !== bookId;
              })
            );
            setBooksObject(
              booksObject?.filter((book) => {
                return book.bookId !== bookId;
              })
            );
          }}
        >
          {" "}
          <RxCross1 />
        </button>

        <div
          className={`book-id-div ${
            infoVisible ? "book-id-div-visbile" : "book-id-div-hidden"
          }`}
        >
          <span className="book-id-text"> Book ID: {bookId}</span>
        </div>
        <button
          className="btn-book-info"
          onClick={(e) => {
            e.preventDefault();
          }}
          onMouseEnter={(e) => {
            setInfoVisible(true);
          }}
          onMouseLeave={(e) => {
            setTimeout(() => {
              setInfoVisible(false);
            }, 1000);
          }}
        >
          <BsInfoCircle className="book-info-icon" />
        </button>
      </div>

      <div className="card-head">
        <h2>{bookName}</h2>
      </div>

      <div className="book-info">
        <a href={`modify-questions/${bookId}`}>Questions</a>
        <a href={`modify-questions/${bookId}`}>50</a>
        <label htmlFor="select-stage">Stages</label>
        <select
          name="select-stage"
          id="select-stage"
          placeholder={stage + ""}
          defaultValue={stage}
          onChange={async (e) => {
            const lv = e.target.value;
            updateData("books", bookUID, {
              stage: lv,
            }).then((res) => {
              if (res.status === 200) {
                toast.success(bookName + " stage updated to " + lv);
              } else {
                res.error("Something went wrong! Couldn't update the level");
              }
            });
          }}
        >
          <option value="">-</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
        </select>
      </div>
    </div>
  );
};
