const fs = require('fs')
const path = require('path')
const convertPolyline = require('./helpers/decodePolyline')
const latLng2point = require('./helpers/latLng2point')
const fileName = require('./helpers/fileName')
const config = require('./config')
const html = require('./html')

const index = path.resolve(process.cwd(), 'dist/index.html')
const directory = path.resolve(process.cwd(), 'polylines')

const svgs = fs.readdirSync(directory).filter(file => path.extname(file) == '.txt').map(file => {
  let minX = config.size,
      minY = config.size,
      maxX = 0,
      maxY = 0

  const polyline = fs.readFileSync(path.resolve(directory, file), {
    encoding: 'utf8',
    flag: 'r',
  })

  const output = path.resolve(process.cwd(), `dist/${fileName(file)}`)
  const coordinates = convertPolyline(polyline)

  const svgPath = []

  for (var c = 0; c < coordinates.length; ++c) {
    const [lng, lat] = coordinates[c]
    const point = latLng2point(lat, lng, config.size)

    minX = Math.min(minX, point.x)
    minY = Math.min(minY, point.y)
    maxX = Math.max(maxX, point.x)
    maxY = Math.max(maxY, point.y)

    svgPath.push([point.x, point.y].join(','))
  }

  const width = (maxX - minX) * 1.05
  const height = (maxY - minY) * 1.05
  const x = minX
  const y = minY
  const viewBox = `${x} ${y} ${width} ${height}`
  const strokeWidth = Math.max(width, height) * 0.005 * config.strokeWidth

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="${viewBox}">
    <g>
      <path d="${`M${svgPath.join(' ')}`}" stroke="${config.stroke}" stroke-width="${strokeWidth}" fill="none" />
    </g>
  </svg>`

  fs.writeFileSync(output, svg)

  return svg;
})

fs.writeFileSync(index, html(config, svgs))
