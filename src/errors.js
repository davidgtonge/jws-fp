const SYSTEM_ERROR = "SYSTEM_ERROR"
const AUTH_ERROR = "AUTH_ERROR"

// eslint-disable-next-line fp/no-nil, no-magic-numbers
const prettyPrint = payload => JSON.stringify(payload, null, 4)

const createError = ({msg, links, type, code}, params) => {
  const err = new Error(`${code}
  ${msg}
  
  Parameters supplied: ${JSON.stringify(params)}

  Relevant Links: ${prettyPrint(links)}
  `)
  err.JWT_ERROR_TYPE = type // eslint-disable-line fp/no-mutation
  err.JWT_ERROR_CODE = code // eslint-disable-line fp/no-mutation
  return err
}

const errors = {
  ALGORITHM_MISMATCH: {
    links: [
      "https://tools.ietf.org/html/draft-ietf-oauth-jwt-bcp-00#section-3.1",
      "https://tools.ietf.org/html/rfc7515#section-4.1.1",
    ],
    msg: "The algorithm in the JWT is different from the one expected",
    type: AUTH_ERROR,
  },
  AUDIENCE_MISMATCH: {
    links: [],
    msg: "The audience in the JWT is different from the one expected",
    type: AUTH_ERROR,
  },
  ISSUER_MISMATCH: {
    links: [],
    msg: "The issuer in the JWT is different from the one expected",
    type: AUTH_ERROR,
  },
  SUBJECT_MISMATCH: {
    links: [],
    msg: "The subject in the JWT is different from the one expected",
    type: AUTH_ERROR,
  },
  INVALID_ALGORITHM: {
    links: [],
    msg: "The supplied algorithm is not supported",
    type: SYSTEM_ERROR,
  },
  INVALID_SIGNATURE: {
    links: [],
    msg: "The signature could not be verified with the supplied key or secret",
    type: AUTH_ERROR,
  },
  NO_ALGORITHM: {
    links: [
      "https://tools.ietf.org/html/draft-ietf-oauth-jwt-bcp-00#section-3.1",
      "https://tools.ietf.org/html/rfc7515#section-4.1.1",
    ],
    msg: "An algorithm must be supplied to the verify method",
    type: SYSTEM_ERROR,
  },
  NO_AUDIENCE: {
    links: [],
    msg: "An audience value must be supplied to the verify method",
    type: SYSTEM_ERROR,
  },
  NO_ISSUER: {
    links: [],
    msg: "An issuer value must be supplied to the verify method",
    type: SYSTEM_ERROR,
  },
  ISSUED_IN_THE_FUTURE: {
    links: [],
    msg: `The iat (issued at) claim in the token is greater than 
    the current time. This could be because of clock skew, in 
    which case you can pass a clockTolerance value in to the 
    verify function`,
    type: AUTH_ERROR,
  },
  TOKEN_EXPIRED: {
    links: [],
    msg: "The token has expired and should not be accepted for processing",
    type: AUTH_ERROR,
  },
  NOT_VALID_YET: {
    links: [],
    msg: `The nbf (not before) claim in the token is greater 
    than the current time and therefore the token is not valid
    for use`,
    type: AUTH_ERROR,
  },
}

// eslint-disable-next-line fp/no-mutation
Object.keys(errors).forEach(code => (errors[code].code = code))

module.exports = {createError, errors}
