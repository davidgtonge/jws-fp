const sig =
  "DtEhU3ljbEg8L38VWAfUAqOyKAM6-Xx-F4GawxaepmXFCgfTjDxw5djxLa8ISlSApmWQxfKTUJqPP3-Kg6NU1Q"
const der = [
  48,
  69,
  2,
  32,
  14,
  209,
  33,
  83,
  121,
  99,
  108,
  72,
  60,
  47,
  127,
  21,
  88,
  7,
  212,
  2,
  163,
  178,
  40,
  3,
  58,
  249,
  124,
  126,
  23,
  129,
  154,
  195,
  22,
  158,
  166,
  101,
  2,
  33,
  0,
  197,
  10,
  7,
  211,
  140,
  60,
  112,
  229,
  216,
  241,
  45,
  175,
  8,
  74,
  84,
  128,
  166,
  101,
  144,
  197,
  242,
  147,
  80,
  154,
  143,
  63,
  127,
  138,
  131,
  163,
  84,
  213,
]

const es512Sig =
  "AdwMgeerwtHoh-l192l60hp9wAHZFVJbLfD_UxMi70cwnZOYaRI1bKPWROc-mZZqwqT2SI-KGDKB34XO0aw_7XdtAG8GaSwFKdCAPZgoXD2YBJZCPEX3xKpRwcdOO8KpEHwJjyqOgzDO7iKvU8vcnwNrmxYbSW9ERBXukOXolLzeO_Jn"
const es512Der =
  "308187024201dc0c81e7abc2d1e887e975f7697ad21a7dc001d915525b2df0ff531322ef47309d93986912356ca3d644e73e99966ac2a4f6488f8a183281df85ced1ac3fed776d02416f06692c0529d0803d98285c3d980496423c45f7c4aa51c1c74e3bc2a9107c098f2a8e8330ceee22af53cbdc9f036b9b161b496f444415ee90e5e894bcde3bf267"
const format = require("ecdsa-sig-formatter")
console.log(format.joseToDer(es512Sig, "ES512").toString("hex"))

const convert = require("../convert")

test("ec-jose-sig", () => {
  const actual = convert(Buffer.from(der), 32)
  expect(actual).toEqual(sig)
})

test("ec-jose-sig-512", () => {
  const actual = convert(Buffer.from(es512Der, "hex"), 66)
  expect(actual).toEqual(es512Sig)
})
