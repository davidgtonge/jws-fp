/* eslint fp/no-this:0 */
/* eslint  no-magic-numbers:0 */
const asn = require("asn1.js")

const ECParameters = asn.define("ECParameters", function() {
  return this.choice({
    namedCurve: this.objid(),
  })
})

const AlgorithmIdentifier = asn.define("AlgorithmIdentifer", function() {
  return this.seq().obj(
    this.key("algorithm").objid(),
    this.key("parameters")
      .optional()
      .use(ECParameters)
  )
})

const PublicKeyInfo = asn.define("PublicKeyInfo", function() {
  return this.seq().obj(
    this.key("algorithm").use(AlgorithmIdentifier),
    this.key("PublicKey").bitstr()
  )
})

module.exports = PublicKeyInfo
