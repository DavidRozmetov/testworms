import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { BiUpload } from "react-icons/bi";

import { FaLayerGroup } from "react-icons/fa";
import { BooksWithUID } from "../interfaces/Interfaces";

export const SearchBarModifyBookCard = (props: {
  booksObject: BooksWithUID[] | undefined;
  setBooksObject: Dispatch<SetStateAction<BooksWithUID[] | undefined>>;
  setSearchResults: Dispatch<SetStateAction<BooksWithUID[] | undefined>>;
  searchResults: BooksWithUID[] | undefined;
  isGrouped: boolean;
  setIsGrouped: Dispatch<SetStateAction<boolean>>;
}) => {
  const booksObject = props.booksObject;

  const searchResults = props.searchResults;
  const setSearchResults = props.setSearchResults;
  const navigate = useNavigate();
  const isGrouped = props.isGrouped;
  const setIsGrouped = props.setIsGrouped;
  // const [params, setParams] = useState<any>({});
  let params: any = {};
  const [searchParams] = useSearchParams();
  const pathname = window.location.pathname;
  const filterNames = (obj: BooksWithUID[] | undefined, keyword: string) => {
    if (keyword !== "") {
      return obj?.filter((book) => {
        return (
          book.bookName
            .toLocaleLowerCase()
            .includes(keyword.toLocaleLowerCase()) ||
          book.bookId.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())
        );
      });
    } else {
      return obj;
    }
  };

  const filterStages = (obj: BooksWithUID[] | undefined, stage: string) => {
    if (stage === "") {
      return obj;
    } else if (stage === "none") {
      return obj?.filter((book) => {
        return book.stage === undefined;
      });
    } else if (stage !== "all") {
      return obj?.filter((book) => {
        return book.stage && book.stage === stage;
      });
    } else {
      return obj;
    }
  };

  useEffect(() => {
    const searchKey = searchParams.get("search");
    const stageKey = searchParams.get("stage");

    const nameFilter = filterNames(booksObject, searchKey || "");

    setSearchResults(filterStages(nameFilter, stageKey || ""));
  }, [searchParams]);

  const passSearchParam = (key: string, val: string) => {
    const searchKey = searchParams.get("search");
    const stageKey = searchParams.get("stage");

    if (searchKey) {
      params["search"] = searchKey;
    }
    if (stageKey && stageKey !== "") {
      params["stage"] = stageKey;
    }

    params[key] = val;

    navigate({
      search: `?${createSearchParams(params)}`,
    });
  };

  return (
    <div className="search-bar-container">
      <h2 className="books-length">{searchResults?.length} books</h2>
      <div className="search-bar">
        <input
          className="search-bar-input"
          type="text"
          placeholder="search for book names or book Id"
          defaultValue={searchParams.get("search") || ""}
          onChange={(e) => {
            passSearchParam("search", e.target.value);
          }}
        />
        <div className="filter-stages">
          <select
            className="search-select-stage"
            name="search-select-stage"
            id="search-select-stage"
            defaultValue={searchParams.get("stage") || " "}
            onChange={(e) => {
              passSearchParam("stage", e.target.value);
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
        {pathname !== "/create-quiz" && (
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
        )}
      </div>
      {pathname !== "/create-quiz" && (
        <button
          className="btn-upload-books"
          onClick={() => {
            navigate("/upload-questions");
          }}
        >
          <BiUpload />
          <span> Upload Books</span>
        </button>
      )}
    </div>
  );
};
