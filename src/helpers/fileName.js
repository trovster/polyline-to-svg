module.exports = str => {
  return str.substr(0, str.lastIndexOf('.')) + '.svg'
}
