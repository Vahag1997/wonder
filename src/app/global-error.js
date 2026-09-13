"use client";
export default function GlobalError({ reset }) {
  return (
    <html lang="ru">
      <body
        style={{
          fontFamily: "system-ui,sans-serif",
          background: "#fffdf8",
          color: "#24352e",
          padding: "12vh 24px",
          textAlign: "center",
        }}
      >
        <h1>Не удалось открыть страницу.</h1>
        <p>Попробуйте ещё раз или обновите страницу.</p>
        <button
          onClick={reset}
          style={{
            padding: "12px 24px",
            borderRadius: 30,
            background: "#285744",
            color: "#fff",
            border: 0,
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          Попробовать снова
        </button>
      </body>
    </html>
  );
}
