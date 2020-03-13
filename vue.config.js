module.exports = {
    devServer: {
        proxy: 'http://localhost:8080',
        public: 'localhost:8080'  // 本地ip
    }
}