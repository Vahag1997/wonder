// Catalogue previews are source artwork, never proof of a personalized order.
export const books = [
  {
    slug: "amir-and-new-friends",
    templateId: "amir-new-cover-20x20",
    art: "amir",
    heroGenders: ["boy"],
    title: {
      en: "A little hero. A world of friends.",
      ru: "Маленький герой. Большая дружба.",
    },
    sourceTitle: "Amir, Kidi, and New Friends",
    description: {
      en: "A warm adventure with a loyal dog, new discoveries, and the courage it takes to make a friend.",
      ru: "Тёплая история о верном псе, новых открытиях и смелости, которая помогает найти друзей.",
    },
    theme: "friendship",
    tone: "peach",
    language: "ru",
    spreads: 19,
    supported: true,
    tag: { en: "Friendship & discovery", ru: "Дружба и открытия" },
    cover: "/images/books/amir-1.webp",
    samples: [
      "/images/books/amir-1.webp",
      "/images/books/amir-3.webp",
      "/images/books/amir-5.webp",
    ],
    sourceNotice: false,
  },
  {
    slug: "maksim-and-fluffy",
    templateId: "maksim-and-fluffy-adventure",
    art: "fluffy",
    heroGenders: ["boy"],
    title: { en: "An adventure with Fluffy.", ru: "Приключение с Пушистиком." },
    sourceTitle: "Maksim and Fluffy’s Adventure",
    description: {
      en: "A little explorer and a much-loved teddy bear find adventure in the world around them.",
      ru: "Маленький исследователь и любимый медведь открывают удивительный мир вокруг.",
    },
    theme: "adventure",
    tone: "blue",
    language: "en",
    spreads: 16,
    supported: false,
    tag: { en: "Courage & imagination", ru: "Смелость и воображение" },
    cover: "/images/books/fluffy-1.webp",
    samples: [
      "/images/books/fluffy-1.webp",
      "/images/books/fluffy-3.webp",
      "/images/books/fluffy-5.webp",
    ],
    sourceNotice: true,
  },
  {
    slug: "the-abc-journey",
    templateId: "abc-journey-with-sasha",
    art: "abc",
    heroGenders: ["boy"],
    title: {
      en: "Every letter, a little discovery.",
      ru: "Каждая буква — открытие.",
    },
    sourceTitle: "The ABC Journey with Sasha",
    description: {
      en: "Follow a curious young adventurer into a bright, illustrated journey through the alphabet.",
      ru: "Яркое путешествие по английскому алфавиту вместе с любознательным героем.",
    },
    theme: "learning",
    tone: "yellow",
    language: "en",
    spreads: 17,
    supported: false,
    tag: { en: "Curiosity & learning", ru: "Любознательность и знания" },
    cover: "/images/books/abc-1.webp",
    samples: [
      "/images/books/abc-1.webp",
      "/images/books/abc-3.webp",
      "/images/books/abc-5.webp",
    ],
    sourceNotice: true,
  },
];
export const getBook = (slug) => books.find((book) => book.slug === slug);
export const languageName = (code, locale = "en") =>
  code === "ru"
    ? locale === "ru"
      ? "Русский"
      : "Russian"
    : locale === "ru"
      ? "Английский"
      : "English";
