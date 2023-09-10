const BASE_64_CHARS =
  "0123456789_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+";

function toBase64(int) {
  let result = "";
  const base = BigInt(64);
  while (int > 0n) {
    result += BASE_64_CHARS[Number(int % base)];
    int /= base;
    int = BigInt(int);
  }
  return result.split("").reverse().join("");
}

function fromBase64(str) {
  let result = 0n;
  const base = BigInt(64);
  const strArr = str.split("").reverse();
  for (let i = 0; i < strArr.length; i++) {
    result += BigInt(BASE_64_CHARS.indexOf(strArr[i])) * base ** BigInt(i);
  }
  return result;
}
function answerToInt(answer) {
  answer = answer.split("").map((x) => x - 1);
  let result = 0n;
  for (let i = 0; i < answer.length; i++) {
    result += BigInt(answer[i]) * 3n ** BigInt(i);
  }
  return result;
}

function intToAnswer(int) {
  let result = [];
  int = BigInt(int);
  while (int > 0) {
    result.push(int % 3n);
    int = int / 3n;
  }
  result = result.map((x) => parseInt(x) + 1).join("");
  return result;
}
function encode(str) {
  return toBase64(answerToInt(str));
}
function decode(str) {
  const decoded = intToAnswer(fromBase64(str));
  if (decoded.length < 38) {
    return decoded.padStart(38, "1");
  }
  return decoded;
}
export default function useAnswer() {
  return { encode, decode };
}
