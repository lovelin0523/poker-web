<template>
    <div class="mvi-pt-20">
        <div class="mvi-text-center mvi-mb-4">
            <m-image width="2rem" height="2rem" fit="fill" src="/poker/logo.png"></m-image>
        </div>
        <h3 class="mvi-text-sub mvi-text-center mvi-mb-8">LOGIN FOR PLAY</h3>
        <m-input clearable border size="large" v-model.trim="form.user_name" placeholder="输入账号"></m-input>
        <m-input clearable size="large" v-model.trim="form.user_password" type="password" placeholder="输入密码"></m-input>
        <div class="mvi-pt-8 mvi-px-2">
            <m-button @click="login" form-control size="large" type="info">登录</m-button>
        </div>
        <div @click="goRegister" class="mvi-text-center mvi-mt-10 mvi-text-link mvi-font-h6">
            <span class="mvi-mr-1">注册新账号</span>
            <m-icon type="angle-double-right"></m-icon>
        </div>
    </div>
</template>
<script>
export default {
    name: 'login',
    data() {
        return {
            form: {
                user_name: '',
                user_password: ''
            }
        }
    },
    methods: {
        login() {
            setTimeout(() => {
                if (!this.form.user_name) {
                    this.$msgbox('请输入账号')
                    return
                }
                if (!this.form.user_password) {
                    this.$msgbox('请输入密码')
                    return
                }
                this.$ruax
                    .create({
                        url: this.$api.login,
                        data: this.form,
                        beforeSend: () => {
                            this.$showToast({
                                type: 'loading',
                                message: '正在登录...'
                            })
                        },
                        complete: () => {
                            this.$hideToast()
                        }
                    })
                    .then(res => {
                        if (res.state == 200) {
                            const token = res.data.token
                            const userInfo = res.data.user
                            this.$store.commit('userInfo', userInfo)
                            this.$store.commit('token', token)
                            this.$router.replace({
                                path: '/'
                            })
                        } else if (res.state == 301) {
                            this.$msgbox(res.message)
                        }
                    })
            }, 200)
        },
        //跳转注册
        goRegister() {
            this.$router.replace({
                path: '/register'
            })
        }
    }
}
</script>
<style lang="less" scoped>
</style>