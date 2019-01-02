/* eslint fp/no-this:0 */
/* eslint  no-magic-numbers:0 */
const asn = require("asn1.js")

const Version = asn.define("Version", function() {
  return this.int({
    0: "two-prime",
    1: "multi",
  })
})

const AlgorithmIdentifier = asn.define("AlgorithmIdentifer", function() {
  return this.seq().obj(
    this.key("algorithm").objid(),
    this.key("parameters")
      .optional()
      .any()
  )
})

const PrivateKeyInfo = asn.define("PrivateKeyInfo", function() {
  return this.seq().obj(
    this.key("version").use(Version),
    this.key("algorithm").use(AlgorithmIdentifier),
    this.key("privateKey").octstr()
  )
})

module.exports = PrivateKeyInfo
