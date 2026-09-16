import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
export default function HeroCollections({ locale }) {
  const ru = locale === "ru";
  return <section className="section wrap hero-collections">
    <div className="section-heading"><div><p className="eyebrow">{ru ? "У каждой мечты есть главный герой" : "Every dream has a main character"}</p><h2>{ru ? "Его приключение. Её волшебство." : "His adventure. Her magic."}</h2></div><p>{ru ? "Выберите, кто окажется в центре истории." : "Choose who will be at the heart of the story."}</p></div>
    <div className="hero-collection-grid">
      <Link href="/books?gender=boy" className="hero-collection-card collection-boy"><div className="collection-character"><Image src="/images/books/amir-3.webp" alt="" fill sizes="(max-width: 700px) 90vw, 45vw" /></div><div className="collection-character-copy"><span className="eyebrow">{ru ? "Дружба · Открытия · Смелость" : "Friendship · Discovery · Courage"}</span><h3>{ru ? "Для маленьких героев" : "For little heroes"}</h3><span className="collection-link">{ru ? "Истории для мальчиков" : "Stories for boys"}<ArrowUpRight size={20} /></span></div></Link>
      <Link href="/books?gender=girl" className="hero-collection-card collection-girl"><div className="collection-character"><Image src="/images/wonder-girl-adventure.webp" alt="" fill sizes="(max-width: 700px) 90vw, 45vw" /></div><span className="collection-soon">{ru ? "Книги скоро" : "Books coming soon"}</span><div className="collection-character-copy"><span className="eyebrow">{ru ? "Мечты · Чудеса · Приключения" : "Dreams · Wonder · Adventures"}</span><h3>{ru ? "Для маленьких героинь" : "For little heroines"}</h3><span className="collection-link">{ru ? "Раздел для девочек" : "Explore the girls’ collection"}<ArrowUpRight size={20} /></span></div></Link>
    </div>
  </section>;
}
