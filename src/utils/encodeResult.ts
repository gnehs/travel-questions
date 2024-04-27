const minNumber = 1n, maxNumber = 3n
const numberRange = maxNumber - minNumber + 1n
const charSetRange = 0x100n

function bigToCode(value: BigInt, range: BigInt, offset: BigInt = 0n) {
  const code: BigInt[] = []
  for (let x = value; x > 0n; x /= range)
    code.push(x % range + offset)
  return code.reverse()
}

function codeToBig(code: BigInt[], range: BigInt, offset: BigInt = 0n) {
  return code.reduce((acc, x) => acc * range + BigInt(x) - offset, 0n)
}

function bigTobytes(value: BigInt) {
  const code = bigToCode(value, charSetRange)
  return String.fromCharCode(...code.map(Number))
}

function bytesToBig(encoded: string) {
  const code = encoded.split("").map(c => BigInt(c.charCodeAt(0)))
  return codeToBig(code, charSetRange)
}

export function encode(result: number[]) {
  const code = result.map(BigInt)
  if (!code.every(x => minNumber <= x && x <= maxNumber))
    return result.join("");
  const value = codeToBig(code, numberRange, minNumber)
  return btoa(bigTobytes(value))
}

export function decode(encoded: string) {
  const value = bytesToBig(atob(encoded))
  return bigToCode(value, numberRange, minNumber).map(Number)
}
