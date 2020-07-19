import React from 'react'
import { connect } from 'dva'
import { Link } from 'react-router-dom'
import { List } from 'antd-mobile';
import './index.less'

function Page(props) {
  return (
    <List>
      {
        props.news && props.news.map((item, i) => (
          <List.Item key={i}>
            <div>文章标题: {item.title}</div>
            <Link to={`/news/${item.id}`}>点击查看详情</Link>
          </List.Item>
        ))
      }
    </List>
  )
}

Page.getInitialProps = async ({ store }) => {
  await store.dispatch({ type: 'page/getData' })
}

const mapStateToProps = (state) => ({
  news: state.page.news
})

export default connect(mapStateToProps)(Page)
