import { Dispatch, SetStateAction, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiUpload } from "react-icons/bi";
import { MdCalendarViewMonth } from "react-icons/md";
import {
  FaLayerGroup,
  FaSortAmountDownAlt,
  FaSortNumericDown,
  FaSortNumericDownAlt,
} from "react-icons/fa";
import {
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";
export const SearchBarModifyBookCard = (props: {
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
  searchResults:
    | {
        bookUID: string;
        bookId: string;
        bookName: string;
        stage: string | undefined;
      }[]
    | undefined;
  isGrouped: boolean;
  setIsGrouped: Dispatch<SetStateAction<boolean>>;
}) => {
  const booksObject = props.booksObject;
  const setBooksObject = props.setBooksObject;
  const [searchWord, setSearchWord] = useState("");
  const searchResults = props.searchResults;
  const setSearchResults = props.setSearchResults;
  const navigate = useNavigate();
  const isGrouped = props.isGrouped;
  const setIsGrouped = props.setIsGrouped;
  return (
    <div className="search-bar-container">
      <h2 className="books-length">{booksObject?.length} books</h2>
      <div className="search-bar">
        <input
          className="search-bar-input"
          type="text"
          placeholder="search for book names or book Id"
          onChange={(e) => {
            setSearchWord(e.target.value);

            if (e.target.value !== "") {
              setSearchResults(
                booksObject?.filter((book) => {
                  return book.bookName.includes(e.target.value);
                })
              );
              setSearchResults(
                booksObject?.filter((book) => {
                  return (
                    book.bookName
                      .toLocaleLowerCase()
                      .includes(e.target.value.toLocaleLowerCase()) ||
                    book.bookId
                      .toLocaleLowerCase()
                      .includes(e.target.value.toLocaleLowerCase())
                  );
                })
              );
            } else {
              setSearchResults(booksObject);
              setSearchResults(booksObject);
            }
          }}
        />
        <div className="filter-stages">
          <select
            className="search-select-stage"
            name="search-select-stage"
            id="search-select-stage"
            defaultValue=" "
            onChange={(e) => {
              if (e.target.value === "none") {
                setSearchResults(
                  booksObject?.filter((book) => {
                    return book.stage === undefined;
                  })
                );
              } else if (e.target.value !== "all") {
                setSearchResults(
                  booksObject?.filter((book) => {
                    return book.stage && book.stage === e.target.value;
                  })
                );
              } else {
                setSearchResults(booksObject);
              }

              // console.log(e.target.value);
            }}
          >
            <option value="all">All</option>
            <option value="1">Stage 1</option>
            <option value="2">Stage 2</option>
            <option value="3">Stage 3</option>
            <option value="4">Stage 4</option>
            <option value="5">Stage 5</option>
            <option value="6">Stage 6</option>
            <option value="none">Unstaged</option>
          </select>
        </div>
        <div className="sort-by">
          <select
            className="select-sort-by"
            name="search-sort-by"
            id="search-sort-by"
            onChange={(e) => {
              if (e.target.value === "a-z" && searchResults !== undefined) {
                setSearchResults(
                  [...searchResults].sort((a, b) =>
                    a.bookName > b.bookName ? 1 : -1
                  )
                );
              } else if (
                e.target.value === "z-a" &&
                searchResults !== undefined
              ) {
                setSearchResults(
                  [...searchResults].sort((b, a) =>
                    a.bookName > b.bookName ? 1 : -1
                  )
                );
              } else if (
                e.target.value === "stage 1-6" &&
                searchResults !== undefined
              ) {
                setSearchResults(
                  [...searchResults].sort((a, b) => {
                    if (a.stage === undefined) return 1;
                    if (b.stage === undefined) return -1;
                    return a.stage > b.stage ? 1 : -1;
                  })
                );
              } else if (
                e.target.value === "stage 6-1" &&
                searchResults !== undefined
              ) {
                setSearchResults(
                  [...searchResults].sort((b, a) => {
                    if (a.stage === undefined) return 1;
                    if (b.stage === undefined) return -1;
                    return a.stage > b.stage ? 1 : -1;
                  })
                );
              }
            }}
          >
            <option value="a-z"> A-Z</option>
            <option value="z-a">Z-A</option>
            <option value="stage 1-6">Stage 1-6</option>
            <option value="stage 6-1"> Stage 6-1</option>
            <option value="new-old">Newest First</option>
            <option value="old-new">Oldest First</option>
          </select>
        </div>
        <div
          className={`search-group ${
            isGrouped ? "grouped-view" : "ungrouped-view"
          }`}
          onClick={() => {
            setIsGrouped(!isGrouped);
          }}
        >
          <FaLayerGroup />
        </div>
      </div>
      <button
        className="btn-upload-books"
        onClick={() => {
          navigate("/upload-questions");
        }}
      >
        <BiUpload />
        <span> Upload Books</span>
      </button>
    </div>
  );
};
