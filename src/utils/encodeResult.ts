import { compress, decompress } from "lzutf8";
export function encode(result: string) {
  return compress(result, { outputEncoding: "Base64" }).replace(/=+$/, "");
}
export function decode(encoded: string) {
  return decompress(encoded, { inputEncoding: "Base64" }).toString();
}
