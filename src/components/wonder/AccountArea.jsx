"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Package,
  UserRound,
  ArrowUpRight,
  Eye,
  EyeOff,
  Info,
  LogOut,
  Mail,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { getMyBooks, getMyOrders } from "@/lib/api";
import { authMessage, safeAuthNext } from "@/lib/auth-flow";

export default function AccountArea({
  section = "login",
  locale = "ru",
  orderId,
  recoveryMode = false,
  linkError = false,
  next,
}) {
  const ru = locale === "ru";
  const router = useRouter();
  const configured = !!supabase;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(configured);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(linkError ? authMessage("otp_expired", locale) : "");
  const [message, setMessage] = useState("");
  const [records, setRecords] = useState([]);
  const [retry, setRetry] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [recovery, setRecovery] = useState(recoveryMode);
  const [fields, setFields] = useState({ email: "", password: "", name: "" });
  useEffect(() => {
    if (!supabase) return;
    let active = true;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (active) {
        setUser(session?.user ?? null);
        if (event === "PASSWORD_RECOVERY") setRecovery(true);
        setLoading(false);
      }
    });
    supabase.auth
      .getUser()
      .then(({ data, error: err }) => {
        if (!active) return;
        if (err && err.name !== "AuthSessionMissingError")
          setError(
            ru
              ? "Не удалось проверить вход. Попробуйте ещё раз."
              : "We couldn’t check your session. Please try again.",
          );
        setUser(data.user ?? null);
        setLoading(false);
      })
      .catch(() => {
        if (active) {
          setLoading(false);
          setError(
            ru
              ? "Сервис аккаунта недоступен."
              : "The account service is unavailable.",
          );
        }
      });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [ru, retry]);
  useEffect(() => {
    setRecords([]);
    if (!user || !["my-books", "orders", "order"].includes(section)) return;
    let active = true;
    setPending(true);
    setError("");
    const request = section === "my-books" ? getMyBooks() : getMyOrders({ id: orderId });
    request
      .then((data) => {
        if (active) setRecords(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (active)
          setError(
            ru
              ? "Не удалось загрузить данные. Попробуйте ещё раз."
              : "We couldn’t load your records. Please try again.",
          );
      })
      .finally(() => {
        if (active) setPending(false);
      });
    return () => {
      active = false;
    };
  }, [user, section, retry, ru, orderId]);
  const titles = {
    login: ru ? "С возвращением." : "A little welcome back.",
    register: ru ? "Начнём вашу историю." : "Let’s start your story.",
    reset: ru ? "Снова вместе." : "Let’s get you back in.",
    account: ru ? "Ваш уголок Wonder." : "Your little corner of Wonder.",
    "my-books": ru ? "Ваша книжная полка." : "Your very own story shelf.",
    orders: ru ? "Ваши заказы." : "Your story, on its way.",
    order: ru ? "Детали заказа." : "Your order details.",
  };
  const authScreen = ["login", "register", "reset"].includes(section);
  async function submit(event) {
    event.preventDefault();
    if (!supabase || pending) return;
    setPending(true);
    setError("");
    setMessage("");
    try {
      if (section === "reset") {
        if (recovery) {
          if (!user) {
            setError(authMessage("otp_expired", locale));
            return;
          }
          const result = await supabase.auth.updateUser({
            password: fields.password,
          });
          if (result.error) throw result.error;
          setMessage(
            ru ? "Пароль обновлён." : "Your password has been updated.",
          );
          setRecovery(false);
          setFields({ ...fields, password: "" });
        } else {
          const result = await supabase.auth.resetPasswordForEmail(
            fields.email.trim(),
            { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/reset?mode=update")}` },
          );
          if (result.error) throw result.error;
          setMessage(
            ru
              ? "Если аккаунт существует, письмо для сброса отправлено."
              : "If an account exists, a reset email has been sent.",
          );
        }
      } else if (section === "register") {
        const result = await supabase.auth.signUp({
          email: fields.email.trim(),
          password: fields.password,
          options: {
            data: { name: fields.name.trim() },
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(safeAuthNext(next))}`,
          },
        });
        if (result.error) throw result.error;
        if (result.data.session) { router.push(safeAuthNext(next)); router.refresh(); }
        else
          setMessage(
            ru
              ? "Проверьте почту для подтверждения аккаунта."
              : "Check your inbox to confirm your account before signing in.",
          );
      } else {
        const result = await supabase.auth.signInWithPassword({
          email: fields.email.trim(),
          password: fields.password,
        });
        if (result.error) throw result.error;
        router.push(safeAuthNext(next));
        router.refresh();
      }
    } catch (err) {
      setError(authMessage(err?.code, locale));
    } finally {
      setPending(false);
    }
  }
  async function logout() {
    if (!supabase) return;
    setPending(true);
    const { error: err } = await supabase.auth.signOut();
    setPending(false);
    if (err)
      setError(
        ru
          ? "Не удалось выйти. Попробуйте ещё раз."
          : "We couldn’t sign you out. Please try again.",
      );
    else { setRecords([]); setUser(null); router.push("/login"); router.refresh(); }
  }
  const notice = (
    <div className="notice">
      <Info size={20} />
      <p>
        {ru
          ? "Аккаунты пока не подключены в этой демонстрации. Вы можете посмотреть истории и попробовать шаги персонализации."
          : "Accounts are not connected in this preview. You can still explore stories and try the personalization steps."}
      </p>
    </div>
  );
  if (authScreen)
    return (
      <section className="section wrap auth-layout">
        <div className="auth-card">
          <p className="eyebrow">
            {ru ? "Ваше место в истории" : "A place in the story"}
          </p>
          <h1>
            {recovery
              ? ru
                ? "Новый пароль."
                : "A fresh password."
              : titles[section]}
          </h1>
          <p className="panel-description">
            {section === "register"
              ? ru
                ? "Создайте аккаунт для ваших книг и заказов."
                : "Create an account for your books and orders."
              : section === "reset"
                ? ru
                  ? "Укажите почту аккаунта или задайте новый пароль по ссылке из письма."
                  : "Enter your account email, or set a new password after following your recovery link."
                : ru
                  ? "Войдите, чтобы вернуться к книгам и заказам."
                  : "Sign in to come back to your stories and orders."}
          </p>
          {!configured && notice}
          {recovery && !loading && !user && (
            <p className="form-error" role="alert">
              {authMessage("otp_expired", locale)} {" "}
              <Link href="/reset">{ru ? "Запросить новую ссылку" : "Request a new link"}</Link>
            </p>
          )}
          <form onSubmit={submit}>
            <fieldset disabled={!configured || pending || loading || (recovery && !user)} className="auth-fields">
              {section === "register" && (
                <label className="field-label">
                  {ru ? "Ваше имя" : "Your name"}
                  <input
                    className="text-input"
                    autoComplete="given-name"
                    value={fields.name}
                    maxLength={80}
                    required
                    onChange={(e) =>
                      setFields({ ...fields, name: e.target.value })
                    }
                  />
                </label>
              )}
              {!recovery && (
                <label className="field-label">
                  {ru ? "Электронная почта" : "Email address"}
                  <input
                    type="email"
                    className="text-input"
                    autoComplete="email"
                    value={fields.email}
                    required
                    maxLength={254}
                    onChange={(e) =>
                      setFields({ ...fields, email: e.target.value })
                    }
                  />
                </label>
              )}
              {(section !== "reset" || recovery) && (
                <div>
                  <label className="field-label" htmlFor="account-password">
                    {ru ? "Пароль" : "Password"}
                  </label>
                  <div className="password-field">
                    <input
                      id="account-password"
                      type={showPassword ? "text" : "password"}
                      className="text-input"
                      autoComplete={
                        section === "register" || recovery
                          ? "new-password"
                          : "current-password"
                      }
                      value={fields.password}
                      required
                      minLength={section === "register" || recovery ? 12 : 1}
                      maxLength={128}
                      onChange={(e) =>
                        setFields({ ...fields, password: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      className="icon-button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword
                          ? ru
                            ? "Скрыть пароль"
                            : "Hide password"
                          : ru
                            ? "Показать пароль"
                            : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {(section === "register" || recovery) && (
                    <p className="field-help">
                      {ru ? "Не менее 12 символов." : "At least 12 characters."}
                    </p>
                  )}
                </div>
              )}
              <button type="submit" className="button">
                {pending
                  ? ru
                    ? "Подождите…"
                    : "One moment…"
                  : section === "register"
                    ? ru
                      ? "Создать аккаунт"
                      : "Create account"
                    : section === "reset"
                      ? recovery
                        ? ru
                          ? "Обновить пароль"
                          : "Update password"
                        : ru
                          ? "Отправить ссылку"
                          : "Send reset link"
                      : ru
                        ? "Войти"
                        : "Sign in"}
                <ArrowUpRight size={17} />
              </button>
            </fieldset>
          </form>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          {message && (
            <p className="notice notice-success" role="status">
              {message}
            </p>
          )}
          <div className="auth-links">
            {section === "login" ? (
              <>
                <Link href={next ? `/register?next=${encodeURIComponent(safeAuthNext(next))}` : "/register"} className="text-link">
                  {ru ? "Создать аккаунт" : "Create an account"}
                </Link>
                <Link href="/reset" className="text-link">
                  {ru ? "Забыли пароль?" : "Forgot password?"}
                </Link>
              </>
            ) : (
              <Link href={next ? `/login?next=${encodeURIComponent(safeAuthNext(next))}` : "/login"} className="text-link">
                {ru ? "Вернуться ко входу" : "Back to sign in"}
              </Link>
            )}
          </div>
        </div>
        <div className="auth-art">
          <Image
            src="/images/storybook-forest.webp"
            alt={
              ru
                ? "Авторская иллюстрация волшебного леса"
                : "An original illustration of a magical storybook forest"
            }
            fill
            priority
            sizes="(max-width: 700px) 100vw, 50vw"
          />
          <div>
            <span className="eyebrow">
              {ru ? "Здесь начинается чудо" : "A little wonder awaits"}
            </span>
            <h2>
              {ru
                ? "История,\nк которой хочется вернуться."
                : "A story worth\ncoming back to."}
            </h2>
          </div>
        </div>
      </section>
    );
  const selected =
    section === "order"
      ? records.filter((record) => String(record.id) === orderId)
      : records;
  return (
    <section className="section wrap account-page">
      <div className="account-heading">
        <p className="eyebrow">{ru ? "Ваш Wonder" : "Your Wonder"}</p>
        <h1>{titles[section]}</h1>
      </div>
      <nav
        className="account-nav"
        aria-label={ru ? "Личный кабинет" : "Your account"}
      >
        {[
          ["/my-books", "my-books", BookOpen, ru ? "Мои книги" : "My books"],
          ["/orders", "orders", Package, ru ? "Заказы" : "Orders"],
          ["/account", "account", UserRound, ru ? "Аккаунт" : "Account"],
        ].map(([href, key, Icon, label]) => (
          <Link
            href={href}
            key={key}
            aria-current={section === key ? "page" : undefined}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>
      {!configured && notice}
      {loading || pending ? (
        <div className="empty-state" role="status">
          <span className="loading-dot" />
          <p>{ru ? "Загружаем…" : "Loading your corner of Wonder…"}</p>
        </div>
      ) : !user ? (
        <div className="empty-state">
          <BookOpen size={40} />
          <h2>
            {ru
              ? "Здесь будет ваша история."
              : "Your next chapter starts here."}
          </h2>
          <p>
            {configured
              ? ru
                ? "Войдите, чтобы увидеть ваши книги и заказы."
                : "Sign in to see your books and orders."
              : ru
                ? "В демонстрации нет заказов или готовых книг. Посмотрите коллекцию, чтобы начать."
                : "There are no orders or generated books in this preview. Explore the collection to get started."}
          </p>
          <Link className="button" href={configured ? "/login" : "/books"}>
            {configured
              ? ru
                ? "Войти"
                : "Sign in"
              : ru
                ? "Посмотреть истории"
                : "Explore the stories"}
            <ArrowUpRight size={18} />
          </Link>
        </div>
      ) : section === "account" ? (
        <div className="account-profile">
          <UserRound size={35} />
          <h2>{ru ? "Данные аккаунта" : "Account details"}</h2>
          <p>
            <Mail size={17} />
            {user.email}
          </p>
          <button
            className="button button-outline"
            disabled={pending}
            onClick={logout}
          >
            <LogOut size={17} />
            {ru ? "Выйти" : "Sign out"}
          </button>
        </div>
      ) : error ? (
        <div className="empty-state">
          <p role="alert" className="form-error">
            {error}
          </p>
          <button
            className="button button-outline"
            onClick={() => setRetry(retry + 1)}
          >
            {ru ? "Попробовать снова" : "Try again"}
          </button>
        </div>
      ) : !selected.length ? (
        <div className="empty-state">
          <BookOpen size={40} />
          <h2>{ru ? "Начнём первую главу?" : "Ready for chapter one?"}</h2>
          <p>
            {ru
              ? "Здесь пока нет записей."
              : "There is nothing on your shelf yet."}
          </p>
          <Link href="/books" className="button">
            {ru ? "Выбрать историю" : "Find a story"}
            <ArrowUpRight size={18} />
          </Link>
        </div>
      ) : (
        <div className="record-list">
          {selected.map((record) => (
            <article key={record.id}>
              <BookOpen size={28} />
              <div>
                <h2>{record.product?.title || record.id}</h2>
                <p>{({
                  draft: ru ? "Черновик" : "Draft",
                  pending: ru ? "Ожидает оплаты" : "Awaiting payment",
                  paid: ru ? "Оплачено" : "Paid",
                  generated: ru ? "Книга готова" : "Book ready",
                  canceled: ru ? "Отменён" : "Cancelled",
                })[record.status] || (ru ? "Уточняем статус" : "Checking status")}</p>
                <span className="subtle">
                  {new Intl.DateTimeFormat(ru ? "ru-RU" : "en-GB").format(
                    new Date(record.created_at),
                  )}
                </span>
              </div>
              {section === "orders" && (
                <Link
                  href={`/orders/${encodeURIComponent(record.id)}`}
                  className="text-link"
                >
                  {ru ? "Подробнее" : "View details"}
                  <ArrowUpRight size={17} />
                </Link>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
