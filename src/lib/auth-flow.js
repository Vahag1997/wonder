export function safeAuthNext(value, fallback = "/my-books") {
  if (typeof value !== "string" || value.length > 300 || /[\\\r\n]/.test(value)) return fallback;
  if (["/my-books", "/orders", "/account", "/reset?mode=update"].includes(value)) return value;
  if (/^\/books\/[a-z0-9-]+\/personalize$/.test(value)) return value;
  return fallback;
}
export function authMessage(code, locale = "ru") {
  const messages = {
    invalid_credentials: ["Неверный email или пароль.", "Incorrect email or password."],
    email_not_confirmed: ["Подтвердите email по ссылке в письме.", "Confirm your email using the link in your inbox."],
    weak_password: ["Используйте более надёжный пароль: не менее 12 символов.", "Use a stronger password with at least 12 characters."],
    over_request_rate_limit: ["Слишком много попыток. Подождите немного.", "Too many attempts. Please wait before trying again."],
    over_email_send_rate_limit: ["Письма отправляются слишком часто. Попробуйте позже.", "Too many email requests. Please try later."],
    email_address_not_authorized: ["Отправка писем новым пользователям ещё настраивается. Попробуйте позже.", "Email delivery for new customers is still being configured. Please try later."],
    signup_disabled: ["Регистрация пока закрыта.", "Registration is not open yet."],
    otp_expired: ["Ссылка истекла или уже использована. Запросите новое письмо.", "This link expired or has already been used. Request a new email."],
    default: ["Не удалось выполнить запрос. Проверьте данные и попробуйте позже.", "We couldn’t complete the request. Check your details and try later."],
  };
  return (messages[code] || messages.default)[locale === "ru" ? 0 : 1];
}
