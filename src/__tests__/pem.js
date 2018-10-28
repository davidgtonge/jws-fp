const fs = require("fs")
const path = require("path")
// const convert = require("")
const {pem2jwk} = require("pem-jwk")

const {urlEncode} = require("../base64url")
const SEQUENCE_TAG = 0x30
const INTEGER_TAG = 0x02

const getSlice = (sig, offset, bytes) => {
  const pos = sig.indexOf(INTEGER_TAG, offset) + 1
  const length = sig[pos]
  const start = length === bytes + 1 ? pos + 2 : pos + 1
  const end = start + bytes
  const prefix = length < bytes ? Buffer.from([0]) : Buffer.from([])
  return [sig.slice(start, end), prefix, end]
}

const convert = (sig, bytes) => {
  const [r, rPrefix, offset] = getSlice(sig, 0, bytes)
  const [s, sPrefix] = getSlice(sig, offset, bytes)
  return urlEncode(Buffer.concat([rPrefix, r, sPrefix, s]).toString("base64"))
}

const a = fs.readFileSync(path.join(__dirname, "keys/public-rs.pem")).toString()

const getKey = str =>
  Buffer.from(
    str
      .split("\n")
      .filter(line => !line.match("KEY---"))
      .join(""),
    "base64"
  )

const key = getKey(a)

// console.log(key.toJSON())

const jwk = pem2jwk(a)
console.log(jwk)

const pos = key.indexOf(INTEGER_TAG, 0) + 1

console.log(pos)
console.log(key[pos + 1])
const length = key[pos]
const int = key.slice(pos + 4, length)
console.log({length})
console.log(int.length)
console.log(Buffer.from(jwk.n, "base64").length)

// const pos2 = key.indexOf(INTEGER_TAG, pos + 1)
// console.log(pos2)
