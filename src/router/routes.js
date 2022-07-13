export default [
    {
        path: '/',
        name: 'index',
        component: () =>
            import(/* webpackChunkName:"index" */ '../views/index'),
        meta: {
            title: '大厅 - 扑克牌比鸡游戏',
            auth: true
        }
    },
    {
        path: '/login',
        name: 'login',
        component: () =>
            import(/* webpackChunkName:"login" */ '../views/login'),
        meta: {
            title: '登录 - 扑克牌比鸡游戏'
        }
    },
    {
        path: '/register',
        name: 'register',
        component: () =>
            import(/* webpackChunkName:"register" */ '../views/register'),
        meta: {
            title: '注册 - 扑克牌比鸡游戏'
        }
    },
    {
        path: '/room/:id',
        name: 'room',
        component: () => import(/* webpackChunkName:"room" */ '../views/room'),
        meta: {
            title: '扑克牌比鸡游戏',
            auth: true
        }
    }
]
