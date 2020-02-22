module.exports = {
  css: {
    loaderOptions: {
      scss: {
        prependData: '@import "@/assets/styles/_variables.scss";'
      }
    }
  },

  transpileDependencies: ['vuetify'],
  productionSourceMap: false
}
