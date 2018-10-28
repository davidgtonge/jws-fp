const crypto = require("crypto")
const {toJose, fromJose} = require("./es-jose-sig")

const getLength = alg => alg.substr(2)

const sign = alg => (string, privateKey) =>
  toJose(
    crypto
      .createSign("SHA" + getLength(alg))
      .update(string)
      .sign(privateKey),
    alg
  )

const verify = alg => (string, sig, publicKey) =>
  crypto
    .createVerify("SHA" + getLength(alg))
    .update(string)
    .verify(publicKey, fromJose(sig, alg))

module.exports = {sign, verify}
