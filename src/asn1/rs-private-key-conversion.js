/* eslint fp/no-this:0 */
/* eslint  new-cap:0 */

const asn = require("asn1.js")
const {urlEncodeBuffer} = require("../base64url")
const {pemToDer} = require("./key-utils")
const PrivateKeyInfo = require("./private-key-info")

const OtherPrimeInfo = asn.define("OtherPrimeInfo", function() {
  this.seq().obj(
    this.key("prime").int(),
    this.key("exponent").int(),
    this.key("coefficient").int()
  )
})

const OtherPrimeInfos = asn.define("OtherPrimeInfos", function() {
  this.seqof(OtherPrimeInfo)
})

const RSAPrivateKey = asn.define("RSAPrivateKey", function() {
  this.seq().obj(
    this.key("version").int(), // 0
    this.key("modulus").int(), // n
    this.key("publicExponent").int(), // e
    this.key("privateExponent").int(), // d
    this.key("prime1").int(), // p
    this.key("prime2").int(), // q
    this.key("exponent1").int(), // d mod (p-1)
    this.key("exponent2").int(), // d mod (q-1)
    this.key("coefficient").int(), // (inverse of q) mod p
    this.key("otherPrimeInfos")
      .optional()
      .use(OtherPrimeInfos)
  )
})

const decodeKey = der => {
  try {
    const {privateKey} = PrivateKeyInfo.decode(der, "der")
    return RSAPrivateKey.decode(privateKey)
  } catch (e) {
    try {
      return RSAPrivateKey.decode(der, "der")
    } catch (e) {
      console.log(e)
      throw new Error("Failed to decode RS Private Key")
    }
  }
}

exports.pemToJwks = pem => {
  const key = pemToDer(pem)
  const result = decodeKey(key)
  return console.log(result)
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

const crypto = require("crypto")
const createKey = size =>
  crypto.generateKeyPairSync("rsa", {
    modulusLength: size,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  })

const key = createKey(2048)
console.log(key)

exports.pemToJwks(key.privateKey)
