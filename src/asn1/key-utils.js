/* eslint  no-magic-numbers:0 */
exports.sliceBuffer = (buffer, points) =>
  points.map((pos, idx) => buffer.slice(pos, points[idx + 1]))

exports.pemToDer = pem =>
  Buffer.from(
    pem
      .split("\n")
      .filter(line => line.indexOf("---") === -1)
      .join(""),
    "base64"
  )
