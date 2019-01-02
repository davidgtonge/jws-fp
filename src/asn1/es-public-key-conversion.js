/* eslint fp/no-this:0 */
/* eslint  no-magic-numbers:0 */
const {urlEncodeBuffer} = require("../base64url")
const {getAlg, getCurve, getOidByCurve} = require("./algs-and-curves")
const {pemToDer, sliceBuffer} = require("./key-utils")
const PublicKeyInfo = require("./spki-public-key")

exports.pemToJwks = pem => {
  const key = pemToDer(pem)
  const {
    PublicKey: {data},
    algorithm,
  } = PublicKeyInfo.decode(key, "der")

  const [x, y] = sliceBuffer(data, [1, 1 + (data.length - 1) / 2])

  return {
    x: urlEncodeBuffer(x),
    y: urlEncodeBuffer(y),
    kty: getAlg(algorithm.algorithm),
    crv: getCurve(algorithm.parameters.value),
  }
}

exports.jwksToDer = jwks => {
  const key = Buffer.concat([
    Buffer.from([4]),
    Buffer.from(jwks.x, "base64"),
    Buffer.from(jwks.y, "base64"),
  ])

  const curveOid = getOidByCurve(jwks.crv)

  const data = {
    algorithm: {
      algorithm: [1, 2, 840, 10045, 2, 1],
      parameters: {
        type: "namedCurve",
        value: curveOid,
      },
    },
    PublicKey: {
      unused: 0,
      data: key,
    },
  }

  return PublicKeyInfo.encode(data, "der")
}
