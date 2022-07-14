export default [
    {
        path: '/',
        name: 'index',
        component: () =>
            import(/* webpackChunkName:"index" */ '../views/index'),
        meta: {
            title: '主页 - 大家来比鸡',
            auth: true
        }
    },
    {
        path: '/login',
        name: 'login',
        component: () =>
            import(/* webpackChunkName:"login" */ '../views/login'),
        meta: {
            title: '登录 - 大家来比鸡'
        }
    },
    {
        path: '/register',
        name: 'register',
        component: () =>
            import(/* webpackChunkName:"register" */ '../views/register'),
        meta: {
            title: '注册 - 大家来比鸡'
        }
    },
    {
        path: '/room/:id',
        name: 'room',
        component: () => import(/* webpackChunkName:"room" */ '../views/room'),
        meta: {
            title: '大家来比鸡',
            auth: true
        }
    }
]
