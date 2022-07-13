import Ruax from 'ruax'
import store from '../store'
import router from '../router'

let ruax = new Ruax()

//设置请求基本路径
ruax.defaults.baseUrl =
    process.env.NODE_ENV == 'production'
        ? 'https://www.mvi-web.cn/poker_api'
        : 'http://192.168.1.3:3040/api'
//设置请求方式
ruax.defaults.type = 'POST'
//设置超时时间30s
ruax.defaults.timeout = 30000
//请求发送给前统一处理数据
ruax.defaults.beforeRequest = config => {
    //请求头中设置token
    config.headers['authorization'] = store.getters.token
}

//请求响应拦截，统一处理需要登录的请求自动跳转登录页面
ruax.defaults.beforeResponse = (xhr, result) => {
    if (result) {
        if (result.state == 401) {
            if (router.currentRoute.name == 'login') {
                return
            }
            router.replace({
                path: '/login',
                query: {
                    redirect: encodeURIComponent(router.currentRoute.fullPath)
                }
            })
        }
    }
}

export default ruax
