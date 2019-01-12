const presets = [
  [
    "@babel/preset-env",
    {
      targets: {
        node: "current"
      }
    }
  ],
  "@babel/preset-react"
]
const plugins = [
  "@babel/plugin-syntax-dynamic-import",
  "@babel/proposal-object-rest-spread",
  "@babel/plugin-proposal-class-properties"
]

const env = {
  test: {
    presets: [
      ["@babel/preset-env", { targets: { node: "current" } }],
      ["@babel/preset-react"]
    ],
    plugins: [
      "babel-plugin-dynamic-import-node",
      "@babel/plugin-syntax-dynamic-import",
      "@babel/proposal-object-rest-spread",
      "@babel/plugin-proposal-class-properties"
    ]
  }
}

module.exports = { presets, plugins, env }
