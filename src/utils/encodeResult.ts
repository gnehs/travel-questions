import { compress, decompress } from "lzutf8";
export function encode(result: number[]) {
  return compress(result.join(""), { outputEncoding: "Base64" }).replace(
    /=+$/,
    ""
  );
}
export function decode(encoded: string) {
  return decompress(encoded, { inputEncoding: "Base64" })
    .toString()
    .split("")
    .map((c: string) => parseInt(c));
}
