export function encode(result: number[]) {
  return result.join("");
}
export function decode(encoded: string) {
  return encoded.split("").map((c) => parseInt(c));
}
