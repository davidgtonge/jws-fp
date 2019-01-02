/* eslint fp/no-this:0 */
/* eslint  new-cap:0 */

const asn = require("asn1.js")
const {urlEncodeBuffer} = require("../base64url")
const {pemToDer} = require("./key-utils")
const PublicKeyInfo = require("./spki-public-key")

const RSAPublicKey = asn.define("RSAPublicKey", function() {
  this.seq().obj(
    this.key("modulus").int(), // n
    this.key("publicExponent").int() // e
  )
})

const decodeKey = der => {
  try {
    const {PublicKey} = PublicKeyInfo.decode(der, "der")
    return RSAPublicKey.decode(PublicKey.data, "der")
  } catch (e) {
    try {
      return RSAPublicKey.decode(der, "der")
    } catch (e) {
      throw new Error("Failed to decode RS Public Key")
    }
  }
}

exports.pemToJwks = pem => {
  const key = pemToDer(pem)
  const {modulus, publicExponent} = decodeKey(key)

  return {
    kty: "RSA",
    e: urlEncodeBuffer(publicExponent.toBuffer("be")),
    n: urlEncodeBuffer(modulus.toBuffer("be")),
  }
}

exports.jwksToDer = jwks => {
  const data = {
    modulus: new asn.bignum(Buffer.from(jwks.n, "base64")),
    publicExponent: new asn.bignum(Buffer.from(jwks.e, "base64")),
  }

  return RSAPublicKey.encode(data, "der")
}
