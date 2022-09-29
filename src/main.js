const fs = require('fs')
const path = require('path')
const convertPolyline = require('./helpers/decodePolyline')
const latLng2point = require('./helpers/latLng2point')
const fileName = require('./helpers/fileName')
const config = require('./config')
const { format } = require('path')

const index = path.resolve(process.cwd(), 'dist/index.html')
const directory = path.resolve(process.cwd(), 'polylines')

const svgs = fs.readdirSync(directory).filter(file => path.extname(file) == '.txt').map(file => {
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

const html = `<html>
<head>
  <style>
    * {
      margin: 0;
      padding: 0;
    }
    body {
      padding: 1rem;
      text-align: center;
      color: #666;
      background: ${config.background};
    }
    h1 {
      margin: 1rem 0 2rem;
      text-align: center;
      font-size: 2rem;
      font-family: sans-serif;
    }
    p {
      margin: 1rem 0;
    }
    h1 + p {
      margin-top: -1.5rem;
      font-size: 1.2rem;
    }
    a {
      color: ${config.stroke};
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      list-style: none;
      align-items: center;
      margin: -10px;
    }
    li {
      display: flex;
      margin: 10px;
      justify-content: center;
      width: calc((100% - (${config.columns} * 20px)) / ${config.columns});
      aspect-ratio: 1/1;
      background: #fff;
    }
    svg {
      display: block;
      height: 100%;
      margin: 0 5px 5px;
      padding: 10px;
    }
  </style>
</head>
<body>
    <h1>Polyline to SVG</h1>
    <p>Converting a collection of polyline encoded strings to SVG.</p>
    <ul>
      <li>${svgs.join('</li><li>')}</li>
    </ul>
    <p>
      A project by <a href="https://www.trovster.com/">Trevor Morris</a>.
      View on <a href="https://github.com/trovster/polyline-to-svg">GitHub</a>.
    </p>
</body>
</html>`

fs.writeFileSync(index, html)
