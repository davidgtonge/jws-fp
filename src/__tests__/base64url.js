const base64url = require("../base64url")

const specs = {
  "Node.js is awesome.": "Tm9kZS5qcyBpcyBhd2Vzb21lLg",
  foobar: "Zm9vYmFy",
  "{\"foo\":\"bar\"}....": "eyJmb28iOiJiYXIifS4uLi4",
}

Object.keys(specs).forEach(input => {
  test(`base64url: ${input}`, () => {
    const actual = base64url.encode(input)
    expect(actual).toBe(specs[input])
    expect(base64url.decode(actual)).toBe(input)
  })
})
