import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        userInfo: null,
        appVue: null,
        token: null
    },
    getters: {
        userInfo(state) {
            if (state.userInfo) {
                return state.userInfo
            }
            let userInfo = localStorage.getItem('poker-userInfo')
            try {
                userInfo = JSON.parse(userInfo) || {}
            } catch (e) {
                userInfo = {}
            }
            return userInfo
        },
        token(state) {
            if (state.token) {
                return state.token
            }
            let token = localStorage.getItem('poker-token')
            return token || ''
        },
        appVue(state) {
            return state.appVue
        }
    },
    mutations: {
        token(state, value) {
            if (value) {
                state.token = value
                localStorage.setItem('poker-token', value)
            } else {
                state.token = null
                localStorage.removeItem('poker-token')
            }
        },
        userInfo(state, value) {
            if (value) {
                state.userInfo = value
                localStorage.setItem('poker-userInfo', JSON.stringify(value))
            } else {
                state.admin = null
                localStorage.removeItem('poker-userInfo')
            }
        },
        appVue(state, value) {
            state.appVue = value
        }
    }
})
