// Decode a Polyline encoded string.
// @see https://github.com/valhalla/demos/blob/gh-pages/polyline/decode.js
module.exports = (encoded, mul = 1e5) => {
  // precision
  var inv = 1.0 / mul
  var decoded = []
  var previous = [0,0]
  var i = 0

  // for each byte
  while(i < encoded.length) {
    // for each coord (lat, lon)
    var ll = [0,0]

    for(var j = 0; j < 2; j++) {
      var shift = 0
      var byte = 0x20

      // keep decoding bytes until you have this coord
      while(byte >= 0x20) {
        byte = encoded.charCodeAt(i++) - 63
        ll[j] |= (byte & 0x1f) << shift
        shift += 5
      }

      // add previous offset to get final value and remember for next one
      ll[j] = previous[j] + (ll[j] & 1 ? ~(ll[j] >> 1) : (ll[j] >> 1))
      previous[j] = ll[j]
    }

    // scale by precision and chop off long coords also flip the positions so
    // its the far more standard lon,lat instead of lat,lon
    decoded.push([ll[1] * inv,ll[0] * inv])
  }

  // hand back the list of coordinates
  return decoded
}
