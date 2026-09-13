"use client";
import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
export default function ErrorPage({ reset }) {
  const [ru, setRu] = useState(true);
  useEffect(() => setRu(document.documentElement.lang !== "en"), []);
  return (
    <section className="section wrap empty-state error-page">
      <p className="eyebrow">
        {ru ? "Небольшая заминка" : "A little interruption"}
      </p>
      <h1>
        {ru
          ? "Попробуем открыть страницу ещё раз."
          : "Let’s turn that page again."}
      </h1>
      <p>
        {ru
          ? "Не всё получилось загрузить. Попробуйте ещё раз. Если вы готовили книгу, возможно, нужно будет снова выбрать фотографию."
          : "Something didn’t load correctly. Please try again. If you were preparing a book, you may need to select your photo again."}
      </p>
      <button className="button" onClick={reset}>
        <RefreshCw size={18} />
        {ru ? "Попробовать снова" : "Try again"}
      </button>
      <Link href="/" className="text-link">
        {ru ? "На главную" : "Back to home"}
      </Link>
    </section>
  );
}
