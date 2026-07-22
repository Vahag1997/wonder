import Link from 'next/link';
import { ArrowRight, ChevronRight } from 'lucide-react';
import styles from './home.module.css';

const ASSET_ROOT = 'https://resources.wonderwraps.com/f059d43d-7717-49ca-9ff5-5f70ac130d45';

const bestsellers = [
  {
    title: "Girl's Sticker Pack",
    subtitle: 'Personalized Sticker Packs For Your Little Girl',
    price: '$14.99',
    oldPrice: '$29.99',
    discount: '-50%',
    image: 'https://storage.wonderwraps.com/09b80d03-9485-469d-9afd-b1f49d9eb8b5/conversions/BY327dGD4VLDEpfCRGaCsHNEtvb5VI-metaVW50aXRsZWQtNC5wbmc=--optimized.webp',
  },
  {
    title: "Boy's Sticker Pack",
    subtitle: 'Personalized Sticker Packs For Your Little Boy',
    price: '$14.99',
    oldPrice: '$29.99',
    discount: '-50%',
    image: 'https://storage.wonderwraps.com/6f3dec04-4a99-49eb-a425-36664cdcef9d/conversions/u8VBTrjlZtdLRq4x96aX7pbd3sCuit-metaVW50aXRsZWQtMS5wbmc=--optimized.webp',
  },
  {
    title: 'The Portugal’s New Legend',
    subtitle: 'For champions with red and green at heart 🇵🇹',
    price: '$44.99',
    image: 'https://storage.wonderwraps.com/06475cf3-febd-4c33-b383-8ce6161a8293/conversions/BNxPybDPVwYyl48GXxjyLVN0YCnTbr-metaNS5wbmc=--optimized.webp',
  },
  {
    title: 'Princess Girl, the One We All Needed',
    subtitle: 'A magical journey of kindness and courage',
    price: '$34.99',
    image: 'https://storage.wonderwraps.com/75351fd8-ca9e-43b7-afa6-d69bb7354485/conversions/fiDtRu3TdjQP4Q6flzikE3DKuDjZRi-metaUHJpbmNlc3MgMy5wbmc=--optimized.webp',
  },
  {
    title: 'Super Boy and the Dragon',
    subtitle: 'Kindness turns a scary dragon into a true friend',
    price: '$34.99',
    image: 'https://storage.wonderwraps.com/76a470ee-6595-432d-a235-64931769259b/conversions/V1ZODdq4qVoDUNDlfwBoU866Dt2TUn-metaMC4xLnBuZw==--optimized.webp',
  },
  {
    title: 'Princess and the Glowing Flower',
    subtitle: 'A heartwarming tale of sharing, love, and bravery',
    price: '$34.99',
    image: 'https://storage.wonderwraps.com/e1483288-3c2a-47b0-abdc-3d9e616d4ad7/conversions/MddI4OiV2Hn6d1L5T14wMp2GXQIrXq-metacHJpbmNlc3MxIGZpbmFsLnBuZw==--optimized.webp',
  },
];

const newReleases = [
  {
    title: 'Vroom Vroom, The Boy Wins the Race',
    subtitle: 'A child’s race to believe, try, and win',
    price: '$34.99',
    image: 'https://storage.wonderwraps.com/754b3abc-d09a-4d11-92f3-dd15a8f8bcdf/conversions/dBO49Abom5zRDsQYzh4ehuZEdeQ6EZ-metaMC4zLnBuZw==--optimized.webp',
  },
  {
    title: 'The Boy and the Cosmic Journey',
    subtitle: 'A bedtime journey through space and stars',
    price: '$34.99',
    image: 'https://storage.wonderwraps.com/af513971-f755-4885-b487-cdf04586b218/conversions/nG2VWEsjChCdTia2D1hwPV3abeO96f-metaMC4zLnBuZw==--optimized.webp',
  },
  bestsellers[4],
  {
    title: 'Boy Explores the Zoo',
    subtitle: 'Wild Zoo Adventure: Meet & Learn with Animals',
    price: '$34.99',
    image: 'https://storage.wonderwraps.com/d49fb839-be01-4d81-b2c4-cf4ec272ba61/conversions/bgEJajvdrjQsGTYlZZDlwrzzAPkhJo-metaMC4xLnBuZw==--optimized.webp',
  },
  {
    title: 'Girl Explores the Zoo',
    subtitle: 'Wild Zoo Adventure: Meet & Learn with Animals',
    price: '$34.99',
    image: 'https://storage.wonderwraps.com/9a045d2e-2082-4a5d-8497-8c27e2cfab28/conversions/MiipfIXIGXk71VSkCtiShBoetglYvJ-metaY292ZXIucG5n--optimized.webp',
  },
  {
    title: 'Girl and the Lost Fairy Wings',
    subtitle: 'Believe in Magic: A Fairy’s Journey',
    price: '$34.99',
    image: 'https://storage.wonderwraps.com/6f35b55b-0a45-43a7-8859-f9c874beb837/conversions/oVsqdEH6cFZwjm3DuqM7NVeJI4FOUD-metaY292ZXIucG5n--optimized.webp',
  },
];

const girlBooks = [
  {
    title: "Girl's Fun in the Sun",
    subtitle: 'Imagination builds the best obstacle course',
    price: '$34.99',
    image: 'https://storage.wonderwraps.com/8747b997-8759-4b6c-99fa-d18de84b1d3f/conversions/QeO0ocP0hxlBc2sy7kRyutiZ9cDmKA-metaMC41LnBuZw==--optimized.webp',
  },
  {
    title: 'Girl Counts with the Forest Friends',
    subtitle: 'A magical way to explore numbers together',
    price: '$34.99',
    image: 'https://storage.wonderwraps.com/b991127d-7f7f-4c4a-ad9e-5f0e07e57001/conversions/gUy3uCH1T6qu0pgHffAoZIFYGLGv8t-metaMC41LnBuZw==--optimized.webp',
  },
  {
    title: 'The ABC Journey with Girl',
    subtitle: 'A magical way to explore the alphabet together',
    price: '$34.99',
    image: 'https://storage.wonderwraps.com/135a4c94-1ee9-4e3e-b3fd-2f68f1deafeb/conversions/yxKIDK7JzlnYck1UoiGC1OiuEqrZaz-metaMC4xLnBuZw==--optimized.webp',
  },
];

const boyBooks = [
  {
    title: 'The Boy Who Could Talk to Animals',
    subtitle: 'A magical tale of animals, kindness, and sharing',
    price: '$34.99',
    image: 'https://storage.wonderwraps.com/5ff47620-1afc-4184-96f8-9d8d92e31f67/conversions/FVa0bjpaCjkO6yx4Y7tJ0S8GTrhLz5-metaYW5pbWFscyBmaW5hbC5wbmc=--optimized.webp',
  },
  {
    title: 'The ABC Journey with Boy',
    subtitle: 'A magical way to explore the alphabet together',
    price: '$34.99',
    image: 'https://storage.wonderwraps.com/996e0bb4-522a-43f7-9fda-4f28803437d7/conversions/oPUaAqbOwLijRJEGqkxqce1YBUvaV4-metaMC4xLnBuZw==--optimized.webp',
  },
  {
    title: 'Boy and the Forgotten Robot',
    subtitle: 'Explore secrets of space with a brave new friend',
    price: '$34.99',
    image: 'https://storage.wonderwraps.com/fc44ff33-f656-465f-bd47-4d28ae5eebe4/conversions/0eaPmsBOBapLQSr5Ie9rIAQi2m9fwn-metaMC40LnBuZw==--optimized.webp',
  },
];

const steps = [
  ['1', 'Pick Storybook', `${ASSET_ROOT}/img/home/step_1.webp`],
  ['2', "Add your Child's Picture", `${ASSET_ROOT}/img/home/step_2.webp`],
  ['3', 'Preview & Order', `${ASSET_ROOT}/img/home/step_3.webp`],
  ['4', 'Your story is printed with care and delivered with joy.', `${ASSET_ROOT}/img/home/step_4.webp`],
];

const faqs = [
  ['How do I place an order?', 'It’s easy! Choose the book you want personalised, upload a photo of your child, and enter their name and age. You’ll get a preview of the book before payment.'],
  ['Do you ship to my location?', 'Yes! We ship to over 200 countries and regions. Enter your shipping details at checkout and we’ll take care of the rest.'],
  ['Can I get a refund for my order?', 'You can receive a full refund if your book hasn’t been printed yet, or a partial refund if it has been printed but not yet shipped.'],
  ['How long does shipping take?', 'Standard shipping usually takes 10 to 30 business days, while express shipping typically arrives within 7 to 20 business days.'],
  ['Will I have to pay duties or extra fees?', 'Customs duties or import fees may apply depending on your country and are the responsibility of the recipient.'],
  ['What if I’m not happy with my order?', 'After payment, you’ll review and approve your book. If you need changes, our dedicated support team will be happy to assist you.'],
  ['How can I reach customer support?', 'You can contact our customer support team through our support page or at support@wonderwraps.com.'],
  ['What languages are your books available in?', 'Our books are available in English, Spanish, Portuguese, Arabic, French, Turkish, German, Italian, Dutch and Albanian.'],
];

function SectionHeader({ eyebrow, title }) {
  return (
    <div className={styles.sectionHeader}>
      <div>
        <span>{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      <Link href="/books" className={styles.viewAll}>View All <ArrowRight size={17} /></Link>
    </div>
  );
}

function ProductCard({ book }) {
  return (
    <article className={styles.productCard}>
      <Link href="/books" className={styles.productImage} aria-label={`Personalise ${book.title}`}>
        {book.discount && <span className={styles.discount}>{book.discount}</span>}
        <img src={book.image} alt={`${book.title} cover`} loading="lazy" />
      </Link>
      <div className={styles.productCopy}>
        <h3>{book.title}</h3>
        <p>{book.subtitle}</p>
        <div className={styles.price}>{book.oldPrice ? <><strong>{book.price}</strong><del>{book.oldPrice}</del></> : <><small>From</small><strong>{book.price}</strong></>}</div>
        <Link href="/books" className={styles.personalise}>Personalise Now <ChevronRight size={15} /></Link>
      </div>
    </article>
  );
}

function ProductSection({ eyebrow, title, books, compact = false }) {
  return (
    <section className={`${styles.products} ${compact ? styles.compactProducts : ''}`}>
      <SectionHeader eyebrow={eyebrow} title={title} />
      <div className={styles.productGrid}>{books.map((book) => <ProductCard key={book.title} book={book} />)}</div>
    </section>
  );
}

export default function Home() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <img className={styles.heroBackdrop} src={`${ASSET_ROOT}/img/home/top-banner.webp`} alt="" />
        <div className={styles.heroVideo}>
          <video autoPlay loop muted playsInline poster={`${ASSET_ROOT}/img/home/video-poster.webp`}>
            <source src={`${ASSET_ROOT}/video/video-preview.mp4`} type="video/mp4" />
          </video>
        </div>
        <div className={styles.heroCopy}>
          <span>CREATE UNIQUE STORYBOOK</span>
          <h1>Craft magical tales where you&apos;re the hero</h1>
          <div className={styles.heroButtons}>
            <Link href="/books" className={styles.primaryButton}>TRY FOR FREE</Link>
            <Link href="/books" className={styles.whiteButton}>View All Books</Link>
          </div>
        </div>
      </section>

      <ProductSection eyebrow="Bestsellers" title="Personalise a bestseller" books={bestsellers} />
      <ProductSection eyebrow="New Releases" title="Discover What’s New" books={newReleases} />

      <section className={styles.howItWorks}>
        <div className={styles.howInner}>
          <div className={styles.howHeading}>
            <span>CREATE YOUR BOOK IN MINUTES</span>
            <h2>How WonderWraps Works</h2>
          </div>
          <div className={styles.steps}>
            {steps.map(([number, title, image]) => (
              <article key={number} className={styles.step}>
                <img src={image} alt="" loading="lazy" />
                <div><span>{number}</span><h3>{title}</h3></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ProductSection eyebrow="Our Books" title="Books for Your Little Girl!" books={girlBooks} compact />

      <section className={styles.customise}>
        <div className={styles.customiseHeading}>
          <span>Customize Faces, Expressions, and Angles</span>
          <h2>To bring your character to life!</h2>
        </div>
        <div className={styles.customiseColumns}>
          <CharacterGroup title="Many Styles" images={['many_styles_1_1.webp', 'many_styles_3_3.webp', 'many_styles_2_2.webp']} />
          <CharacterGroup title="Full of Expressions" images={['full_of_expressions_1_2.webp', 'full_of_expressions_2_2.webp', 'full_of_expressions_3_1.webp']} />
          <CharacterGroup title="Different Angels" images={['different_angles_1_1.webp', 'different_angles_2_2.webp', 'different_angles_3_3.webp']} />
        </div>
      </section>

      <ProductSection eyebrow="Our Books" title="Books for Your Little Boy!" books={boyBooks} compact />

      <section className={styles.careers}>
        <img className={styles.careerBg} src={`${ASSET_ROOT}/img/home/inspire-bg.svg`} alt="" loading="lazy" />
        <div className={styles.careerCopy}>
          <span>PERSONALISED STORIES THAT CELEBRATE THEIR BIG DREAMS</span>
          <h2>Inspire Their Dreams with Hyper-personalised Career Adventures!</h2>
          <Link href="/books" className={styles.primaryButton}>Explore</Link>
        </div>
        <div className={styles.careerArt}>
          {[
            ['firefighter.webp', 'Firefighter'],
            ['police.webp', 'Police Officer'],
            ['pilot.webp', 'Pilot'],
            ['doctor.webp', 'Doctor'],
          ].map(([image, label]) => <div key={label}><img src={`${ASSET_ROOT}/img/home/children/${image}`} alt={label} loading="lazy" /><span>{label}</span></div>)}
          <img className={styles.careerChild} src={`${ASSET_ROOT}/img/home/children/child.webp`} alt="Child imagining future careers" loading="lazy" />
        </div>
      </section>

      <section className={styles.ages}>
        <h2>Browse Stories by Age</h2>
        <div className={styles.ageGrid}>
          {[
            ['2-4', `${ASSET_ROOT}/img/2-4.webp`],
            ['4-6', `${ASSET_ROOT}/img/4-6.webp`],
            ['6-8', `${ASSET_ROOT}/img/6-8.webp`],
          ].map(([age, image]) => (
            <Link href="/books" className={styles.ageCard} key={age}>
              <img src={image} alt={`Child ${age}`} loading="lazy" />
              <span>Age {age}</span>
              <small>Discover <ArrowRight size={15} /></small>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.faq}>
        <h2>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          {faqs.map(([question, answer], index) => (
            <details key={question} open={index === 0}>
              <summary>{question}<span>+</span></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
        <Link href="/support" className={styles.faqButton}>See All</Link>
      </section>

      <section className={styles.finalCta}>
        <div className={styles.ctaImage}><img src={`${ASSET_ROOT}/img/home/footer_crop_image.webp`} alt="Reading Book" loading="lazy" /></div>
        <div className={styles.ctaCopy}>
          <h2>Bring your child&apos;s imagination to life!</h2>
          <p>Make them the hero of their own magical adventure with a hyper-personalised storybook!</p>
          <Link href="/books" className={styles.whiteButton}>View All Books</Link>
        </div>
      </section>
    </div>
  );
}

function CharacterGroup({ title, images }) {
  return (
    <article className={styles.characterGroup}>
      <div>{images.map((image) => <img key={image} src={`${ASSET_ROOT}/img/home/children/${image}`} alt="" loading="lazy" />)}</div>
      <h3>{title}</h3>
    </article>
  );
}
