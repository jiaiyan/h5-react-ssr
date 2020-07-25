const resolvePath = (path) => require('path').resolve(__dirname, path)
const routes = require('./router')
module.exports = {
  type: 'ssr', // 指定运行类型可设置为csr切换为客户端渲染
  routes,
  baseDir: resolvePath('../'),
  injectCss: [
    { rel: 'stylesheet', href: `/static/css/Page.chunk.css` },
    { rel: 'manifest', href: `/manifest.json` }
  ], // 客户端需要加载的静态样式表
  injectScript: [
    { src: '/static/js/runtime~Page.js' },
    { src: '/static/js/vendor.chunk.js' },
    { src: '/static/js/Page.chunk.js' }
  ], // 客户端需要加载的静态资源文件表
  serverJs: resolvePath(`../dist/Page.server.js`),
  layout: resolvePath(`../dist/Layout.server.js`),
  useCDN: false
}
