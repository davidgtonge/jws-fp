const crypto = require("crypto")
const rsa = require("../asymetric-rs")

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

const key1 = createKey(2048)
const key2 = createKey(2048)

const specs = [
  "foobar",
  crypto.randomBytes(64).toString("base64"),
  crypto.randomBytes(64).toString("base64"),
  crypto.randomBytes(64).toString("base64"),
]

const algs = ["RS256", "RS384", "RS512", "PS256", "PS384", "PS512"]

algs.forEach(alg => {
  specs.forEach(input => {
    test(`rsa: ${alg} ${input}`, () => {
      const type = alg.substr(0, 2)
      const length = +alg.substr(2)
      const actual = rsa(length, type).sign(input, key1.privateKey)
      expect(rsa(length, type).verify(input, actual, key1.publicKey)).toBe(true)
      expect(rsa(length, type).verify(input, actual, key2.publicKey)).toBe(
        false
      )
    })
  })
})
