module.exports = {
    devServer: {
        proxy: 'http://localhost:8080',
        public: 'localhost:8080'  // 本地ip
    },
    chainWebpack: config => {
    config.module
        .rule('images')
        .use('url-loader')
        .loader('url-loader')
        .tap(options => Object.assign(options, { limit: 20000 }))
    }
}