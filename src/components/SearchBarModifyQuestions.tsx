import React, { Dispatch, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
export const SearchBarModifyQuestions = (props: {
  setSearchKeyWord: Dispatch<React.SetStateAction<string>>;
}) => {
  const [search, setSearch] = useSearchParams();
  const setSearchKeyWord = props.setSearchKeyWord;

  useEffect(() => {
    setSearch({});
  }, []);
  return (
    <div className="search-bar-container">
      <div className="search-bar-input">
        <input
          type="text"
          name="search"
          onChange={(e) => {
            setSearch({ search: e.target.value }, { replace: true });
            setSearchKeyWord(e.target.value.toLocaleLowerCase());
          }}
        />
      </div>
      <div className="components"></div>
    </div>
  );
};
