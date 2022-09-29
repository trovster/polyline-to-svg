module.exports = (config, svgs) => `<html>
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
    svg path {
      stroke-dashoffset: 2.2486135065555573px;
      stroke-dasharray: 2.2486135065555573px;
      transition: stroke-dashoffset ${config.speed} cubic-bezier(0.47, 0, 0.745, 0.715) 0;
    }
    svg.active path {
      stroke-dashoffset: 0;
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
    <script>
      window.setTimeout(() => {
        document.querySelectorAll('svg').forEach(element => element.classList.add('active'))
      }, 30)
    </script>
</body>
</html>`
