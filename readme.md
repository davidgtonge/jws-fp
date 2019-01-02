# Simple JOSE

_ALPHA Project - don't use in production yet_

The JOSE suite of standards: JWA, JWK, JWS & JWT are gaining widespread adoption. There are quite a few JavaScript libraries that implement the specs so why write another one?

This library has these aims:

- Minimal dependencies (Node.JS only)
- Strict adherence to standards
- Useful error messages with links
- Minimal functional coding style
- Simple to use API with access to each layer

### Minimal Dependencies

The heavy lifting of signing and verifying payloads is provided by the standard Node.JS crypto module. It is therefore possible to provide a lightweight, standards compliant library that uses very few dependencies.

Initially I wanted to create this module with zero dependencies, however I've had to include [asn1.js](https://github.com/indutny/asn1.js/) from Fedor Indutny to handle conversions.

Given that creating and verifying signatures is a critical, high value, part of any secure system I thinnk it is worth considering how to reduce dependencies in this area and therefore reduce the risk of an attacker compromising a system by gaining access to an open source NPM module.

### Strict adherence to standards

This is to ensure interoperability and to ensure that users of the library benefit from using code tested against the robust peer-reviewed standards.

This library enforces the best current practices outlined in https://tools.ietf.org/html/draft-ietf-oauth-jwt-bcp-00

### Minimal functional coding style

While not a hard rule, there is evidence that lines of code correlates with number of bugs. I don't advocate brevity for the sake of it, but I do believe that simple composable pure functions are easier to read, easier to test and reduce the surface area for bugs.

## API

#### `jwt.sign(opts)`

Creates a spec-compliant JWT.

```js
const {jwt} = require("simple-jose")
const symetricToken = jwt.sign({
  payload: {foo: "bar"},
  alg: "HS256",
  secret: "my cryptographically random secret",
})
const asymetricToken = jwt.sign({
  payload: {foo: "bar"},
  alg: "PS256",
  kid: "key id",
  key: fs.readFileSync("./my-private-key"),
})
```

Accepts the following options:

- `payload`: (REQUIRED) - the payload to be signed as a JS object
- `alg`: (REQUIRED) - The alg to use, eg. HS256, RS256
- `secret`: (REQUIRED for HS algorithms) - The secret to use, can be a string or buffer
- `key`: (REQUIRED for RS, PS & ES algorithms) - the private key, can be a string or buffer of a PEM encoded private key OR a JWK
- `kid`: (OPTIONAL) - the key id, often a hash of the public key
- `expiresIn`: (OPTIONAL) - the time in seconds after which the token should expire
- `notBefore`: (OPTIONAL) - the time in seconds before which the token should not be valid
- `header`: (OPTIONAL) - the header as an object, this allows implementers to override the default headers. NB if using this property implementers should ensure that they pass the correct `alg` and `typ` values.

#### `jwt.verify(opts)`

Verifies a JWT.

```js
const {jwt} = require("simple-jose")
const verifiedTokenPayload = jwt.verify({
  token: "ey....",
  alg: "HS256",
  secret: "my cryptographically random secret",
})
const verifiedTokenPayload = jwt.verify({
  token: "ey....",
  alg: "PS256",
  key: fs.readFileSync("./public-key"),
})
```

Accepts the following options:

- `token`: (REQUIRED) - the token to verify
- `alg`: (REQUIRED) - The alg to use to verify, eg. HS256, RS256
- `secret`: (REQUIRED for HS algorithms) - The secret to use to verify, can be a string or buffer
- `key`: (REQUIRED for RS, PS & ES algorithms) - the public key to use to verify, can be a string or buffer of a PEM encoded public key OR a JWK
- `keys`: (OPTIONAL for RS, PS & ES algorithms) - an array of JWKs can be provided instead of a single key. The libary will select the correct key using the key id in the JWT
- `jwsOnly`: (OPTINAL) - if true the library will only verify the signature and ignore all other checks. This allows implementers to perform their own validation of the token payload properties.
- `aud`: (OPTIONAL) - the audience value to verify
- `iss`: (OPTIONAL) - the issuer value to verify
- `sub`: (OPTIONAL) - the subject value to verify

### Early Binding

This is possible and often recommended as well:

```js
const JWT = require("simple-jwt")

const verifyFactory = ({iss, aud, alg, keys}) => token =>
  JWT.verify({iss, aud, alg, keys, token})
```

### Integration to a JWKS endpoint

```js
const jwksCache = require("jwks-cache")

const jwks = jwksCache({
  url: "https://foo.com/.well-known/jwks",
})

const key = await jwks.get("some-kid")
```

Todo:

- tests
- add support for interop tests
- get list of test vectors
- add support for private key conversion
- add support for compressed keys
