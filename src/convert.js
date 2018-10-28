const { urlEncode } = require("./base64url")
const SEQUENCE_TAG = 0x30
const INTEGER_TAG = 0x02

const getSlice = (sig, offset, bytes) => {
  const pos = sig.indexOf(INTEGER_TAG, offset) + 1
  const length = sig[pos]
  const start = length === bytes + 1 ? pos + 2 : pos + 1
  const end = start + bytes
  const prefix = length < bytes ? Buffer.from([0]) : Buffer.from([])
  return [sig.slice(start, end), prefix, end]
}

module.exports = (sig, bytes) => {
  const [r, rPrefix, offset] = getSlice(sig, 0, bytes)
  const [s, sPrefix] = getSlice(sig, offset, bytes)
  return urlEncode(Buffer.concat([rPrefix, r, sPrefix, s]).toString("base64"))
}

const back = (sig, bytes) => {
  const r = sig.substr(0, bytes)
  const s = sig.substr(bytes, bytes)

  

  /*
  get r and s
  remove zero padding from front


  */
}