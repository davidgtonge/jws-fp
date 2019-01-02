const crypto = require("crypto")
const rsPublicKeyConversion = require("./asn1/rs-public-key-conversion")
const esPublicKeyConversion = require("./asn1/es-public-key-conversion")

const getKeyOpts = alg => {}

module.exports = {
  isJWK(key) {
    return key.kty
  },
  es: {
    fromJWK: esPublicKeyConversion.jwksToDer,
    toJWK: esPublicKeyConversion.pemToJwks,
  },
  rs: {
    fromJWK: rsPublicKeyConversion.jwksToDer,
    toJWK: rsPublicKeyConversion.pemToJwks,
  },
  generate: async alg => {
    const opts = getKeyOpts(alg)
    // todo: need to first support private key conversion
  },
}
