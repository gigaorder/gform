module.exports = {
   chainWebpack: config => {
      config.merge({
         externals: ["vue", "lodash", "lodash-es", "vuetify"]
      });
   }
};