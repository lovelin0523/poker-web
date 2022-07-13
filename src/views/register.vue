<template>
    <div class="mvi-pt-12">
        <div class="mvi-text-center mvi-mb-4">
            <m-image width="2rem" height="2rem" fit="fill" src="/poker/logo.png"></m-image>
        </div>
        <h3 class="mvi-text-sub mvi-text-center mvi-mb-8">REGISTER FOR PLAY</h3>
        <m-input clearable border size="large" v-model.trim="form.user_nickname" placeholder="设置昵称，最多8个字符"></m-input>
        <m-input clearable border size="large" v-model.trim="form.user_name" placeholder="设置账号，4-16个字母、数字和下划线"></m-input>
        <m-input clearable size="large" border v-model.trim="form.user_password" type="password" placeholder="设置密码，不少于8位"></m-input>
        <m-input clearable size="large" v-model.trim="form.user_password2" type="password" placeholder="再次输入密码进行确认"></m-input>
        <div class="mvi-pt-8 mvi-px-2">
            <m-button @click="register" form-control size="large" type="info">注册</m-button>
        </div>
    </div>
</template>
<script>
export default {
    name: 'register',
    data() {
        return {
            form: {
                user_name: '',
                user_password: '',
                user_nickname: '',
                user_password2: ''
            }
        }
    },
    methods: {
        register() {
            setTimeout(() => {
                if (!this.form.user_nickname) {
                    this.$msgbox('请设置昵称')
                    return
                }
                if (!this.form.user_name) {
                    this.$msgbox('请设置账号')
                    return
                }
                if (!this.form.user_password) {
                    this.$msgbox('请设置密码')
                    return
                }
                if (this.form.user_nickname.length > 8) {
                    this.$msgbox('昵称最多8个字符')
                    return
                }
                if (
                    !this.$dap.common.matchingText(
                        this.form.user_name,
                        'userName'
                    )
                ) {
                    this.$msgbox('账号限制在4-16位，仅限字母数字或者下划线')
                    return
                }
                if (this.form.user_password.length < 8) {
                    this.$msgbox('密码不少于8个字符')
                    return
                }
                if (!this.form.user_password2) {
                    this.$msgbox('请再次确认密码')
                    return
                }
                if (this.form.user_password != this.form.user_password2) {
                    this.$msgbox('两次密码输入不一致')
                    return
                }
                delete this.form.user_password2
                this.$ruax
                    .create({
                        url: this.$api.register,
                        data: this.form,
                        beforeSend: () => {
                            this.$showToast({
                                type: 'loading',
                                message: '注册中...'
                            })
                        },
                        complete: () => {
                            this.$hideToast()
                        }
                    })
                    .then(res => {
                        if (res.state == 200) {
                            this.$showToast({
                                type: 'success',
                                message: '注册成功',
                                timeout: 1000,
                                callback: () => {
                                    this.$router.replace({
                                        path: '/login'
                                    })
                                }
                            })
                        } else if (res.state == 301) {
                            this.$msgbox(res.message)
                        }
                    })
            }, 200)
        }
    }
}
</script>
<style lang="less" scoped>
</style>