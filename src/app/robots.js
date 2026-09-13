export default function robots() {
  return {
    rules: {
      userAgent: "*",
      disallow:
        process.env.WONDER_PUBLIC_INDEXING === "true"
          ? [
              "/account",
              "/my-books",
              "/orders",
              "/login",
              "/register",
              "/reset",
              "/books/*/personalize",
              "/supabase-test",
              "/telegram",
            ]
          : "/",
    },
  };
}
