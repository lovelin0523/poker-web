import store from '../store'
import variables from '../assets/variables'
export default {
    msgbox(message, callback) {
        store.getters.appVue.$msgbox({
            message: message,
            callback: callback,
            animation: 'scale'
        })
    },
    alert(message, callback) {
        store.getters.appVue.$alert({
            title: '凯哥温馨提示',
            message: message,
            callback: callback,
            overlayColor: 'rgba(0, 0, 0, 0.6)',
            btnColor: variables.basic
        })
    },
    confirm(message, callback) {
        store.getters.appVue.$confirm({
            title: '凯哥温馨提示',
            message: message,
            callback: callback,
            overlayColor: 'rgba(0, 0, 0, 0.6)',
            btnColor: [variables.basic, variables.light]
        })
    },
    showLoading(message) {
        store.getters.appVue.$showToast({
            type: 'loading',
            message: message,
            background: 'rgba(0, 8, 9,.8)',
            color: '#c3e1e8',
            icon: {
                type: 'load-a',
                spin: true,
                color: '#5b757b'
            },
            overlayColor: 'rgba(0,0,0,.05)'
        })
    },
    showSuccess(message, callback) {
        store.getters.appVue.$showToast({
            type: 'success',
            message: message,
            timeout: 1000,
            callback: callback,
            background: 'rgba(0, 8, 9,.8)',
            color: '#c3e1e8',
            overlayColor: 'rgba(0,0,0,.05)'
        })
    },
    showError(message, callback) {
        store.getters.appVue.$showToast({
            type: 'error',
            message: message,
            timeout: 1000,
            callback: callback,
            background: 'rgba(0, 8, 9,.8)',
            color: '#c3e1e8',
            overlayColor: 'rgba(0,0,0,.05)',
            icon: 'error'
        })
    }
}
