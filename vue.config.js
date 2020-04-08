let sav = "";
for (let e in process.env) {
	if (/VUE_APP_/i.test(e)) {
		sav += `$${e}: "${process.env[e]}";`;
	}
}

module.exports = {
  css: {
    loaderOptions: {
      scss: {
        prependData: `${sav} @import "@/assets/scss/_variables.scss";`
      }
    }
  },

  transpileDependencies: ['vuetify'],
  productionSourceMap: false
}
