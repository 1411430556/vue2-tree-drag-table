const { codeInspectorPlugin } = require('code-inspector-plugin')

module.exports = {
  lintOnSave: false,
  devServer: {
    open: true,
  },
  chainWebpack: config => {
    config.plugin('code-inspector-plugin').use(
      codeInspectorPlugin({
        bundler: 'webpack',
      }),
    )
  },
}
