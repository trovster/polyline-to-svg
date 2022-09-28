const fs = require('fs')
const path = require('path')
const convertPolyline = require('./helpers/decodePolyline')
const latLng2point = require('./helpers/latLng2point')
const fileName = require('./helpers/fileName')

const index = path.resolve(process.cwd(), 'dist/index.html')
const directory = path.resolve(process.cwd(), 'polylines')

const svgs = fs.readdirSync(directory, {
  encoding: 'utf8',
  flag: 'r',
}).map(file => {
  let minX = 256,
      minY = 256,
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
    const point = latLng2point(lat, lng)

    minX = Math.min(minX, point.x)
    minY = Math.min(minY, point.y)
    maxX = Math.max(maxX, point.x)
    maxY = Math.max(maxY, point.y)

    svgPath.push([point.x, point.y].join(','))
  }

  const width = (maxX - minX)
  const height = (maxY - minY) * 1.05
  const x = minX * 0.999995
  const y = minY * 0.999995
  const viewBox = `${x} ${y} ${width} ${height}`
  const strokeWidth = Math.max(width, height) * 0.005

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" height="400" width="400" viewport="0 0 400 400" viewBox="${viewBox}">
    <g>
      <path d="${`M${svgPath.join(' ')}`}" stroke="blue" stroke-width="${strokeWidth}" fill="none" />
    </g>
  </svg>`

  fs.writeFileSync(output, svg)

  return svg;
})

const html = `<html>
<head>
  <style>
    * {
      margin: 0;
      padding: 0;
    }
    body {
      display: flex;
      flex-wrap: wrap;
    }
    img, svg {
      margin: 0;
      padding: 0;
      background: #eee;
    }
  </style>
</head>
<body>
    ${svgs.join('\r\n')}
</body>
</html>`

fs.writeFileSync(index, html)
