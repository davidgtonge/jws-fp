/* eslint fp/no-unused-expression: 0 */

const {encode, decode} = require("./base64url")
const jwa = require("./jwa")
const {
  errors: {NO_ALGORITHM, ALGORITHM_MISMATCH},
  createError,
} = require("./errors")
const {seconds} = require("./time")
const verifyPayload = require("./verify-payload")
const verifySignature = jwa.verify

const DEFAULT_CLOCK_TOLERANCE = 0
const HEADER_POS = 0
const PAYLOAD_POS = 1
const SIGNATURE_POS = 2
const SEPERATOR = "."

const join = arr => arr.join(SEPERATOR)
const split = str => str.split(SEPERATOR)
const stringify = obj => encode(JSON.stringify(obj))
const parse = str => JSON.parse(decode(str))

const createPayload = (rawPayload, expiresIn, notBefore, issuer) => {
  const iat = seconds()
  return Object.assign({}, rawPayload, {
    exp: expiresIn && iat + expiresIn,
    iat,
    iss: issuer,
    nbf: notBefore && iat + notBefore,
  })
}

const sign = ({
  payload,
  alg,
  kid,
  secret,
  key,
  header,
  expiresIn,
  notBefore,
  issuer,
}) => {
  const jwtHeader = header || {alg, kid, typ: "JWT"}
  const jwtPayload = createPayload(payload, expiresIn, notBefore, issuer)
  const input = join([stringify(jwtHeader), stringify(jwtPayload)])
  const sig = jwa.sign({alg, input, secret, key})
  return join([input, sig])
}

const parseJWT = jwt => {
  const parts = split(jwt)
  return {
    header: parse(parts[HEADER_POS]),
    input: join([parts[HEADER_POS], parts[PAYLOAD_POS]]),
    payload: parse(parts[PAYLOAD_POS]),
    sig: parts[SIGNATURE_POS],
  }
}

const verifyAlgorithmsMatch = (expected, header) => {
  if (!expected) throw createError(NO_ALGORITHM, {expected})
  if (expected !== header.alg)
    throw createError(ALGORITHM_MISMATCH, {actual: header.alg, expected})
}

const verify = ({
  token,
  alg,
  secret,
  key,
  jwks,
  getByKid,
  simpleVerficiation = false,
  audience,
  subject,
  issuer,
  clockTolerance = DEFAULT_CLOCK_TOLERANCE,
}) => {
  const {header, payload, input, sig} = parseJWT(token)

  verifyAlgorithmsMatch(alg, header)

  const boundVerify = keyOrSecret => {
    verifySignature({alg, input, secret: keyOrSecret, sig})
    if (simpleVerficiation) {
      return payload
    }
    verifyPayload(payload, {audience, clockTolerance, issuer, subject})
    return payload
  }

  /*
  There are 6 ways in which the key can be supplied:
  1. As a string `secret`
  2. As a buffer `secret`
  3. As a string of a PEM encoded public key
  4. As a JSON Web Key
  5. As a JSON Web Keyset (which contains an array of JSON Web Keys)
  6. By passing a `getByKid` function which will be called with the `kid` value
     and must return a promise that resolves in the found key
  */

  if (getByKid) {
    return getByKid(header.kid).then(boundVerify)
  } else if (jwks) {
    const jwk = jwks.find(k => k.kid === header.kid)
    return boundVerify(jwk)
  }
  return boundVerify(secret || key)
}

module.exports = {sign, verify}
