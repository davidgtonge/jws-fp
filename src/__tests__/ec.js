const fs = require("fs")
const path = require("path")
const crypto = require("crypto")
const rsa = require("../asymetric-es")
const privateKey = fs
  .readFileSync(path.join(__dirname, "./keys/private-ec.pem"))
  .toString()
const publicKey = fs
  .readFileSync(path.join(__dirname, "./keys/public-ec.pem"))
  .toString()
const publicKey2 = fs
  .readFileSync(path.join(__dirname, "./keys/public2-ec.pem"))
  .toString()
const specs = ["foobar"]

const sizes = ["ES256"]

sizes.forEach(length => {
  specs.forEach(input => {
    test(`ec: ${input}`, () => {
      const actual = rsa.sign(length)(input, privateKey)
      expect(rsa.verify(length)(input, actual, publicKey)).toBe(true)
      expect(rsa.verify(length)(input, actual, publicKey2)).toBe(false)
    })
  })
})
