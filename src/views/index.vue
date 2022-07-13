<template>
    <div class="mvi-pt-10 mvi-px-4 app-main">
        <m-panel title="我的信息" class="mvi-mb-4">
            <m-cell :active="false" title="昵称">
                <div @click="modify('user_nickname')" slot="content">
                    {{userInfo.user_nickname}}
                    <m-icon type="edit"></m-icon>
                </div>
            </m-cell>
            <m-cell :active="false" title="账号">
                <div @click="modify('user_name')" slot="content">
                    {{userInfo.user_name}}
                    <m-icon type="edit"></m-icon>
                </div>
            </m-cell>
            <m-cell :active="false" title="密码">
                <div @click="modify('user_password')" slot="content">
                    *******
                    <m-icon type="edit"></m-icon>
                </div>
            </m-cell>
            <m-cell :active="false" title="注册时间" :content="format(userInfo.user_register)"></m-cell>
            <m-cell :active="false" title="上次登录" :content="format(userInfo.user_login)"></m-cell>
        </m-panel>
        <m-button class="mvi-mb-4" size="large" type="success" @click="roomShow=true" form-control>创建房间</m-button>
        <m-button size="large" type="info" form-control @click="joinRoom">加入房间</m-button>

        <!-- 修改信息弹窗 -->
        <m-modal show-times modal-color="#f7f8fa" :title="modifyInfo.title" v-model="modifyInfo.show">
            <m-input class="mvi-mb-4" v-model.trim="form.user_nickname" v-if="modifyInfo.param == 'user_nickname'" placeholder="请输入新的昵称" clearable></m-input>
            <m-input class="mvi-mb-4" v-model.trim="form.user_name" v-if="modifyInfo.param == 'user_name'" placeholder="请设置新账号" clearable></m-input>
            <m-input class="mvi-mb-4" v-model.trim="form.user_password" v-if="modifyInfo.param == 'user_password'" type="password" placeholder="请设置新密码" clearable></m-input>
            <m-input class="mvi-mb-4" v-model.trim="form.user_password2" v-if="modifyInfo.param == 'user_password'" type="password" placeholder="请再次确认密码" clearable></m-input>
            <m-button form-control type="info" @click="confirmModify">确定</m-button>
        </m-modal>
        <!-- 创建房间弹窗 -->
        <m-modal show-times modal-color="#f7f8fa" title="创建房间" v-model="roomShow">
            <m-form class="mvi-mb-4" label-block block>
                <m-form-el label="对局数：">
                    <div class="mvi-flex-between">
                        <m-radio :label="item+'局'" v-for="(item,index) in modeArray" :key="'mode-'+index" v-model="roomInfo.mode" :value="item"></m-radio>
                    </div>
                </m-form-el>
            </m-form>
            <m-button @click="createRoom" form-control type="primary">确认创建</m-button>
        </m-modal>
        <!-- 加入房间弹窗 -->
        <m-modal show-times modal-color="#f7f8fa" title="加入房间" v-model="attendShow">
            <m-input @click="keyboard=true" :value="attendRoomId" readonly placeholder="点我输入房间号"></m-input>
        </m-modal>
        <!-- 房间号软键盘 -->
        <m-number-keyboard overlay-color="transparent" closable calibration :z-index="1000" :show-decimal="false" v-model="attendRoomId" :show.sync="keyboard" @complete="checkRoom"></m-number-keyboard>
    </div>
</template>
<script>
export default {
    name: 'index',
    data() {
        return {
            modifyInfo: {
                show: false,
                title: '',
                param: ''
            },
            form: {
                user_nickname: '',
                user_name: '',
                user_password: '',
                user_password2: ''
            },
            modeArray: [8, 12, 16, 20],
            playsArray: [2, 3, 4],
            roomShow: false,
            attendShow: false,
            attendRoomId: '',
            roomInfo: {
                mode: 12
            },
            keyboard: false
        }
    },
    computed: {
        userInfo() {
            return this.$store.getters.userInfo
        },
        format() {
            return val => {
                const date = new Date(val)
                return date.toLocaleDateString()
            }
        }
    },
    methods: {
        //加入房间
        joinRoom() {
            this.attendShow = true
        },
        //校验房间号
        checkRoom() {
            this.keyboard = false
            this.attendShow = false
            if (!this.attendRoomId) {
                this.$msgbox('房间号不能为空')
                return
            }
            this.$ruax
                .create({
                    url: this.$api.checkRoom,
                    data: {
                        room_id: this.attendRoomId
                    },
                    beforeSend: () => {
                        this.$showToast({
                            type: 'loading',
                            message: '正在加入...'
                        })
                    },
                    complete: () => {
                        this.$hideToast()
                        this.attendRoomId = ''
                    }
                })
                .then(res => {
                    if (res.state == 200) {
                        this.$router.replace({
                            name: 'room',
                            params: {
                                id: res.data.room_id
                            }
                        })
                    } else if (res.state == 301) {
                        this.$msgbox(res.message)
                    }
                })
        },
        //创建房间
        createRoom() {
            this.$ruax
                .create({
                    url: this.$api.createRoom,
                    data: {
                        room_mode: this.roomInfo.mode
                    },
                    beforeSend: () => {
                        this.$showToast({
                            type: 'loading',
                            message: '正在创建...'
                        })
                    },
                    complete: () => {
                        this.$hideToast()
                    }
                })
                .then(res => {
                    if (res.state == 200) {
                        this.$router.replace({
                            name: 'room',
                            params: {
                                id: res.data.room_id
                            }
                        })
                    } else if (res.state == 301) {
                        this.$msgbox(res.message)
                    }
                })
        },
        //确认修改信息
        confirmModify() {
            let params = {
                user_id: this.userInfo.user_id
            }
            if (this.modifyInfo.param == 'user_nickname') {
                if (!this.form.user_nickname) {
                    this.$msgbox('请设置新的昵称')
                    return
                }
                if (this.form.user_nickname.length > 8) {
                    this.$msgbox('昵称最多8个字符')
                    return
                }
                params.user_nickname = this.form.user_nickname
            } else if (this.modifyInfo.param == 'user_name') {
                if (!this.form.user_name) {
                    this.$msgbox('请设置新的账号')
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
                params.user_name = this.form.user_name
            } else if (this.modifyInfo.param == 'user_password') {
                if (!this.form.user_password) {
                    this.$msgbox('请设置新密码')
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
                params.user_password = this.form.user_password
            }
            this.$ruax
                .create({
                    url: this.$api.modifyUserInfo,
                    data: params,
                    beforeSend: () => {
                        this.$showToast({
                            type: 'loading',
                            message: '正在修改...'
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
                            message: '修改成功',
                            timeout: 1000
                        })
                        this.modifyInfo.show = false
                        this.$store.commit('userInfo', res.data)
                    } else if (res.state == 301) {
                        this.$msgbox(res.message)
                    }
                })
        },
        //修改信息
        modify(param) {
            this.modifyInfo.param = param
            switch (param) {
                case 'user_nickname':
                    this.modifyInfo.title = '修改昵称'
                    this.form.user_nickname = this.userInfo.user_nickname
                    break
                case 'user_name':
                    this.modifyInfo.title = '修改账号'
                    this.form.user_name = this.userInfo.user_name
                    break
                case 'user_password':
                    this.modifyInfo.title = '修改密码'
            }
            this.modifyInfo.show = true
        }
    }
}
</script>
<style lang="less" scoped>
.app-main {
    min-height: 100%;
}
/deep/ .mvi-number-keyboard-left {
    width: calc(100% - 2.1rem);
}
</style>