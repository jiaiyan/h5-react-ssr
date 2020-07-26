import React from 'react'
import ReactDOM from 'react-dom'
import dva from 'dva'
import { BrowserRouter, StaticRouter, Switch, withRouter } from 'react-router-dom'
import FancyRoute from '@/components/tools/FancyRoute'
import { getWrappedComponent, getComponent } from 'ykfe-utils'
import { createMemoryHistory, createBrowserHistory } from 'history'
import NProgress from 'nprogress';
import { routes as Routes } from '../config/config.ssr'
import defaultLayout from '@/layout'
import models from './models'

const { CSSTransition, TransitionGroup } = require('react-transition-group');

const initDva = (options) => {
  const app = dva(options)
  models.forEach(m => app.model(m))
  app.router(() => { })
  app.start()
  return app
}

const DEFAULT_SCENE_CONFIG = {
  enter: 'from-right',
  exit: 'to-exit'
};

const getSceneConfig = location => {
  const matchedRoute = Routes.find(config => {
    const cp = config.path.split('/');
    const lp = location.pathname.split('/');
    if (cp.length === lp.length) {
      for (let i = 0; i < cp.length; i++) {
        if (cp[i] !== lp[i] && cp[i].indexOf(':') !== 0) {
          return false
        }
      }
      return true
    }
  });
  return (matchedRoute && matchedRoute.sceneConfig) || DEFAULT_SCENE_CONFIG;
};

let oldLocation = null;
const Routess = withRouter(({ location, history, store }) => {
  // 转场动画应该都是采用当前页面的sceneConfig，所以：
  // push操作时，用新location匹配的路由sceneConfig
  // pop操作时，用旧location匹配的路由sceneConfig
  let classNames = '';
  if (history.action === 'PUSH') {
    classNames = 'forward-' + getSceneConfig(location).enter;
  } else if (history.action === 'POP' && oldLocation) {
    classNames = 'back-' + getSceneConfig(oldLocation).exit;
  }
  // 更新旧location
  oldLocation = location;
  return (
    <TransitionGroup
      className={'router-wrapper'}
      childFactory={child => React.cloneElement(child, { classNames })}
    >
      <CSSTransition
        timeout={500} key={location.pathname}>
        <Switch location={location} >
          {Routes.map(({ path, exact, Component }) => {
            const ActiveComponent = Component()
            const Layout = ActiveComponent.Layout || defaultLayout
            const WrappedComponent = getWrappedComponent(ActiveComponent)
            return <FancyRoute exact={exact} key={path} path={path} render={() => <Layout><WrappedComponent store={store} /></Layout>} />
          })}
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  );
});

const clientRender = () => {
  const initialState = window.__INITIAL_DATA__ || {}
  const history = createBrowserHistory()
  const app = initDva({
    initialState,
    history: history
  })
  const store = app._store

  app.router(() => (
    <BrowserRouter>
      <Routess store={store} />
    </BrowserRouter >
  ))
  const DvaApp = app.start()

  ReactDOM[window.__USE_SSR__ ? 'hydrate' : 'render'](<DvaApp />, document.getElementById('app'))

  if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept()
  }
}

const serverRender = async ctx => {
  const app = initDva({
    history: createMemoryHistory({
      initialEntries: [ctx.req.url]
    })
  })
  const store = app._store
  ctx.store = store
  const ActiveComponent = getComponent(Routes, ctx.path)()
  const Layout = ActiveComponent.Layout || defaultLayout
  ActiveComponent.getInitialProps ? await ActiveComponent.getInitialProps(ctx) : {} // eslint-disable-line
  const storeState = store.getState()
  ctx.serverData = storeState

  app.router(() => (
    <StaticRouter location={ctx.req.url} context={storeState}>
      <Layout layoutData={ctx}>
        <ActiveComponent {...storeState} />
      </Layout>
    </StaticRouter>
  ))

  const DvaApp = app.start()
  return <DvaApp />
}

export default __isBrowser__ ? clientRender() : serverRender
