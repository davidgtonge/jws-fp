const crypto = require("crypto")
const ec = require("../asymetric-es")

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

const specs = [
  "foobar",
  crypto.randomBytes(64).toString("base64"),
  crypto.randomBytes(64).toString("base64"),
  crypto.randomBytes(64).toString("base64"),
]
const sizes = [
  {alg: "ES256", size: 256, key1: createKey(), key2: createKey()},
  {alg: "ES384", size: 384, key1: createKey("P-384"), key2: createKey("P-384")},
  {alg: "ES512", size: 512, key1: createKey("P-521"), key2: createKey("P-521")},
]

sizes.forEach(({alg, size, key1, key2}) => {
  specs.forEach(input => {
    test(`ec: ${alg}: ${input}`, () => {
      const {sign, verify} = ec(size, alg)
      const actual = sign(input, key1.privateKey)
      expect(verify(input, actual, key1.publicKey)).toBe(true)
      expect(verify(input, actual, key2.publicKey)).toBe(false)
    })
  })
})
