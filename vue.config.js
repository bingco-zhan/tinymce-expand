const path = require('path')
module.exports = {
    chainWebpack: config => {
        config.resolve.alias
            .set('@', path.join(__dirname, 'src'))
            .set('_', path.join(__dirname, 'src'))
            .set('public', path.join(__dirname, 'public'))
    }
}