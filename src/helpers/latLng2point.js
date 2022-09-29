module.exports = (lat, lng, size = 256) => {
  return {
      x: (lng + 180) * (size / 360),
      y: (size / 2) - (size * Math.log(Math.tan((Math.PI / 4) + ((lat * Math.PI / 180) / 2))) / (2 * Math.PI))
  }
}
