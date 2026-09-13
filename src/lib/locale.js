import "server-only";
import { cookies } from "next/headers";
export async function getLocale() {
  // Russian is the primary audience. Only an explicit English choice overrides it.
  return (await cookies()).get("wonder-language")?.value === "en" ? "en" : "ru";
}
