module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'https://www.baidu.com/', //对应自己的接口
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}