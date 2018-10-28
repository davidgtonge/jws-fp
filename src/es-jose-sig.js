const { urlEncode } = require("./base64url")
const format = require("ecdsa-sig-formatter")
const INTEGER_TAG = 0x02

const toJose = (sig, alg) => {
  // console.log(sig)
  //console.log(sig.length)

  const rPos = sig.indexOf(INTEGER_TAG)
  const rLength = sig[rPos + 1]
  const rOffset = sig[rPos + 2] ? 2 : 3
  const r = sig.slice(rPos + rOffset, rPos + rOffset + Math.min(rLength, 32))
  //console.log(r[0], r[31])

  const sPos = sig.indexOf(INTEGER_TAG, rPos + rOffset + rLength)
  const sLength = sig[sPos + 1]
  const sOffset = sig[sPos + 2] ? 2 : 3
  const s = sig.slice(sPos + sOffset, sPos + sOffset + Math.min(sLength, 32))
  //console.log(s[0], s[31])

  const output = urlEncode(Buffer.concat([r, s]).toString("base64"))
  const dummy = format.derToJose(sig, alg)
  return dummy
  // if (dummy !== output) {
  //   console.log(output)
  //   console.log(dummy)
  //   throw new Error("no match")
  // }
  // return output
}

module.exports = { toJose, fromJose: format.joseToDer }


const memo = {
  rs: Buffer.alloc(64),
}

const reducer = (memo, octet, idx) => {
  
}