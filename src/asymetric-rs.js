const crypto = require("crypto")
const {urlEncode} = require("./base64url")
const jwk = require("./jwk")

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

const verify = (length, type) => (string, sig, publicKey) => {
  const key = jwk.isJWK(publicKey) ? jwk.rs.fromJWK(publicKey) : publicKey

  return crypto
    .createVerify("SHA" + length)
    .update(string)
    .verify(getKey(type, key), sig, "base64")
}

module.exports = (length, type) => ({
  sign: sign(length, type),
  verify: verify(length, type),
})
