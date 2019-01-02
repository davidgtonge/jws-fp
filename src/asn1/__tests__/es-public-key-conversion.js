/* eslint-env jest */
/* eslint fp/no-unused-expression: 0 */
/* eslint no-magic-numbers: 0 */

const crypto = require("crypto")
const keyutil = require("js-crypto-key-utils")

const {pemToJwks, jwksToDer} = require("../es-public-key-conversion")
const {pemToDer} = require("../key-utils")

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

const run = async curve => {
  const {publicKey} = createKey(curve)
  const expected = await new keyutil.Key("pem", publicKey).export("jwk")
  const actual = pemToJwks(publicKey)
  return {
    actual,
    expected,
  }
}

const runToPem = async curve => {
  const {publicKey} = createKey(curve)
  const jwks = pemToJwks(publicKey)
  const actual = jwksToDer(jwks)
  const expected = pemToDer(publicKey)
  return {
    actual,
    expected,
  }
}

const runs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

describe("es key conversion - to jwjs", () => {
  runs.forEach(i => {
    it(`creates jwk from P-256 key - ${i}`, async () => {
      const {actual, expected} = await run("P-256")
      expect(actual).toEqual(expected)
    })
  })

  runs.forEach(i => {
    it(`creates jwk from P-384 key - ${i}`, async () => {
      const {actual, expected} = await run("P-384")
      expect(actual).toEqual(expected)
    })
  })

  runs.forEach(i => {
    it(`creates jwk from P-521 key - ${i}`, async () => {
      const {actual, expected} = await run("P-521")
      expect(actual).toEqual(expected)
    })
  })
})

describe("es key conversion - to der", () => {
  runs.forEach(i => {
    it(`creates jwk from P-256 key - ${i}`, async () => {
      const {actual, expected} = await runToPem("P-256")
      expect(actual).toEqual(expected)
    })
  })

  runs.forEach(i => {
    it(`creates jwk from P-384 key - ${i}`, async () => {
      const {actual, expected} = await runToPem("P-384")
      expect(actual).toEqual(expected)
    })
  })

  runs.forEach(i => {
    it(`creates jwk from P-521 key - ${i}`, async () => {
      const {actual, expected} = await runToPem("P-521")
      expect(actual).toEqual(expected)
    })
  })
})
