module.exports = (lat, lng) => {
  return {
      x: (lng + 180) * (256 / 360),
      y: (256 / 2) - (256 * Math.log(Math.tan((Math.PI / 4) + ((lat * Math.PI / 180) / 2))) / (2 * Math.PI))
  }
}
