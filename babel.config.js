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

module.exports = { presets, plugins }
