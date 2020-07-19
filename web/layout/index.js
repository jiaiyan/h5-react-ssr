
import React from 'react'
import '@/assets/common.less'
import './index.less'
import serialize from 'serialize-javascript'


if (__isBrowser__) {
  require("lib-flexible")
}

// 为了同时兼容ssr/csr请保留此判断，如果你的layout没有内容请使用 props.children ? <div>{ props.children }</div> : ''
const commonNode = props => (props.children ? __isBrowser__ ? props.children : <div className='router-wrapper'>{props.children}</div> : null)

const Layout = (props) => {
  if (__isBrowser__) {
    return commonNode(props)
  } else {
    const { serverData } = props.layoutData
    const { injectCss, injectScript } = props.layoutData.app.config
    return (
      <html lang='en'>
        <head>
          <meta charSet='utf-8' />
          <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no,width=device-width" />
          <meta name='theme-color' content='#000000' />
          <title>React App</title>
          {
            injectCss && injectCss.map(item => <link rel='stylesheet' href={item} key={item} />)
          }
        </head>
        <body>
          <div id='app'>{commonNode(props)}</div>
          {
            serverData && <script dangerouslySetInnerHTML={{
              __html: `window.__USE_SSR__=true; window.__INITIAL_DATA__ =${serialize(serverData)}`
            }} />
          }
          <div dangerouslySetInnerHTML={{
            __html: injectScript && injectScript.join('')
          }} ></div>
        </body>
      </html>
    )
  }
}

export default Layout
