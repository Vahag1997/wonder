import assert from "node:assert/strict";

const baseURL = process.env.WONDER_TEST_URL || "http://127.0.0.1:3001";
const routes = [
  ["/", "Персональные книги для детей", "A little person"],
  ["/books", "Наши истории", "Our stories"],
  ["/books/amir-and-new-friends", "Маленький герой", "A little hero"],
  [
    "/books/amir-and-new-friends/personalize",
    "Персонализация книги",
    "Make it their story",
  ],
  ["/support", "Помощь и ответы", "Help &amp; answers"],
  ["/login", "Вход", "Sign in"],
  ["/register", "Регистрация", "Create an account"],
  ["/reset", "Восстановление пароля", "Reset password"],
  ["/account", "Ваш аккаунт", "Your account"],
  ["/my-books", "Мои книги", "My books"],
  ["/orders", "Мои заказы", "My orders"],
  ["/orders/example", "Детали заказа", "Order details"],
];
for (const [cookie, expected] of [
  [null, "ru"],
  ["invalid", "ru"],
  ["ru", "ru"],
  ["en", "en"],
]) {
  const headers = cookie ? { Cookie: `wonder-language=${cookie}` } : {};
  for (const [route, ruTitle, enTitle] of routes) {
    const response = await fetch(baseURL + route, { headers });
    assert.equal(response.status, 200, route);
    const html = await response.text();
    assert(
      new RegExp(`<html\\b[^>]*\\blang="${expected}"`).test(html),
      `${route}: document language ${expected}`,
    );
    const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
    assert(
      title?.includes(expected === "ru" ? ruTitle : enTitle),
      `${route}: ${title}`,
    );
    if (route === "/") {
      assert(
        html.includes(
          expected === "ru" ? "Подарите сказку," : "A little person.",
        ),
      );
      assert(
        html.includes(`content="${expected === "ru" ? "ru_RU" : "en_US"}"`),
      );
    }
  }
  const missing = await fetch(baseURL + "/books/unknown-book", { headers });
  assert.equal(missing.status, 404);
  assert(
    (await missing.text()).includes(
      expected === "ru" ? "Страница не найдена" : "A missing page",
    ),
  );
  console.log(
    `PASS ${cookie ?? "new visitor"}: ${expected}, 12 routes and localized 404`,
  );
}
console.log(
  "Russian default, invalid-cookie fallback, and explicit RU/EN preferences verified.",
);
