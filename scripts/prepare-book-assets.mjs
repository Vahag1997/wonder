import { execFileSync } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const books = [
  ["amir", "/Users/macrpo/Desktop/testbook/Книга Амир_новая обложка 20х20.pdf"],
  [
    "fluffy",
    "/Users/macrpo/Desktop/testbook/-Maksim-and-Fluffy's-Adventure.pdf",
  ],
  ["abc", "/Users/macrpo/Desktop/testbook/The-ABC-Journey-with-Sasha--.pdf"],
];
await mkdir("tmp/book-art", { recursive: true });
await mkdir("public/images/books", { recursive: true });
for (const [id, pdf] of books) {
  for (const page of [1, 3, 5]) {
    const prefix = path.resolve(`tmp/book-art/${id}-${page}`);
    execFileSync("pdftoppm", [
      "-f",
      String(page),
      "-l",
      String(page),
      "-singlefile",
      "-scale-to",
      "1600",
      "-png",
      pdf,
      prefix,
    ]);
    await sharp(`${prefix}.png`)
      .webp({ quality: 85 })
      .toFile(`public/images/books/${id}-${page}.webp`);
    console.log(`Prepared ${id}, source page ${page}`);
  }
}
