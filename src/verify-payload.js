/* eslint fp/no-unused-expression: 0 */
const {
  errors: {
    ISSUED_IN_THE_FUTURE,
    TOKEN_EXPIRED,
    NOT_VALID_YET,
    NO_AUDIENCE,
    AUDIENCE_MISMATCH,
    NO_ISSUER,
    ISSUER_MISMATCH,
    SUBJECT_MISMATCH,
  },
  createError,
} = require("./errors")
const {seconds} = require("./time")

const verifyIssuedTime = (iat, now, clockTolerance) => {
  if (iat && iat - clockTolerance > now) {
    throw createError(ISSUED_IN_THE_FUTURE, {iat, now})
  }
}

const verifyExpiry = (exp, now, clockTolerance) => {
  if (exp && exp + clockTolerance < now) {
    throw createError(TOKEN_EXPIRED, {exp, now})
  }
}

const verifyNotBefore = (nbf, now, clockTolerance) => {
  if (nbf && nbf - clockTolerance > now) {
    throw createError(NOT_VALID_YET, {nbf, now})
  }
}

const verifyAudience = (actual, expected) => {
  if (!expected) {
    throw createError(NO_AUDIENCE, {actual, expected})
  }
  if (actual !== expected) {
    throw createError(AUDIENCE_MISMATCH, {actual, expected})
  }
}

const verifyIssuer = (actual, expected) => {
  if (!expected) {
    throw createError(NO_ISSUER, {actual, expected})
  }
  if (actual !== expected) {
    throw createError(ISSUER_MISMATCH, {actual, expected})
  }
}

const verifySubject = (actual, expected) => {
  if (expected && actual !== expected) {
    throw createError(SUBJECT_MISMATCH, {actual, expected})
  }
}

module.exports = (payload, {audience, issuer, subject, clockTolerance}) => {
  const now = seconds()
  verifyIssuedTime(payload.iat, now, clockTolerance)
  verifyExpiry(payload.exp, now, clockTolerance)
  verifyNotBefore(payload.nbf, now, clockTolerance)
  verifyAudience(payload.aud, audience)
  verifyIssuer(payload.iss, issuer)
  verifySubject(payload.sub, subject)
  return true
}
