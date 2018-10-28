const hs = require("../symetric")
const crypto = require("crypto")
const specs = [
  "foobar",
  crypto.randomBytes(64).toString("base64"),
  crypto.randomBytes(64).toString("base64"),
  crypto.randomBytes(64).toString("base64"),
]

const sizes = [256, 384, 512]

const secretStr = "secret"
const wrongeSecretStr = "wrong-secret"

sizes.forEach(length => {
  specs.forEach(input => {
    test(`hs: ${input} with str secret`, () => {
      const actual = hs(length).sign(input, secretStr)
      expect(hs(length).verify(input, actual, secretStr)).toBe(true)
      expect(hs(length).verify(input, actual, wrongeSecretStr)).toBe(false)
    })
  })
})

const secretBuffer = crypto.randomBytes(64)
const wrongeSecretBuffer = crypto.randomBytes(64)

sizes.forEach(length => {
  specs.forEach(input => {
    test(`hs: ${input} with buffer secret`, () => {
      const actual = hs(length).sign(input, secretBuffer)
      expect(hs(length).verify(input, actual, secretBuffer)).toBe(true)
      expect(hs(length).verify(input, actual, wrongeSecretBuffer)).toBe(false)
    })
  })
})
