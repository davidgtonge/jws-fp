const crypto = require("crypto")
const {urlEncode} = require("./base64url")

const hmac = (length, str, secret) =>
  crypto.createHmac("sha" + length, secret).update(str)

const sign = length => (str, secret) =>
  urlEncode(hmac(length, str, secret).digest("base64"))

const verify = length => (str, sig, secret) =>
  crypto.timingSafeEqual(
    Buffer.from(sig, "base64"),
    hmac(length, str, secret).digest()
  )

module.exports = length => ({sign: sign(length), verify: verify(length)})
