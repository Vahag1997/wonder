"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, RotateCcw, BookOpen } from "lucide-react";
import BookCover from "./BookCover";

export default function StoryInMotion({ book, locale }) {
  const ru = locale === "ru";
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const controls = useRef(null);
  const coverButton = useRef(null);
  function openBook() {
    setOpen(true);
    requestAnimationFrame(() => controls.current?.focus({preventScroll:true}));
  }
  const pages = book.samples.slice(1);
  return <section id="story-in-motion" className="section story-theater">
    <div className="wrap theater-inner">
      <div className="theater-copy"><p className="eyebrow">{ru ? "Осторожно: хочется листать дальше" : "Warning: one more page is never enough"}</p><h2>{ru ? <>Целый мир.<br />В одной <em>маленькой книге.</em></> : <>A whole world.<br />In one <em>little book.</em></>}</h2><p>{ru ? "Откройте обложку, познакомьтесь с героями и почувствуйте настроение истории. Вот как выглядят настоящие страницы нашего первого образца." : "Open the cover, meet the characters and feel the story. These are real pages from our first sample book."}</p><Link href={`/books/${book.slug}`} className="text-link">{ru ? "Больше об этой истории" : "More about this story"}<ArrowRight size={17} /></Link><span className="theater-source">{ru ? "Исходная книга. Не результат персонализации." : "Original book. Not a personalized result."}</span></div>
      <div className="theater-reader" role="region" aria-label={ru ? "Интерактивный образец книги" : "Interactive book sample"}>
        <div className="theater-stage" data-open={open}>
          <span className="theater-spark" aria-hidden="true">✧</span>
          <div className="theater-spread" aria-hidden={!open}><Image key={page} src={pages[page]} alt={`${ru ? "Исходный разворот" : "Original spread"} ${page + 1}`} fill sizes="(max-width: 850px) 90vw, 55vw" /><span className="theater-binding" aria-hidden="true" /></div>
          <button ref={coverButton} className="theater-cover" aria-label={ru ? "Открыть обложку книги" : "Open the book cover"} tabIndex={open ? -1 : 0} aria-hidden={open} onClick={openBook}><BookCover book={book} sizes="(max-width: 850px) 90vw, 650px" /><span>{ru ? "Нажмите, чтобы открыть" : "Tap to open"}<BookOpen size={16} /></span></button>
        </div>
        <div ref={controls} tabIndex={-1} className="theater-controls" aria-label={ru ? "Перелистывание страниц" : "Page controls"}>{open ? <><button type="button" className="icon-button" aria-label={ru ? "Предыдущий разворот" : "Previous spread"} disabled={page === 0} onClick={() => setPage(page - 1)}><ArrowLeft size={19} /></button><span aria-live="polite">{ru ? "Разворот" : "Spread"} {page + 1} / {pages.length}</span><button type="button" className="icon-button" aria-label={ru ? "Следующий разворот" : "Next spread"} disabled={page === pages.length - 1} onClick={() => setPage(page + 1)}><ArrowRight size={19} /></button><button type="button" className="theater-reset" onClick={() => {setOpen(false); setPage(0); requestAnimationFrame(() => coverButton.current?.focus({preventScroll:true}));}}><RotateCcw size={15} />{ru ? "Обложка" : "Cover"}</button></> : <button type="button" className="button button-outline" onClick={openBook}>{ru ? "Открыть книгу" : "Open the book"}<BookOpen size={18} /></button>}</div>
      </div>
    </div>
  </section>;
}
