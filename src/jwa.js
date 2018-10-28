/* eslint no-magic-numbers: 0 */
const rs = require("./asymetric-rs")
const hs = require("./symetric")
const {
  errors: {INVALID_ALGORITHM, INVALID_SIGNATURE},
  createError,
} = require("./errors")

const algs = {
  HS256: hs(256),
  HS384: hs(384),
  HS512: hs(512),
  PS256: rs(256, "PS"),
  PS384: rs(384, "PS"),
  PS512: rs(512, "PS"),
  RS256: rs(256, "RS"),
  RS384: rs(384, "RS"),
  RS512: rs(512, "RS"),
}

const sign = ({alg, input, secret}) => {
  const signer = algs[alg]
  if (!signer) throw createError(INVALID_ALGORITHM, {alg})
  return signer.sign(input, secret)
}

const verify = ({alg, input, sig, secret}) => {
  const verifier = algs[alg]
  if (!verifier) throw createError(INVALID_ALGORITHM, {alg})
  if (!verifier.verify(input, sig, secret))
    throw createError(INVALID_SIGNATURE, {alg, sig})
}

module.exports = {sign, verify}
