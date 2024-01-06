const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    proxy: {
      '/': {
        target: 'http://testpp.92nu.com',
        ws: true,
        changOlrigin: true,   
      }
    },
    webSocketServer:false,
    port: '7878'
  },
  assetsDir: "clothes_admin",
})

// const path = require('path');
// function resolve (dir) {
//   return path.join(__dirname, dir)
// }
// module.exports = {  
//   devServer: {
//     proxy: {
//       '/': {
//         target: 'http://testpp.92nu.com',
//         ws: true,
//         changOlrigin: true,   
//       }
//     },
//     port: '7777'
//   },
//   lintOnSave: false,
//   chainWebpack: (config)=>{
//     config.resolve.alias
//     .set('vendor',resolve('./src/vendor'))
//   },
//   configureWebpack: {
//     devtool: process.env.NODE_ENV === 'development' ? 'cheap-module-eval-source-map' : 'cheap-module-source-map',
//   }
// }
