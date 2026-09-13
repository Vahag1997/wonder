import Image from "next/image";
export default function BookCover({ book, priority = false, sizes }) {
  return (
    <div className="book-object">
      <div className="book-front">
        <Image
          src={book.cover}
          alt={book.sourceTitle}
          fill
          priority={priority}
          sizes={
            sizes ||
            (book.art === "amir"
              ? "(max-width: 600px) 150vw, (max-width: 1000px) 80vw, 800px"
              : "(max-width: 600px) 75vw, (max-width: 1000px) 40vw, 400px")
          }
          className={book.art === "amir" ? "cover-right" : ""}
        />
        <span className="book-shine" aria-hidden="true" />
      </div>
    </div>
  );
}
