/* eslint-env jest */
/* eslint fp/no-unused-expression: 0 */
/* eslint no-magic-numbers: 0 */

const crypto = require("crypto")
const keyutil = require("js-crypto-key-utils")

const {pemToJwks, jwksToDer} = require("../rs-public-key-conversion")
const {pemToDer} = require("../key-utils")

const createKey = (size, encoding) =>
  crypto.generateKeyPairSync("rsa", {
    modulusLength: size,
    publicKeyEncoding: {
      type: encoding,
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  })

const run = async (size, encoding) => {
  const {publicKey} = createKey(size, encoding)
  const expected = await new keyutil.Key("pem", publicKey).export("jwk")
  const actual = pemToJwks(publicKey)
  return {
    actual,
    expected,
  }
}

const runToPem = (size, encoding) => {
  const {publicKey} = createKey(size, encoding)
  const jwks = pemToJwks(publicKey)
  const actual = jwksToDer(jwks)
  const expected = pemToDer(publicKey)
  return {
    actual,
    expected,
  }
}

const runs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

describe.only("rs key conversion - to jwjs", () => {
  runs.forEach(i => {
    it(`creates jwk from 2048 key, spki - ${i}`, async () => {
      const {actual, expected} = await run(2048, "spki")
      expect(actual).toEqual(expected)
    })
  })

  runs.forEach(i => {
    it(`creates jwk from 4096 key, spki - ${i}`, async () => {
      const {actual, expected} = await run(2048, "spki")
      expect(actual).toEqual(expected)
    })
  })
})

describe("rs key conversion - to der", () => {
  runs.forEach(i => {
    it(`creates jwk from 2048 key, spki - ${i}`, async () => {
      const {actual, expected} = await runToPem(2048, "spki")
      expect(actual).toEqual(expected)
    })
  })

  runs.forEach(i => {
    it(`creates jwk from 4096 key, spki - ${i}`, async () => {
      const {actual, expected} = await runToPem(2048, "spki")
      expect(actual).toEqual(expected)
    })
  })

  runs.forEach(i => {
    it(`creates jwk from 2048 key, pkcs1 - ${i}`, async () => {
      const {actual, expected} = await runToPem(2048, "pkcs1")
      expect(actual).toEqual(expected)
    })
  })

  runs.forEach(i => {
    it(`creates jwk from 4096 key, pkcs1 - ${i}`, async () => {
      const {actual, expected} = await runToPem(2048, "pkcs1")
      expect(actual).toEqual(expected)
    })
  })
})
