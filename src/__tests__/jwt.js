/* eslint max-nested-callbacks:0 */
const {sign, verify} = require("../jwt")
const crypto = require("crypto")

test("jwt hs", () => {
  const alg = "HS384"
  const secret = "secret"
  const payload = {foo: "bar"}
  const token = sign({alg, secret, payload})
  expect(
    verify({alg, secret, token, simpleVerficiation: true})
  ).toMatchObject(payload)
  expect(() => verify({alg, secret: "Not secret", token})).toThrow()
  expect(() => verify({alg: "none", secret, token})).toThrow()
})

describe("jwt hs  - buffer secret", () => {
  const alg = "HS384"
  const secret = crypto.randomBytes(64)
  const wrongSecret = crypto.randomBytes(64)
  const aud = "test:audiemce"
  const issuer = "https://test:issuer"
  const payload = {foo: "bar", aud}
  const token = sign({alg, secret, payload, issuer})

  describe("simple verification", () => {
    it("returns payload", () => {
      expect(
        verify({alg, secret, token, simpleVerficiation: true})
      ).toMatchObject(payload)
    })

    it("doesn't verify when given different secret", () => {
      expect(() =>
        verify({alg, secret: wrongSecret, token, simpleVerficiation: true})
      ).toThrow("INVALID_SIGNATURE")
    })

    it("throws when an invalid alg supplied", () => {
      expect(() =>
        verify({alg: "none", secret, token, simpleVerficiation: true})
      ).toThrow("ALGORITHM_MISMATCH")
    })

    it("throws when the wrong alg supplied", () => {
      expect(() =>
        verify({alg: "HS256", secret, token, simpleVerficiation: true})
      ).toThrow("ALGORITHM_MISMATCH")
    })

    it("throws when no alg supplied", () => {
      expect(() => verify({secret, token, simpleVerficiation: true})).toThrow(
        "NO_ALGORITHM"
      )
    })

    it("throws when no alg supplied", () => {
      expect(() => verify({secret, token, simpleVerficiation: true})).toThrow(
        "NO_ALGORITHM"
      )
    })
  })

  describe("full verification", () => {
    it("returns payload", () => {
      expect(
        verify({alg, secret, token, audience: aud, issuer})
      ).toMatchObject(payload)
    })

    it("doesn't verify when given different secret", () => {
      expect(() =>
        verify({alg, secret: wrongSecret, token, audience: aud, issuer})
      ).toThrow("INVALID_SIGNATURE")
    })

    it("throws when no audience supplied", () => {
      expect(() => verify({alg, secret, token})).toThrow("NO_AUDIENCE")
    })

    it("throws when no issuer supplied", () => {
      expect(() => verify({alg, secret, token, audience: aud})).toThrow(
        "NO_ISSUER"
      )
    })
  })
})

describe("optional jwt verficiation", () => {
  const alg = "HS384"
  const secret = crypto.randomBytes(64)
  const audience = "test:audiemce"
  const issuer = "https://test:issuer"
  const payload = {foo: "bar", aud: audience}

  it("throws when token has expired", () => {
    const token = sign({alg, secret, payload, issuer, expiresIn: -100})
    expect(() => verify({alg, secret, token, issuer, audience})).toThrow(
      "TOKEN_EXPIRED"
    )
  })

  it("throws when there is a subject mismatch", () => {
    const token = sign({
      alg,
      secret,
      payload: {foo: "bar", aud: audience, sub: "foo"},
      issuer,
    })
    expect(() =>
      verify({alg, secret, token, issuer, audience, subject: "bar"})
    ).toThrow("SUBJECT_MISMATCH")
  })

  it("throws when token isnt valid yet", () => {
    const token = sign({alg, secret, payload, issuer, notBefore: 100})
    expect(() => verify({alg, secret, token, issuer, audience})).toThrow(
      "NOT_VALID_YET"
    )
  })
})
