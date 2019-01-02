/* eslint fp/no-this:0 */
/* eslint  no-magic-numbers:0 */
/* eslint  new-cap:0 */
const asn = require("asn1.js")
const {urlEncodeBuffer} = require("../base64url")
const {getSignatureSize} = require("./algs-and-curves")

const ECDSA = asn.define("ECDSA", function() {
  return this.seq().obj(this.key("r").int(), this.key("s").int())
})

// DER string to base64 string
const derToJose = (sig, alg) => {
  const size = getSignatureSize(alg)
  const {result} = ECDSA.decode(sig, "der", {partial: true})
  const r = result.r.toBuffer("be")
  const s = result.s.toBuffer("be")
  const rs = Buffer.concat([
    Buffer.alloc(size - r.length),
    r,
    Buffer.alloc(size - s.length),
    s,
  ])
  return urlEncodeBuffer(rs)
}

// base64 string to DER string
const joseToDer = sig => {
  const buf = Buffer.from(sig, "base64")
  const size = buf.length / 2
  return ECDSA.encode(
    {
      r: new asn.bignum(buf.slice(0, size)),
      s: new asn.bignum(buf.slice(size)),
    },
    "der"
  )
}

module.exports = {derToJose, joseToDer}
