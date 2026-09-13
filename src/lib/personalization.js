export const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
export function validateAge(raw) {
  const text = String(raw ?? "").trim();
  if (!/^\d{1,2}$/.test(text)) return { error: "age" };
  const value = Number(text);
  if (value < 1 || value > 12) return { error: "age" };
  return { value };
}
export function validateName(raw) {
  const value = String(raw ?? "")
    .normalize("NFC")
    .trim()
    .replace(/\s+/g, " ");
  if (!value) return { error: "required" };
  if ([...value].length > 40) return { error: "length" };
  if (!/^\p{L}[\p{L}\p{M}]*(?:[ '\u2019-]\p{L}[\p{L}\p{M}]*)*$/u.test(value))
    return { error: "characters" };
  return { value };
}
export function validatePhotoHeader(bytes, type, size) {
  if (size === 0 || size > MAX_PHOTO_BYTES) return "size";
  const png =
    bytes[0] === 137 &&
    bytes[1] === 80 &&
    bytes[2] === 78 &&
    bytes[3] === 71 &&
    bytes[4] === 13 &&
    bytes[5] === 10 &&
    bytes[6] === 26 &&
    bytes[7] === 10;
  const jpeg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  const webp =
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  if (
    !(
      (type === "image/png" && png) ||
      (type === "image/jpeg" && jpeg) ||
      (type === "image/webp" && webp)
    )
  )
    return "type";
  return null;
}
export function validatePhotoDimensions(width, height) {
  if (width < 320 || height < 320) return "small";
  if (width > 10000 || height > 10000 || width * height > 24000000)
    return "large";
  return null;
}
