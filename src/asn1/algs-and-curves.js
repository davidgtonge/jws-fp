/* eslint  no-magic-numbers:0 */

const signatureSizes = {
  ES256: 32,
  ES384: 48,
  ES512: 66,
}

// https://www.ietf.org/rfc/rfc5480.txt
const namedCurves = [
  {
    name: "P-256",
    oid: [1, 2, 840, 10045, 3, 1, 7],
  },
  {
    name: "P-384",
    oid: [1, 3, 132, 0, 34],
  },
  {
    name: "P-521",
    oid: [1, 3, 132, 0, 35],
  },
  {
    name: "P-256K",
    oid: [1, 3, 132, 0, 10],
  },
]

// https://tools.ietf.org/html/rfc3279
const publicKeyAlgorithms = [
  {
    name: "EC",
    oid: [1, 2, 840, 10045, 2, 1],
  },
  {
    name: "RSA",
    oid: [1, 2, 840, 113549, 1, 1, 1],
  },
]

const matchByOid = algs => oid => {
  const oidString = oid.toString()
  const alg = algs.find(a => a.oid.toString() === oidString)
  return alg && alg.name
}

exports.getOidByCurve = curve =>
  (namedCurves.find(a => a.name === curve) || {}).oid

exports.getCurve = matchByOid(namedCurves)
exports.getAlg = matchByOid(publicKeyAlgorithms)

exports.getSignatureSize = alg => signatureSizes[alg]
