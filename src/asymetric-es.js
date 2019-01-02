const crypto = require("crypto")
const {derToJose, joseToDer} = require("./asn1/es-sig-conversion")
const jwk = require("./jwk")

const sign = (length, alg) => (string, privateKey) =>
  derToJose(
    crypto
      .createSign("SHA" + length)
      .update(string)
      .sign(privateKey),
    alg
  )

const verify = length => (string, sig, publicKey) => {
  const key = jwk.isJWK(publicKey) ? jwk.es.fromJWK(publicKey) : publicKey
  return crypto
    .createVerify("SHA" + length)
    .update(string)
    .verify(key, joseToDer(sig))
}

module.exports = (length, alg) => ({
  sign: sign(length, alg),
  verify: verify(length),
})
