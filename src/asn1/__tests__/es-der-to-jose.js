/* eslint-env jest */
/* eslint fp/no-unused-expression: 0 */
/* eslint no-magic-numbers: 0 */

const crypto = require("crypto")

const comparison = require("ecdsa-sig-formatter")

const {derToJose, joseToDer} = require("../es-sig-conversion")

const createKey = (curve = "P-256") =>
  crypto.generateKeyPairSync("ec", {
    namedCurve: curve,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "sec1",
      format: "pem",
    },
  })

const createString = () => crypto.randomBytes(32).toString("hex")

const sign = (str, key, hash = "SHA256") =>
  crypto
    .createSign(hash)
    .update(str)
    .sign(key.privateKey)

const run = (curve, hash, alg) => {
  const key = createKey(curve)
  const str = createString()
  const sig = sign(str, key, hash)
  const actual = derToJose(sig, alg)
  const expected = comparison.derToJose(sig, alg)
  const newSig = joseToDer(actual)
  return {
    sig,
    actual,
    expected,
    newSig,
  }
}

const runs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

describe("ES256 signature", () => {
  runs.forEach(i => {
    const {sig, actual, expected, newSig} = run("P-256", "SHA256", "ES256", 32)
    it(`creates converts to jose - ${i}`, () => {
      expect(actual).toEqual(expected)
    })
    it(`creates convers to der - ${i}`, () => {
      expect(newSig.equals(sig)).toBeTruthy()
    })
  })
})

describe("ES386 signature", () => {
  runs.forEach(i => {
    const {sig, actual, expected, newSig} = run("P-384", "SHA384", "ES384", 48)
    it(`creates converts to jose - ${i}`, () => {
      expect(actual).toEqual(expected)
    })
    it(`creates convers to der - ${i}`, () => {
      expect(newSig.equals(sig)).toBeTruthy()
    })
  })
})

describe("ES512 signature", () => {
  runs.forEach(i => {
    const {sig, actual, expected, newSig} = run("P-521", "SHA512", "ES512", 66)
    it(`creates converts to jose - ${i}`, () => {
      expect(actual).toEqual(expected)
    })
    it(`creates convers to der - ${i}`, () => {
      expect(newSig.equals(sig)).toBeTruthy()
    })
  })
})
