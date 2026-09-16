"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  ShieldCheck,
  Upload,
  X,
  Pencil,
  Info,
} from "lucide-react";
import {
  validateName,
  validateAge,
  validatePhotoHeader,
  validatePhotoDimensions,
} from "@/lib/personalization";
import { languageName } from "@/lib/catalog";
import PurchaseJourney from "./PurchaseJourney";
import { supportsHero } from "@/lib/story-discovery";

export default function PersonalizationWizard({
  book,
  locale,
  demo = false,
  demoAvailable = false,
}) {
  const ru = locale === "ru";
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState(book.heroGenders?.[0] || "");
  const [photo, setPhoto] = useState(null);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const heading = useRef(null);
  const input = useRef(null);
  const fileVersion = useRef(0);
  const activeUrl = useRef(null);
  const [dirty, setDirty] = useState(false);
  useEffect(
    () => () => {
      fileVersion.current++;
      if (activeUrl.current) URL.revokeObjectURL(activeUrl.current);
    },
    [],
  );
  useEffect(() => {
    if (!dirty) return;
    const prevent = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", prevent);
    return () => window.removeEventListener("beforeunload", prevent);
  }, [dirty]);
  const messages = {
    required: ru
      ? "Введите имя ребёнка."
      : "Please enter your child’s first name.",
    length: ru
      ? "Используйте имя длиной до 40 символов."
      : "Please use a name of 40 characters or fewer.",
    characters: ru
      ? "Используйте буквы, пробел, апостроф или дефис."
      : "Use letters, spaces, apostrophes, or hyphens.",
    size: ru
      ? "Размер файла должен быть от 1 байта до 10 МБ."
      : "Choose an image smaller than 10 MB.",
    type: ru
      ? "Выберите настоящий файл JPG, PNG или WebP."
      : "Choose a valid JPG, PNG, or WebP image.",
    small: ru
      ? "Нужно фото не меньше 320 × 320 пикселей."
      : "Choose a photo at least 320 × 320 pixels.",
    large: ru
      ? "Слишком большое разрешение. Выберите фото до 24 мегапикселей."
      : "Choose a photo no larger than 24 megapixels.",
    decode: ru
      ? "Не получилось прочитать фото. Попробуйте другое."
      : "We couldn’t read that image. Please choose another.",
    age: ru
      ? "Выберите возраст ребёнка от 1 до 12 лет."
      : "Choose your child’s age, from 1 to 12 years.",
  };
  async function choose(file) {
    if (!file) return;
    const version = ++fileVersion.current;
    setBusy(true);
    setError("");
    let candidateUrl = null;
    try {
      const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());
      let reason = validatePhotoHeader(bytes, file.type, file.size);
      if (reason) throw new Error(reason);
      candidateUrl = URL.createObjectURL(file);
      const image = new window.Image();
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = () => reject(new Error("decode"));
        image.src = candidateUrl;
      });
      reason = validatePhotoDimensions(image.naturalWidth, image.naturalHeight);
      if (reason) throw new Error(reason);
      if (version !== fileVersion.current) {
        URL.revokeObjectURL(candidateUrl);
        return;
      }
      if (activeUrl.current) URL.revokeObjectURL(activeUrl.current);
      activeUrl.current = candidateUrl;
      setConsent(false);
      setPhoto({
        file,
        url: candidateUrl,
        name: file.name,
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
      setDirty(true);
      setReviewed(false);
    } catch (e) {
      if (candidateUrl) URL.revokeObjectURL(candidateUrl);
      if (version === fileVersion.current)
        setError(messages[e.message] || messages.decode);
    } finally {
      if (version === fileVersion.current) setBusy(false);
      if (input.current) input.current.value = "";
    }
  }
  function go(next) {
    setError("");
    setStep(next);
    setReviewed(false);
    requestAnimationFrame(() => heading.current?.focus());
  }
  function advance(e) {
    e.preventDefault();
    if (step === 0) {
      if (!supportsHero(book, gender)) {
        setError(ru ? "Для этой истории пока подготовлен только вариант с мальчиком. Выберите другую коллекцию или вариант героя." : "This story currently has only a boy edition. Choose a different collection or hero edition.");
        return;
      }
      const result = validateName(name);
      if (result.error) {
        setError(messages[result.error]);
        return;
      }
      if (validateAge(age).error) {
        setError(messages.age);
        return;
      }
      setName(result.value);
      go(1);
    } else if (step === 1) {
      if (!photo) {
        setError(ru ? "Сначала выберите фото." : "Choose a photo to continue.");
        return;
      }
      if (!consent) {
        setError(
          ru
            ? "Нужно согласие родителя или опекуна."
            : "Please confirm you are the parent or guardian.",
        );
        return;
      }
      go(2);
    } else {
      setReviewed(true);
    }
  }
  const labels = ru
    ? ["О ребёнке", "Фото", "Проверка"]
    : ["Your child", "Photo", "Review"];
  if (reviewed)
    return (
      <PurchaseJourney
        book={book}
        locale={locale}
        details={{ name, age: Number(age), gender, photo, consent }}
        demo={demo}
        demoAvailable={demoAvailable}
        onEdit={() => {
          setReviewed(false);
          go(0);
        }}
        onSafeLeave={() => setDirty(false)}
      />
    );
  return (
    <div className="wizard-layout wrap">
      <div className="wizard-main">
        {demo && (
          <p className="notice demo-banner">
            {ru
              ? "Демо покупки: исходные иллюстрации, без генерации, загрузки фото и списаний."
              : "Purchase demo: original illustrations. No generation, photo uploads, or charges."}
          </p>
        )}
        <Link className="text-link" href={`/books/${book.slug}`}>
          <ArrowLeft size={16} />
          {ru ? "Назад к истории" : "Back to the story"}
        </Link>
        <ol
          className="wizard-steps"
          aria-label={ru ? "Шаги персонализации" : "Personalization steps"}
        >
          {labels.map((label, i) => (
            <li key={label} aria-current={step === i ? "step" : undefined}>
              <button type="button" disabled={i > step} onClick={() => go(i)}>
                <span>{i < step ? <Check size={15} /> : i + 1}</span>
                {label}
              </button>
            </li>
          ))}
        </ol>
        <form onSubmit={advance} noValidate>
          <div className="wizard-panel" key={step}>
            <p className="eyebrow">
              {ru ? "Шаг" : "Step"} 0{step + 1} / 03
            </p>
            <h1 ref={heading} tabIndex={-1}>
              {step === 0
                ? ru
                  ? gender === "girl" ? "Как зовут нашу героиню?" : "Как зовут нашего героя?"
                  : "Every hero has a name."
                : step === 1
                  ? ru
                    ? "Давайте увидим эту улыбку."
                    : "Let’s meet that little smile."
                  : ru
                    ? "Всё начинается с них."
                    : "It’s all coming together."}
            </h1>
            <p className="panel-description">
              {step === 0
                ? ru
                  ? "Введите имя так, как вы хотите видеть его в книге."
                  : "What should we call the star of this story? Use the spelling you’d like in the book."
                : step === 1
                  ? ru
                    ? "Одно чёткое фото — хорошее начало. Сейчас оно останется только в этой вкладке."
                    : "One clear photo is a lovely place to start. In this preview, it stays in this browser tab."
                  : ru
                    ? "Проверьте имя, фотографию и язык исходной книги."
                    : "Double-check their name, photo, and the language of the original story."}
            </p>
            {step === 0 && (
              <div className="form-fields">
                <fieldset className="hero-choice-field"><legend>{ru ? "Кто станет главным героем?" : "Who will be the main character?"}</legend><div className="hero-radio-options">{[["boy", ru ? "Мальчик" : "Boy"], ["girl", ru ? "Девочка" : "Girl"]].map(([value,label]) => <label key={value}><input type="radio" name="child-gender" value={value} checked={gender === value} onChange={() => {setGender(value); setError(""); setDirty(true);}} /><span>{label}<Check size={16} aria-hidden="true" /></span></label>)}</div><p className="field-help">{ru ? "Выбирает родитель. Мы не определяем это по фотографии или имени." : "Chosen by the parent. We never infer this from a photo or name."}</p></fieldset>
                {!supportsHero(book, gender) && <div className="edition-unavailable" role="status"><strong>{ru ? "Версия с героиней ещё готовится" : "The girl edition is being prepared"}</strong><p>{ru ? "Мы не будем подставлять девочку в непроверенный шаблон с мальчиком. Для этой книги пока доступен только вариант с героем." : "We won’t use an unverified boy template for a girl. Only the boy edition is available for this book at present."}</p><Link href="/books?gender=girl" className="text-link">{ru ? "Открыть раздел для девочек" : "Explore the girls’ collection"}<ArrowRight size={16} /></Link></div>}
                <label className="field-label" htmlFor="child-name">
                  {ru ? "Имя ребёнка" : "Child’s first name"}
                </label>
                <input
                  id="child-name"
                  className="text-input name-input"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setDirty(true);
                    setError("");
                  }}
                  autoComplete="off"
                  maxLength={60}
                  placeholder={ru ? gender === "girl" ? "Например, Маша" : "Например, Амир" : gender === "girl" ? "e.g. Maya" : "e.g. Amir"}
                  aria-invalid={!!error && error !== messages.age}
                  aria-describedby={error ? "wizard-error" : "name-help"}
                />
                <p id="name-help" className="field-help">
                  {ru
                    ? "Только имя, без фамилии. До 40 символов."
                    : "Just their first name. Up to 40 characters."}
                </p>
                <label className="field-label" htmlFor="child-age">
                  {ru ? "Возраст ребёнка" : "Child’s age"}
                </label>
                <select
                  id="child-age"
                  className="text-input"
                  value={age}
                  onChange={(e) => {
                    setAge(e.target.value);
                    setDirty(true);
                    setError("");
                  }}
                  aria-invalid={error === messages.age}
                  aria-describedby={
                    error === messages.age ? "wizard-error" : "age-help"
                  }
                >
                  <option value="">
                    {ru ? "Выберите возраст" : "Choose an age"}
                  </option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
                <p id="age-help" className="field-help">
                  {ru
                    ? "Полных лет. Возраст помогает передать внешность ребёнка; сюжет и стиль книги остаются прежними."
                    : "In years. Age helps represent your child’s appearance; the story and illustration style stay the same."}
                </p>
                <div className="notice">
                  <BookIcon />
                  <div>
                    <strong>
                      {ru ? "Язык этой истории" : "This story’s language"}
                    </strong>
                    <p>
                      {languageName(book.language, locale)}.{" "}
                      {ru
                        ? "Язык сайта не переводит книгу."
                        : "Changing the website language does not translate the book."}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {step === 1 && (
              <>
                <input
                  ref={input}
                  id="child-photo"
                  className="visually-hidden"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => choose(e.target.files?.[0])}
                  aria-label={
                    ru ? "Выберите фото ребёнка" : "Choose your child’s photo"
                  }
                  tabIndex={-1}
                />
                {photo ? (
                  <div className="photo-selected">
                    <div className="photo-portrait">
                      <Image
                        src={photo.url}
                        alt={
                          ru ? "Выбранное фото ребёнка" : "Selected child photo"
                        }
                        fill
                        unoptimized
                        sizes="160px"
                      />
                    </div>
                    <div>
                      <strong>
                        {ru ? "Фотография выбрана" : "Photo added"}
                      </strong>
                      <p>
                        {photo.width} × {photo.height} px
                      </p>
                      <button
                        type="button"
                        className="text-link"
                        onClick={() => input.current?.click()}
                      >
                        {ru ? "Выбрать другое" : "Choose another"}
                        <Pencil size={14} />
                      </button>
                    </div>
                    <button
                      type="button"
                      className="icon-button"
                      aria-label={ru ? "Удалить фото" : "Remove photo"}
                      onClick={() => {
                        fileVersion.current++;
                        if (activeUrl.current)
                          URL.revokeObjectURL(activeUrl.current);
                        activeUrl.current = null;
                        setPhoto(null);
                        setBusy(false);
                        setReviewed(false);
                      }}
                    >
                      <X size={17} />
                    </button>
                  </div>
                ) : (
                  <button
                    className={`photo-dropzone ${drag ? "is-dragging" : ""}`}
                    type="button"
                    disabled={busy}
                    onClick={() => input.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDrag(true);
                    }}
                    onDragLeave={() => setDrag(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDrag(false);
                      if (e.dataTransfer.files.length !== 1) {
                        setError(
                          ru
                            ? "Выберите одно фото."
                            : "Choose one photo at a time.",
                        );
                        return;
                      }
                      choose(e.dataTransfer.files[0]);
                    }}
                  >
                    <span className="upload-icon">
                      <Upload size={28} />
                    </span>
                    <strong>
                      {busy
                        ? ru
                          ? "Проверяем фото…"
                          : "Checking your photo…"
                        : ru
                          ? "Нажмите или перетащите фото"
                          : "Choose a photo, or drop it here"}
                    </strong>
                    <span>
                      JPG, PNG, WebP · {ru ? "До 10 МБ" : "Up to 10 MB"}
                    </span>
                  </button>
                )}
                <div className="photo-tips">
                  <span>
                    <Check size={15} />
                    {ru ? "Один ребёнок" : "One child"}
                  </span>
                  <span>
                    <Check size={15} />
                    {ru ? "Лицо видно" : "Face clearly visible"}
                  </span>
                  <span>
                    <Check size={15} />
                    {ru ? "Без фильтров" : "No filters"}
                  </span>
                </div>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => {
                      setConsent(e.target.checked);
                      setError("");
                    }}
                  />
                  {ru
                    ? "Я родитель или опекун этого ребёнка и разрешаю использовать фото в этой демонстрации."
                    : "I am this child’s parent or guardian and give permission to use this photo in this preview."}
                </label>
                <p className="field-help">
                  <ShieldCheck size={14} aria-hidden="true" />
                  {ru
                    ? "Фото не загружается на сервер. При выходе со страницы или перезагрузке его нужно выбрать заново."
                    : "No photo is uploaded to a server. Leaving this page or reloading means selecting it again."}
                </p>
              </>
            )}
            {step === 2 && (
              <>
                <div className="review-details">
                  <div>
                    {photo && (
                      <div className="review-photo">
                        <Image
                          src={photo.url}
                          alt={ru ? "Выбранное фото" : "Selected photo"}
                          fill
                          unoptimized
                          sizes="90px"
                        />
                      </div>
                    )}
                    <div>
                      <span className="eyebrow">
                        {ru ? "Главный герой" : "Our main character"}
                      </span>
                      <h2>{name}</h2>
                    </div>
                  </div>
                  <dl>
                    <div><dt>{ru ? "Герой книги" : "Book hero"}</dt><dd>{gender === "girl" ? (ru ? "Девочка" : "Girl") : (ru ? "Мальчик" : "Boy")}</dd></div>
                    <div>
                      <dt>{ru ? "Возраст, лет" : "Age in years"}</dt>
                      <dd>{age}</dd>
                    </div>
                    <div>
                      <dt>{ru ? "История" : "Story"}</dt>
                      <dd>{book.title[locale]}</dd>
                    </div>
                    <div>
                      <dt>{ru ? "Язык книги" : "Book language"}</dt>
                      <dd>{languageName(book.language, locale)}</dd>
                    </div>
                    <div>
                      <dt>
                        {ru ? "Согласие родителя" : "Parent’s permission"}
                      </dt>
                      <dd>
                        <Check size={15} />
                        {ru ? "Подтверждено" : "Confirmed"}
                      </dd>
                    </div>
                  </dl>
                  <button
                    type="button"
                    className="text-link"
                    onClick={() => go(0)}
                  >
                    {ru ? "Изменить данные" : "Edit their details"}
                    <Pencil size={14} />
                  </button>
                </div>
                <div className="notice">
                  <Info size={21} />
                  <p>
                    {ru
                      ? "Сначала — две страницы с ребёнком. Полная книга — после оплаты. Сейчас доступна только демонстрация: фото не отправляется, деньги не списываются."
                      : "Two pages with your child first. The full book after payment. Only a demonstration is currently available: no photo is uploaded and no money is charged."}
                  </p>
                </div>
              </>
            )}
            {error && (
              <p className="form-error" role="alert" id="wizard-error">
                {error}
              </p>
            )}
            <div className="wizard-actions">
              {step > 0 && (
                <button
                  type="button"
                  className="text-link"
                  onClick={() => go(step - 1)}
                >
                  <ArrowLeft size={17} />
                  {ru ? "Назад" : "Back"}
                </button>
              )}
              {!reviewed && (
                <button type="submit" className="button" disabled={busy}>
                  {step === 2
                    ? ru
                      ? "Перейти к предпросмотру"
                      : "Continue to preview"
                    : ru
                      ? "Продолжить"
                      : "Continue"}
                  <ArrowRight size={18} />
                </button>
              )}
              {reviewed && (
                <Link
                  href="/books"
                  className="button button-outline"
                  onClick={() => setDirty(false)}
                >
                  {ru ? "Посмотреть другие истории" : "Explore more stories"}
                </Link>
              )}
            </div>
          </div>
        </form>
      </div>
      <aside className="wizard-aside">
        <div className="wizard-story-image">
          <Image
            src={book.cover}
            alt={book.sourceTitle}
            fill
            sizes={book.art === "amir" ? "540px" : "270px"}
            className={book.art === "amir" ? "cover-right" : ""}
          />
        </div>
        <p className="eyebrow">{ru ? "Вы выбрали" : "Your chosen story"}</p>
        <h2>{book.title[locale]}</h2>
        <p>{book.description[locale]}</p>
        <span className="subtle">
          {ru
            ? "На иллюстрации — герой исходной книги."
            : "Original story character shown."}
        </span>
        <div className="aside-note">
          <HeartIcon />
          <p>
            {ru
              ? "Та же история. Новое место для вашего героя."
              : "The same beautiful story. A new place for your little hero."}
          </p>
        </div>
      </aside>
    </div>
  );
}
function BookIcon() {
  return <Info size={22} aria-hidden="true" />;
}
function HeartIcon() {
  return <Camera size={21} aria-hidden="true" />;
}
