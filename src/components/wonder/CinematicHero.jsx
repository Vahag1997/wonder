"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Pause, Play, BookOpen } from "lucide-react";

export default function CinematicHero({ locale }) {
  const ru = locale === "ru";
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const scene = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(scene.current);
    return () => observer.disconnect();
  }, []);
  return (
    <section className="dream-hero" aria-labelledby="home-title">
      <div ref={scene} className="dream-scene" data-paused={paused || !inView}>
        <div className="dream-scene-image"><Image src="/images/wonder-world.webp" alt={ru ? "Мальчик и девочка в волшебном лесу, выросшем из раскрытой книги — иллюстрация Wonder" : "A boy and girl explore a magical forest growing from an open book — Wonder artwork"} fill priority sizes="(max-width: 600px) 600px, (max-width: 850px) 100vw, 58vw" /></div>
        <div className="dream-dust" aria-hidden="true">{Array.from({length: 10}, (_, i) => <i key={i} style={{"--particle": i}} />)}</div>
        <div className="dream-sticker" aria-hidden="true"><span>✦</span>{ru ? <>Маленькие герои.<br />Большое волшебство.</> : <>Little heroes.<br />Big magic.</>}</div>
        <a href="#story-in-motion" className="dream-preview-link"><span><BookOpen size={21} /></span><div><strong>{ru ? "Загляните внутрь" : "Take a little peek"}</strong><small>{ru ? "Полистайте настоящий образец" : "Turn the pages of a real sample"}</small></div><ArrowRight size={18} /></a>
        <div className="dream-scene-bottom"><small>{ru ? "Промоиллюстрация Wonder" : "Wonder promotional artwork"}</small><button type="button" className="scene-pause" onClick={() => setPaused(!paused)} aria-pressed={paused} aria-label={paused ? (ru ? "Продолжить анимацию" : "Resume animation") : (ru ? "Приостановить анимацию" : "Pause animation")}>{paused ? <Play size={15} /> : <Pause size={15} />}</button></div>
      </div>
      <div className="dream-copy">
        <p className="eyebrow"><span aria-hidden="true">✧</span> {ru ? "Не просто книга. Их собственная история." : "Not just a book. Their own story."}</p>
        <h1 id="home-title">{ru ? <>Подарите сказку,<br />в которой живёт<br /><em>ваш ребёнок</em></> : <>A little person.<br />A magical world.<br /><em>Their own story.</em></>}</h1>
        <p>{ru ? "Знакомая улыбка. Любимое имя. И целый мир, в котором начинается ваше семейное приключение." : "A familiar smile. Their favorite name. A whole new world for your family to discover together."}</p>
        <div className="dream-choice-label">{ru ? "Для кого выбираем сказку?" : "Who are we dreaming for?"}</div>
        <div className="dream-choices"><Link href="/books?gender=boy" className="button">{ru ? "Для мальчика" : "For a boy"}<ArrowRight size={18} /></Link><Link href="/books?gender=girl" className="button button-outline">{ru ? "Для девочки" : "For a girl"}<ArrowRight size={18} /></Link></div>
        <Link href="/books" className="dream-all">{ru ? "Посмотреть все истории" : "Explore every story"} <ArrowRight size={15} /></Link>
        <div className="dream-note"><span aria-hidden="true">♡</span>{ru ? "Для вечеров, которые хочется запомнить" : "For the evenings you’ll remember"}</div>
      </div>
    </section>
  );
}
