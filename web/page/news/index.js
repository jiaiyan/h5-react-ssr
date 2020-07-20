import React from 'react'
import { connect } from 'dva'
import { Card, NavBar, Icon } from 'antd-mobile';
import './index.less'

function News(props) {
  const { history, detail } = props
  return (<div>
    <NavBar
      mode="light"
      icon={<Icon type="left" />}
      onLeftClick={() => history.goBack()}
    >文章详情</NavBar>
    <Card full>
      <Card.Header
        title="Jiaiyan"
        thumb="https://gw.alipayobjects.com/zos/rmsportal/MRhHctKOineMbKAZslML.jpg"
      />
      <Card.Body>
        <p className="detail">{detail}</p>
      </Card.Body>
      <Card.Footer content="阅读量：10000" extra={<div>分享</div>} />
    </Card>
  </div>)
}

News.getInitialProps = async (ctx) => {
  const newsId = __isBrowser__ ? ctx.match.params.id : ctx.params.id
  await ctx.store.dispatch({ type: 'news/getData', payload: { id: newsId } })
}

const mapStateToProps = (state) => ({
  detail: state.news.detail
})

export default connect(mapStateToProps)(News)
