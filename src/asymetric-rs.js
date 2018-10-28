const crypto = require("crypto")
const {urlEncode} = require("./base64url")

const PADDING = {
  PS: crypto.constants.RSA_PKCS1_PSS_PADDING,
  RS: crypto.constants.RSA_PKCS1_PADDING,
}

const getKey = (type, key) => ({key, padding: PADDING[type]})

const sign = (length, type) => (string, privateKey) =>
  urlEncode(
    crypto
      .createSign("SHA" + length)
      .update(string)
      .sign(getKey(type, privateKey), "base64")
  )

const verify = (length, type) => (string, sig, publicKey) =>
  crypto
    .createVerify("SHA" + length)
    .update(string)
    .verify(getKey(type, publicKey), sig, "base64")

module.exports = (length, type) => ({
  sign: sign(length, type),
  verify: verify(length, type),
})
