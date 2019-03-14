module.exports = {
    devServer:{
        port:80,
        proxy: 'http://localhost:8080'
    },
    baseUrl:'/static'
}