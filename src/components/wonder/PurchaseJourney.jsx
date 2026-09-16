"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Download,
  Info,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import {
  ACTIVE_STATUSES,
  canCheckout,
  formatPrice,
  formatChildAge,
  purchaseStep,
} from "@/lib/purchase-flow";
import { createPurchaseClient } from "@/lib/purchase-client";
import { createDemoPurchaseClient } from "@/lib/purchase-demo";
import "./purchase.css";

export default function PurchaseJourney({
  book,
  locale,
  details,
  demo = false,
  demoAvailable = false,
  initialId = null,
  onEdit,
  onSafeLeave,
}) {
  const ru = locale === "ru";
  const api = useMemo(
    () => (demo ? createDemoPurchaseClient(book) : createPurchaseClient()),
    [demo, book],
  );
  const [job, setJob] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [checkoutView, setCheckoutView] = useState(false);
  const [approved, setApproved] = useState(false);
  const [page, setPage] = useState(0);
  const [loaded, setLoaded] = useState({});
  const [imageError, setImageError] = useState(false);
  const [imageVersion, setImageVersion] = useState(0);
  const [pollPaused, setPollPaused] = useState(false);
  const [now, setNow] = useState(Date.now());
  const lock = useRef(false);
  const mounted = useRef(true);
  const createKey = useRef(null);
  const checkoutKey = useRef(null);
  const title = useRef(null);
  const status = job?.status;
  const stage = checkoutView ? 1 : purchaseStep(status);
  const allImagesLoaded =
    job?.pages.length === 2 &&
    job.pages.every((item) => loaded[item.id]) &&
    !imageError;
  const quoteValid = canCheckout(job, now);
  const t = (russian, english) => (ru ? russian : english);
  const errors = {
    unsupported_edition: t("Этот вариант героя ещё не поддерживается. Вернитесь к выбору истории.", "This hero edition is not supported yet. Please return to story selection."),
    unavailable: t(
      "Сервис сейчас недоступен. Если вы уже оплатили заказ, не оплачивайте его повторно. Обновите статус позже.",
      "The service is unavailable. If you have already paid, do not pay again. Refresh the status later.",
    ),
    network: t(
      "Не удалось получить ответ. Проверьте соединение. Не создавайте новый заказ: сначала обновите его статус.",
      "We couldn’t get a response. Check your connection. Refresh this order’s status before starting another order.",
    ),
    invalid_response: t(
      "Не удалось проверить данные заказа. Оплата и скачивание недоступны. Попробуйте обновить статус.",
      "We couldn’t verify the order details. Payment and downloads are unavailable. Try refreshing the status.",
    ),
    limit: t(
      "Лимит бесплатных попыток исчерпан. Попробуйте позже.",
      "The free preview limit has been reached. Please try later.",
    ),
    sign_in: t(
      "Войдите в аккаунт, которому принадлежит этот заказ.",
      "Sign in to the account that owns this order.",
    ),
    forbidden: t(
      "Этот заказ недоступен в вашем аккаунте.",
      "This order is not available to your account.",
    ),
    not_found: t(
      "Заказ не найден или недоступен.",
      "This order could not be found or accessed.",
    ),
    expired: t(
      "Срок хранения предпросмотра истёк. Начните заново.",
      "This preview has expired. Please start again.",
    ),
    conflict: t(
      "Заказ изменился. Обновите статус перед продолжением.",
      "This order has changed. Refresh its status before continuing.",
    ),
  };
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  useEffect(() => {
    title.current?.focus();
  }, [stage, status, checkoutView]);
  useEffect(() => {
    if (!job?.quote) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [job?.quote]);
  useEffect(() => {
    if (!initialId) return;
    const controller = new AbortController();
    api
      .get(initialId, controller.signal)
      .then((next) => {
        if (!controller.signal.aborted) setJob(next);
      })
      .catch((e) => {
        if (!controller.signal.aborted) setError(e.message || "network");
      });
    return () => controller.abort();
  }, [api, initialId]);
  useEffect(() => {
    if (
      !job ||
      !ACTIVE_STATUSES.has(job.status) ||
      pollPaused ||
      (demo && job.status === "payment_pending")
    )
      return;
    const controller = new AbortController();
    let timer;
    let attempts = 0;
    async function poll() {
      if (controller.signal.aborted) return;
      // Do not occupy a request or burn polling calls while the tab is hidden.
      if (document.hidden) {
        timer = setTimeout(poll, 3000);
        return;
      }
      try {
        const next = await api.get(
          job.id,
          AbortSignal.any([controller.signal, AbortSignal.timeout(15000)]),
        );
        if (controller.signal.aborted) return;
        setJob(next);
        setError("");
        if (next.status !== job.status || !ACTIVE_STATUSES.has(next.status))
          return;
        if (++attempts >= 60) {
          setPollPaused(true);
          return;
        }
        timer = setTimeout(poll, 3000);
      } catch (e) {
        if (!controller.signal.aborted) {
          setError(e.message || "network");
          setPollPaused(true);
        }
      }
    }
    timer = setTimeout(poll, demo ? 900 : 3000);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [api, job?.id, job?.status, demo, pollPaused]); // A status change starts a fresh bounded poll period.

  async function run(action) {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError("");
    try {
      await action();
    } catch (e) {
      if (mounted.current) setError(e.message || "network");
    } finally {
      lock.current = false;
      if (mounted.current) setBusy(false);
    }
  }
  async function start() {
    // Default deployment is closed. No file leaves the browser without the
    // future server integration and informed production consent being wired.
    if (!demo) {
      setError("unavailable");
      return;
    }
    await run(async () => {
      createKey.current ??= crypto.randomUUID();
      const next = await api.create(details, book, createKey.current);
      if (mounted.current) setJob(next);
    });
  }
  async function refresh() {
    await run(async () => {
      const next = await api.get(job?.id || initialId);
      if (mounted.current) {
        setJob(next);
        setPollPaused(false);
      }
    });
  }
  async function checkout() {
    if (!canCheckout(job) || !approved || !allImagesLoaded || error) return;
    await run(async () => {
      if (checkoutKey.current?.quoteId !== job.quote.id)
        checkoutKey.current = {
          quoteId: job.quote.id,
          key: crypto.randomUUID(),
        };
      const result = await api.checkout(job, checkoutKey.current.key);
      if (!mounted.current) return;
      if (demo) {
        setJob(result);
        setCheckoutView(false);
      } else {
        onSafeLeave?.();
        window.location.assign(result.redirect);
      }
    });
  }
  const steps = [
    t("2 страницы", "2-page preview"),
    t("Оплата", "Payment"),
    t("Ваша книга", "Your book"),
  ];
  const heading = !job
    ? t("Сначала заглянем в книгу.", "A little look inside, first.")
    : checkoutView
      ? t("Всё о вашей книге.", "Your book, at a glance.")
      : {
          preview_queued: t("Готовим две страницы.", "Preparing two pages."),
          preview_generating: t(
            "Ваш герой входит в историю.",
            "Your hero enters the story.",
          ),
          preview_ready: t(
            "Взгляните на первые страницы.",
            "Take a look at the first pages.",
          ),
          payment_pending: t(
            "Ожидаем подтверждение оплаты.",
            "Waiting for payment confirmation.",
          ),
          payment_failed: t(
            "Оплата не завершена.",
            "Payment was not completed.",
          ),
          paid: t("Оплата подтверждена.", "Payment confirmed."),
          book_generating: t(
            "Продолжаем вашу историю.",
            "Finishing your story.",
          ),
          completed: demo
            ? t("Демо завершено.", "Demo complete.")
            : t("Ваша книга готова!", "Your book is ready!"),
          preview_failed: t(
            "Этим страницам нужна новая попытка.",
            "These pages need another try.",
          ),
          book_failed: t(
            "Не удалось закончить книгу.",
            "We couldn’t finish the book.",
          ),
          expired: t("Срок предпросмотра истёк.", "This preview has expired."),
          cancelled: t("Заказ отменён.", "Order cancelled."),
        }[status];
  return (
    <section className="wrap purchase-layout">
      <div className="purchase-main">
        <Link className="text-link" href={`/books/${book.slug}`}>
          <ArrowLeft size={16} />
          {t("К истории", "Back to the story")}
        </Link>
        {demo && (
          <div className="notice demo-banner" role="note">
            <Info size={20} />
            <p>
              {t(
                "ДЕМО · На страницах — исходный герой, не ваш ребёнок. Цена — пример. Фото никуда не отправляется, деньги не списываются, PDF не создаётся.",
                "DEMO · Pages show the original character, not your child. The price is an example. No photo uploads, charges, or PDF generation.",
              )}
            </p>
          </div>
        )}
        <ol
          className="purchase-steps"
          aria-label={t("Этапы заказа", "Order stages")}
        >
          {steps.map((label, i) => (
            <li key={label} aria-current={stage === i ? "step" : undefined}>
              <span>{i < stage ? <Check size={16} /> : i + 1}</span>
              {label}
            </li>
          ))}
        </ol>
        <h1 ref={title} tabIndex={-1}>
          {heading}
        </h1>
        {!job && (
          <>
            <p className="panel-description">
              {t(
                "Сначала вы увидите две страницы с ребёнком в стиле выбранной книги. Если результат понравится, сможете оплатить полную книгу. Эти две страницы останутся в ней без повторной генерации.",
                "First, see two pages with your child in this book’s illustration style. If you like them, pay for the full book. Those same two pages are kept in the finished book.",
              )}
            </p>
            <div className="notice">
              <ShieldCheck size={22} />
              <p>
                {t(
                  "Приём заказов ещё не открыт. Генерация и платёжный сервис не подключены.",
                  "Orders are not open yet. Generation and payment services are not connected.",
                )}
              </p>
            </div>
            <div className="purchase-actions">
              {onEdit && (
                <button className="text-link" onClick={onEdit}>
                  <ArrowLeft size={16} />
                  {t("Изменить данные", "Edit details")}
                </button>
              )}
              {demo ? (
                <button className="button" disabled={busy} onClick={start}>
                  {t("Начать демонстрацию", "Start demonstration")}
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button className="button" disabled>
                  {t("Предпросмотр скоро появится", "Preview coming soon")}
                </button>
              )}
            </div>
            {!demo && demoAvailable && (
              <Link
                href={`/books/${book.slug}/personalize?demo=1`}
                className="text-link demo-link"
                onClick={onSafeLeave}
              >
                {t(
                  "Попробовать весь путь без оплаты (демо)",
                  "Try the whole journey without paying (demo)",
                )}
              </Link>
            )}
            {initialId && (
              <button
                className="button button-outline"
                disabled={busy}
                onClick={refresh}
              >
                {t("Обновить статус заказа", "Refresh order status")}
              </button>
            )}
          </>
        )}
        {job &&
          [
            "preview_queued",
            "preview_generating",
            "paid",
            "book_generating",
          ].includes(status) && (
            <div className="generation-state" role="status">
              <span className="loading-dot" />
              <p>
                {stage === 0
                  ? t(
                      "Готовятся только две страницы. Полная книга пока не создаётся.",
                      "Only two preview pages are being prepared. The full book is not being generated yet.",
                    )
                  : t(
                      "Первые две страницы сохранены. Создаём остальные и собираем PDF.",
                      "The preview pages are kept. Preparing the remaining pages and assembling the PDF.",
                    )}
              </p>
              {!demo && (
                <p className="field-help">
                  {t(
                    "Статус обновляется автоматически. Закрытие вкладки не отменяет заказ.",
                    "Status updates automatically. Closing this tab does not cancel the order.",
                  )}
                </p>
              )}
            </div>
          )}
        {job &&
          ["preview_ready", "payment_failed"].includes(status) &&
          !checkoutView && (
            <>
              <p className="panel-description">
                {demo
                  ? t(
                      "Это образцы исходной книги для проверки интерфейса, а не персонализированный результат.",
                      "These original book samples demonstrate the interface. They are not a personalized result.",
                    )
                  : t(
                      "Посмотрите обе страницы: похож ли герой на ребёнка, нравится ли выражение лица, правильно ли написано имя?",
                      "Review both pages: does the hero resemble your child, do the expressions fit, and is the name correct?",
                    )}
              </p>
              <div className="personalized-pages">
                {job.pages.map((item, index) => (
                  <figure
                    key={`${item.id}-${imageVersion}`}
                    hidden={index !== page}
                  >
                    <div className="personalized-page-image">
                      <Image
                        src={item.url}
                        alt={
                          demo
                            ? t(
                                `Образец исходной книги ${index + 1}. Не персонализирован.`,
                                `Original book sample ${index + 1}. Not personalized.`,
                              )
                            : t(
                                `Персонализированная страница ${index + 1}`,
                                `Personalized page ${index + 1}`,
                              )
                        }
                        fill
                        unoptimized
                        sizes="(max-width: 800px) 100vw, 65vw"
                        onLoad={() =>
                          setLoaded((previous) => ({
                            ...previous,
                            [item.id]: true,
                          }))
                        }
                        onError={() => setImageError(true)}
                        loading="eager"
                      />
                    </div>
                    <figcaption>
                      {demo
                        ? t(
                            "Исходная иллюстрация · Демо",
                            "Original illustration · Demo",
                          )
                        : t(
                            "Ваша персонализированная страница",
                            "Your personalized page",
                          )}{" "}
                      · {index + 1} / 2
                    </figcaption>
                  </figure>
                ))}
                <div
                  className="preview-page-controls"
                  aria-label={t("Страницы предпросмотра", "Preview pages")}
                >
                  {job.pages.map((item, index) => (
                    <button
                      key={item.id}
                      className="button button-outline"
                      aria-pressed={page === index}
                      onClick={() => setPage(index)}
                    >
                      {t("Страница", "Page")} {index + 1}
                    </button>
                  ))}
                </div>
              </div>
              {imageError && (
                <div className="notice" role="alert">
                  <p>
                    {t(
                      "Не удалось загрузить страницы. Оплата недоступна, пока обе страницы не загрузятся.",
                      "The pages could not be loaded. Payment stays unavailable until both pages load.",
                    )}
                  </p>
                  <button
                    className="text-link"
                    onClick={() => {
                      setLoaded({});
                      setImageError(false);
                      setImageVersion((value) => value + 1);
                    }}
                  >
                    {t("Загрузить ещё раз", "Reload images")}
                  </button>
                </div>
              )}
              <div className="locked-pages">
                <LockKeyhole size={23} />
                <div>
                  <strong>
                    {t(
                      "Остальная история — после оплаты",
                      "The rest of the story follows payment",
                    )}
                  </strong>
                  <p>
                    {t(
                      "Не скрываем уже созданную книгу: оставшиеся страницы начнут создаваться только после подтверждения оплаты.",
                      "The remaining pages start generating only after payment is confirmed.",
                    )}
                  </p>
                </div>
              </div>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={approved}
                  disabled={!allImagesLoaded}
                  onChange={(e) => setApproved(e.target.checked)}
                />
                {demo
                  ? t(
                      "Я посмотрел оба образца и хочу проверить шаг оплаты.",
                      "I reviewed both samples and want to try the payment step.",
                    )
                  : t(
                      "Я посмотрел обе страницы и подтверждаю внешность ребёнка и написание имени.",
                      "I reviewed both pages and approve the child’s appearance and name.",
                    )}
              </label>
              {!quoteValid && (
                <p className="notice">
                  {t(
                    "Цена или предпросмотр больше не действуют. Обновите статус перед оплатой.",
                    "The quote or preview has expired. Refresh the status before paying.",
                  )}
                </p>
              )}
              <div className="purchase-actions">
                <button className="text-link" onClick={refresh} disabled={busy}>
                  <RefreshCw size={16} />
                  {t("Обновить статус", "Refresh status")}
                </button>
                <button
                  className="button"
                  disabled={
                    !approved ||
                    !allImagesLoaded ||
                    !quoteValid ||
                    busy ||
                    !!error
                  }
                  onClick={() => setCheckoutView(true)}
                >
                  {t("К оформлению", "Continue to checkout")}
                  <ArrowRight size={18} />
                </button>
              </div>
            </>
          )}
        {checkoutView && (
          <div className="checkout-panel">
            <dl className="purchase-summary">
              <div>
                <dt>{t("Книга", "Book")}</dt>
                <dd>{book.title[locale]}</dd>
              </div>
              {details && (
                <>
                  <div>
                    <dt>{t("Имя ребёнка", "Child’s name")}</dt>
                    <dd>{details.name}</dd>
                  </div>
                  <div>
                    <dt>{t("Возраст, лет", "Age in years")}</dt>
                    <dd>{details.age}</dd>
                  </div>
                </>
              )}
              <div>
                <dt>{t("Формат", "Format")}</dt>
                <dd>{t("Цифровая книга · PDF", "Digital book · PDF")}</dd>
              </div>
              <div>
                <dt>{t("В книге", "Inside")}</dt>
                <dd>
                  {book.spreads}{" "}
                  {t("страниц исходного PDF", "source PDF pages")}
                </dd>
              </div>
              <div className="purchase-total">
                <dt>
                  {demo
                    ? t("Пример полной цены", "Example total price")
                    : t("Итого", "Total")}
                </dt>
                <dd>{formatPrice(job.quote, locale)}</dd>
              </div>
            </dl>
            <p>
              {t(
                "Разовая покупка, без подписки. Печать и доставка не включены.",
                "One-time purchase, no subscription. Printing and shipping are not included.",
              )}
            </p>
            <p className="field-help">
              <ShieldCheck size={16} />
              {demo
                ? t(
                    "Это тестовый шаг. Не вводите данные карты: списаний не будет.",
                    "This is a test step. No card details are required and no money will be charged.",
                  )
                : t(
                    "Оплата на защищённой странице платёжного сервиса. Мы не получаем данные вашей карты.",
                    "Payment takes place on the payment provider’s secure page. We do not receive your card details.",
                  )}
            </p>
            {!quoteValid && (
              <p className="form-error" role="alert">
                {t(
                  "Цена устарела. Вернитесь к предпросмотру и обновите статус.",
                  "This quote has expired. Return to the preview and refresh its status.",
                )}
              </p>
            )}
            <div className="purchase-actions">
              <button
                className="text-link"
                disabled={busy}
                onClick={() => setCheckoutView(false)}
              >
                <ArrowLeft size={16} />
                {t("К страницам", "Back to pages")}
              </button>
              <button
                className="button"
                disabled={busy || !quoteValid || !!error}
                onClick={checkout}
              >
                {busy
                  ? t("Подождите…", "One moment…")
                  : demo
                    ? t("Открыть тестовую оплату", "Open test payment")
                    : `${t("Оплатить", "Pay")} ${formatPrice(job.quote, locale)}`}
                <LockKeyhole size={17} />
              </button>
            </div>
          </div>
        )}
        {status === "payment_pending" && (
          <div className="generation-state">
            <LockKeyhole size={36} />
            <p>
              {t(
                "Оставшиеся страницы начнут создаваться только после подтверждения от платёжного сервиса. Возвращение с экрана оплаты само по себе не подтверждает платёж.",
                "The rest of the book starts only after the payment provider confirms payment. Returning from checkout is not proof of payment.",
              )}
            </p>
            {demo ? (
              <div className="purchase-actions">
                <button
                  className="button button-outline"
                  disabled={busy}
                  onClick={() =>
                    run(async () => setJob(await api.simulatePayment(false)))
                  }
                >
                  {t("Проверить отмену оплаты", "Test cancelled payment")}
                </button>
                <button
                  className="button"
                  disabled={busy}
                  onClick={() =>
                    run(async () => setJob(await api.simulatePayment(true)))
                  }
                >
                  {t(
                    "Симулировать успешную оплату",
                    "Simulate successful payment",
                  )}
                </button>
              </div>
            ) : (
              <button
                className="button button-outline"
                onClick={refresh}
                disabled={busy}
              >
                {t("Проверить оплату", "Check payment")}
              </button>
            )}
          </div>
        )}
        {status === "completed" && (
          <div className="completion-state">
            <CheckCircle2 size={44} />
            <p>
              {demo
                ? t(
                    "Вы прошли путь от предпросмотра до готовой книги. Это проверка интерфейса: настоящий заказ и PDF не создавались.",
                    "You tried the journey from preview to completion. This is an interface demonstration: no actual order or PDF was created.",
                  )
                : t(
                    "Все страницы собраны в PDF. Можно скачать книгу и читать вместе.",
                    "All pages have been assembled into a PDF. Download your book and read together.",
                  )}
            </p>
            {job.download &&
            !demo &&
            !error &&
            Date.parse(job.expiresAt) > now ? (
              <a href={job.download} className="button" onClick={onSafeLeave}>
                <Download size={19} />
                {t("Скачать книгу PDF", "Download PDF book")}
              </a>
            ) : (
              <button className="button" disabled>
                <Download size={19} />
                {demo
                  ? t("PDF недоступен в демо", "PDF unavailable in demo")
                  : t("Скачивание недоступно", "Download unavailable")}
              </button>
            )}
            <Link
              href={demo ? "/books" : "/my-books"}
              className="text-link"
              onClick={onSafeLeave}
            >
              {demo
                ? t("Вернуться к историям", "Back to stories")
                : t("Мои книги", "My books")}
            </Link>
          </div>
        )}
        {job &&
          ["preview_failed", "book_failed", "expired", "cancelled"].includes(
            status,
          ) && (
            <div className="notice">
              <Info size={24} />
              <div>
                <p>
                  {status === "book_failed"
                    ? t(
                        "Оплата уже подтверждена. Не оплачивайте повторно. Свяжитесь с поддержкой для восстановления заказа или возврата.",
                        "Your payment is already confirmed. Do not pay again. Contact support to recover the order or arrange a refund.",
                      )
                    : t(
                        "Продолжить этот предпросмотр сейчас нельзя. Можно обновить статус или обратиться в поддержку.",
                        "This preview cannot continue right now. Refresh the status or contact support.",
                      )}
                </p>
                <Link href="/support" className="text-link">
                  {t("Помощь с заказом", "Order help")}
                </Link>
              </div>
            </div>
          )}
        {pollPaused && (
          <p className="notice" role="status">
            {t(
              "Автообновление приостановлено. Это не отменяет заказ. Нажмите «Обновить статус».",
              "Automatic refresh is paused. Your order has not been cancelled. Choose Refresh status.",
            )}
          </p>
        )}
        {error && (
          <p className="form-error" role="alert">
            {errors[error] || errors.network}
          </p>
        )}
        {job &&
          (pollPaused ||
            ["preview_failed", "book_failed", "expired", "cancelled"].includes(
              status,
            )) && (
            <button
              className="button button-outline"
              disabled={busy}
              onClick={refresh}
            >
              <RefreshCw size={16} />
              {t("Обновить статус", "Refresh status")}
            </button>
          )}
      </div>
      <aside className="purchase-aside">
        <p className="eyebrow">{t("Ваша история", "Your story")}</p>
        <h2>{book.title[locale]}</h2>
        {details && (
          <p className="purchase-child">
            {details.name} · {formatChildAge(details.age, locale)}
          </p>
        )}
        <ul>
          <li>
            <Check size={16} />
            {t("Две страницы до оплаты", "Two pages before payment")}
          </li>
          <li>
            <Check size={16} />
            {t("Стиль исходной книги", "Original book’s illustration style")}
          </li>
          <li>
            <Check size={16} />
            {t("Имя ребёнка в истории", "Child’s name in the story")}
          </li>
          <li>
            <Check size={16} />
            {t("Полная книга в PDF", "Complete PDF book")}
          </li>
        </ul>
        <div className="purchase-price">
          <span>
            {demo
              ? t("Пример цены в демо", "Example demo price")
              : t("Полная стоимость", "Total price")}
          </span>
          <strong>{formatPrice(job?.quote, locale)}</strong>
          <small>{t("Без подписки", "No subscription")}</small>
        </div>
        <p className="field-help">
          {t(
            "До запуска: демонстрация без генерации и оплаты.",
            "Before launch: demonstration without generation or payment.",
          )}
        </p>
      </aside>
    </section>
  );
}
