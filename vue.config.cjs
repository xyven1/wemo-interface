const GoogleFontsPlugin = require('@beyonk/google-fonts-webpack-plugin')

module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  configureWebpack: {
    plugins: [
      new GoogleFontsPlugin({
        fonts: [
          {family: "Raleway"}
        ]
      })
    ]
  }
}
