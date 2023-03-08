import "../scss/bookCards.scss";

export const BookButton = (props: {
  bookName: string;
  onClick: () => void;
}) => {
  const bookName = props.bookName;

  return <div className="book-button">{bookName}</div>;
};
