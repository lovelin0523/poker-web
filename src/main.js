import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './remFit'
import ruax from './ruax'
import api from './ruax/api'
import mvi from 'mvi-web'
Vue.use(mvi)
Vue.prototype.$api = api
Vue.prototype.$ruax = ruax
Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
