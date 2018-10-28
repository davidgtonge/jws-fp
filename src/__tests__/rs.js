const fs = require("fs")
const path = require("path")
const crypto = require("crypto")
const rsa = require("../asymetric-rs")
const privateKey = fs
  .readFileSync(path.join(__dirname, "./keys/private-rs.pem"))
  .toString()
const publicKey = fs
  .readFileSync(path.join(__dirname, "./keys/public-rs.pem"))
  .toString()
const publicKey2 = fs
  .readFileSync(path.join(__dirname, "./keys/public2-rs.pem"))
  .toString()
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
      const actual = rsa(length, type).sign(input, privateKey)
      expect(rsa(length, type).verify(input, actual, publicKey)).toBe(true)
      expect(rsa(length, type).verify(input, actual, publicKey2)).toBe(false)
    })
  })
})
