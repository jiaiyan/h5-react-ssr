const fs = require('fs')
const path = require('path')

console.log('创建路由中...')

// 获取路由文件地址
const getRouteFile = function (dir) {
    let res = []
    function traverse(dir) {
        fs.readdirSync(dir).forEach((file) => {
            const pathname = path.join(dir, file)
            if (fs.statSync(pathname).isDirectory()) {
                traverse(pathname)
            } else if (pathname.indexOf('route.json') > -1) {
                res.push(pathname)
            }
        })
    }
    traverse(dir)
    return res;
}

// 读取路由文件
const routes = []
getRouteFile(process.cwd() + '/web/page').forEach(s => {
    const data = JSON.parse(fs.readFileSync(s, 'utf-8'))
    data.forEach(r => {
        routes.push(r)
    })
})

// 写入路由文件
fs.writeFileSync(process.cwd() + `/config/router.js`, `const routes = []; ${JSON.stringify(routes)}.forEach(r => {r.Component = () => (require('@/page' + r.ComponentPath).default);routes.push(r)});module.exports = routes;`, 'utf8')

console.log('创建完成!')