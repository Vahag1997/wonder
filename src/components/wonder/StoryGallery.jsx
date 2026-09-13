"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";
import BookCover from "./BookCover";

export default function StoryGallery({ book, locale }) {
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const dialog = useRef(null);
  const ru = locale === "ru";
  const change = (offset) =>
    setIndex(
      (current) =>
        (current + offset + book.samples.length) % book.samples.length,
    );
  useEffect(() => {
    if (!expanded) return;
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previous;
    };
  }, [expanded]);
  const keys = (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      change(1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      change(-1);
    }
  };
  const controls = (
    <>
      <button
        type="button"
        className="icon-button"
        onClick={() => change(-1)}
        aria-label={ru ? "Предыдущий образец" : "Previous sample"}
      >
        <ArrowLeft size={19} />
      </button>
      <span aria-live="polite">
        {ru ? "Образец" : "Sample"} {index + 1} / {book.samples.length}
      </span>
      <button
        type="button"
        className="icon-button"
        onClick={() => change(1)}
        aria-label={ru ? "Следующий образец" : "Next sample"}
      >
        <ArrowRight size={19} />
      </button>
    </>
  );
  return (
    <div className="story-gallery" onKeyDown={keys}>
      <div className={`gallery-stage surface-${book.tone}`}>
        <div
          className={`gallery-art ${index === 0 ? "is-cover" : ""}`}
          key={index}
        >
          {index === 0 ? (
            <BookCover book={book} priority />
          ) : (
            <Image
              src={book.samples[index]}
              alt={`${book.sourceTitle}, ${ru ? "образец страницы" : "sample page"} ${index + 1}`}
              fill
              sizes="(max-width: 700px) 95vw, 55vw"
              className="contain-image"
            />
          )}
        </div>
        <button
          type="button"
          className="icon-button expand-button"
          aria-label={ru ? "Увеличить образец" : "Enlarge sample"}
          onClick={() => {
            dialog.current.showModal();
            setExpanded(true);
          }}
        >
          <Expand size={18} />
        </button>
      </div>
      <div className="gallery-controls">{controls}</div>
      <div
        className="gallery-thumbs"
        aria-label={ru ? "Выбор образца" : "Choose a sample"}
      >
        {book.samples.map((src, i) => (
          <button
            type="button"
            key={src}
            onClick={() => setIndex(i)}
            aria-pressed={index === i}
            aria-label={`${ru ? "Образец" : "Sample"} ${i + 1}`}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="90px"
              className="contain-image"
            />
          </button>
        ))}
      </div>
      <p className="subtle center">
        {ru
          ? "Образцы исходной книги. Здесь ещё не ваш ребёнок."
          : "Original story samples. Not yet personalized for your child."}
      </p>
      <dialog
        ref={dialog}
        className="sample-dialog"
        onClose={() => setExpanded(false)}
        onCancel={() => setExpanded(false)}
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current.close();
        }}
        aria-labelledby="sample-title"
      >
        <div className="dialog-header">
          <h2 id="sample-title">
            {ru ? "Загляните в историю" : "A peek inside the story"}
          </h2>
          <button
            className="icon-button"
            type="button"
            autoFocus
            onClick={() => dialog.current.close()}
            aria-label={ru ? "Закрыть образец" : "Close sample"}
          >
            <X />
          </button>
        </div>
        <div className="dialog-image">
          <Image
            src={book.samples[index]}
            alt={`${book.sourceTitle}, ${ru ? "образец" : "sample"} ${index + 1}`}
            fill
            sizes="95vw"
            className="contain-image"
          />
        </div>
        <div className="gallery-controls">{controls}</div>
      </dialog>
    </div>
  );
}
