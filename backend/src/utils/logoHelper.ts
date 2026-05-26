import fs from "fs";
import path from "path";

export function getLogoBase64(): string | null {
  const logoPath = path.join(__dirname, "../public/logo.png");
  if (!fs.existsSync(logoPath)) return null;

  const buffer = fs.readFileSync(logoPath);
  return `data:image/png;base64,${buffer.toString("base64")}`;
}
