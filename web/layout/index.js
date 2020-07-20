
import React from 'react'
import '@/assets/common.less'
import './index.less'
import serialize from 'serialize-javascript'
import { connect } from 'dva'
import { Helmet } from 'react-helmet'

if (__isBrowser__) {
  require("lib-flexible")
}

// 为了同时兼容ssr/csr请保留此判断，如果你的layout没有内容请使用 props.children ? <div>{ props.children }</div> : ''
const commonNode = props => {
  const { title, meats } = props
  return props.children ? __isBrowser__ ? (
    <div className='normal'>
      <Helmet>
        <title>{title}</title>
        {meats.map(({ name, content }, i) => <meta key={i} name={name} content={content} />)}
      </Helmet>
      <div className='content'>{props.children}</div>
    </div>
  ) : (
      <div className='router-wrapper'>
        <div className='normal'>
          <div className='content'>{props.children}</div>
        </div>
      </div>
    ) : null
}

const Layout = (props) => {
  if (__isBrowser__) {
    return commonNode(props)
  } else {
    const { serverData } = props.layoutData
    const { injectCss, injectScript } = props.layoutData.app.config
    const { title, meats } = props
    return (
      <html lang='en'>
        <head>
          <meta charSet='utf-8' />
          <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no,width=device-width" />
          <meta name='theme-color' content='#000000' />
          <title>{title}</title>
          {meats.map(({ name, content }, i) => <meta key={i} name={name} content={content} data-react-helmet="true" />)}
          {injectCss && injectCss.map(({ rel, href }, i) => <link rel={rel} href={href} key={i} />)}
        </head>
        <body>
          <div id='app'>{commonNode(props)}</div>
          {
            serverData && <script dangerouslySetInnerHTML={{
              __html: `window.__USE_SSR__=true; 
              window.__INITIAL_DATA__ =${serialize(serverData)};
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/service-worker.js').then(registration => {
                    console.log('SW registered: ', registration);
                   }).catch(registrationError => {
                    console.error('SW registration failed: ', registrationError);
                  });
                });
               }`
            }} />
          }
          {injectScript && injectScript.map(({ src }, i) => <script key={i} src={src}></script>)}
          <script async defer dangerouslySetInnerHTML={{
            __html: `document.getElementById('app').classList.add('show');`
          }} />
        </body>
      </html>
    )
  }
}

const mapStateToProps = (state) => ({
  title: state.system.title,
  meats: state.system.meats
})

export default connect(mapStateToProps)(Layout)
