const SEGMENT_LENGTH = 4
const PAD_SYMBOL = "="
const BASE64 = "base64"

const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)))

const pad = str => str + PAD_SYMBOL.repeat(str.length % SEGMENT_LENGTH)
const toB64 = str => Buffer.from(str).toString(BASE64)
const fromB64url = str => Buffer.from(str, BASE64).toString()
const urlEncode = str =>
  str
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")

module.exports = {
  decode: fromB64url,
  encode: compose(
    urlEncode,
    toB64
  ),
  urlEncode,
}
