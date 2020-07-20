const defaultMeatsTitle = {
    // header meat标签
    meats: [{
        name: 'description',
        content: '这是一个首页'
    }, {
        name: 'keywords',
        content: 'react,ssr'
    }],
    // 页面标题
    title: 'React-SSR'
}

export default {
    namespace: 'system',
    state: { ...defaultMeatsTitle },
    reducers: {
        save(state, action) {
            return { ...state, ...action.payload }
        }
    },
    subscriptions: {
        setup({ history, dispatch }) {
            // 监听 history 变化
            return history.listen(() => {
                dispatch({ type: 'save', payload: defaultMeatsTitle })
            })
        }
    }
}