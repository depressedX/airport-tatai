module.exports = {
    devServer:{
        port:80,
        proxy: 'http://10.27.218.93:8080'
    },
    baseUrl:'/static'
}