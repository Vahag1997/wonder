import { getLocale } from "@/lib/locale";
export default async function Loading() {
  const ru = (await getLocale()) === "ru";
  return (
    <div className="route-loading wrap" role="status" aria-live="polite">
      <span className="loading-dot" />
      <p>
        {ru ? "Открываем вашу книжную полку…" : "Opening your story shelf…"}
      </p>
    </div>
  );
}
