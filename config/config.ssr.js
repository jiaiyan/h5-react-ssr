const resolvePath = (path) => require('path').resolve(__dirname, path)

module.exports = {
  type: 'ssr', // 指定运行类型可设置为csr切换为客户端渲染
  routes: [
    {
      path: '/',
      exact: true,
      Component: () => (require('@/page/index').default), // 这里使用一个function包裹为了让它延迟require
      controller: 'page',
      handler: 'index',
      sceneConfig: {  // 添加动画配置
        // enter: 'from-bottom',
        // exit: 'to-bottom'
        enter: 'from-right',
        exit: 'to-right'
      }
    },
    {
      path: '/news/:id',
      exact: true,
      Component: () => (require('@/page/news').default),
      controller: 'page',
      handler: 'index',
      sceneConfig: {
        enter: 'from-right',
        exit: 'to-right'
      }
    }
  ],
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
