<template>
    <div class="app-main">
        <!-- 解散房间 -->
        <m-button v-if="room && userInfo.user_id == room.room_creator" @click="dissolution" class="app-switch" round size="small">
            <m-icon type="switch"></m-icon>
        </m-button>
        <!-- 开始游戏 -->
        <div v-if="currentGame==0 && room && room.room_creator==userInfo.user_id" class="app-room-start">
            <m-button @click="startGame" size="large" square class="mvi-text-bold" :color="$var.dark">开始游戏</m-button>
        </div>
        <!-- 房间信息 -->
        <div class="app-room-info">
            <div>房间号：{{roomId}}</div>
            <div v-if="room" class="mvi-mt-2">
                对局数：{{room.room_mode}}
            </div>
            <div class="mvi-mt-2">参与人数：{{users.length}}</div>
            <div class="mvi-mt-2" v-if="currentGame==0 && room && room.room_creator!=userInfo.user_id">等待房主开始游戏...</div>
            <div v-if="currentGame" class="mvi-mt-2">当前第{{currentGame}}局</div>
        </div>
        <!-- 自己 -->
        <div v-if="userInfo" class="app-first">
            <div class="app-pokers">
                <poker @click="selectPoker(item)" ref="unGroupPokers" v-for="(item,index) in unGroupPokers(userInfo.user_id)" :key="index" :value="item.value" :type="item.type" :style="pokerStyle(item)"></poker>
            </div>
            <div v-if="currentGame>0 && status[userInfo.user_id] == 1" class="app-prepare">
                <div v-for="(item,index) in [1,2,3]" :key="'group-'+index">
                    <div v-for="(emp,i) in [1,2,3]" :key="'group-'+index+'-'+i">
                        <poker v-if="singlePoker(index,i,userInfo.user_id)" :value="singlePoker(index,i,userInfo.user_id).value" :type="singlePoker(index,i,userInfo.user_id).type"></poker>
                    </div>
                </div>
            </div>
            <div class="app-nickname">
                <m-overlay local :show="currentGame>0 && !pokers[userInfo.user_id]">
                    <div class="app-wait">等待加入</div>
                </m-overlay>
                <div>{{userInfo.user_nickname}}<span v-if="$dap.number.isNumber(scores[userInfo.user_id])">({{scores[userInfo.user_id]}})</span></div>
            </div>
        </div>
        <!-- 第二个 -->
        <div v-if="otherUsers[0]" class="app-seconds">
            <div class="app-nickname">
                <m-overlay local :show="currentGame>0 && !pokers[otherUsers[0].user_id]">
                    <div class="app-wait">等待加入</div>
                </m-overlay>
                <div>{{otherUsers[0].user_nickname}}<span v-if="$dap.number.isNumber(scores[otherUsers[0].user_id])">({{scores[otherUsers[0].user_id]}})</span></div>
            </div>
            <div class="app-pokers">
                <poker cover v-for="(item,index) in unGroupPokers(otherUsers[0].user_id)" :key="index" :value="item.value" :type="item.type"></poker>
            </div>
            <div v-if="currentGame>0 && status[otherUsers[0].user_id] == 1" class="app-prepare">
                <div v-for="(item,index) in [1,2,3]" :key="'group-'+index">
                    <div v-for="(emp,i) in [1,2,3]" :key="'group-'+index+'-'+i">
                        <poker :cover="!compare" v-if="singlePoker(index,i,otherUsers[0].user_id)" :value="singlePoker(index,i,otherUsers[0].user_id).value" :type="singlePoker(index,i,otherUsers[0].user_id).type"></poker>
                    </div>
                </div>
            </div>
        </div>
        <!-- 第三个 -->
        <div v-if="otherUsers[1]" class="app-third" :style="{left:currentGame>0 ? (status[otherUsers[1].user_id] == 1?'-1.2rem':'-2.2rem'):''}">
            <div class="app-pokers">
                <poker cover v-for="(item,index) in unGroupPokers(otherUsers[1].user_id)" :key="index" :value="item.value" :type="item.type"></poker>
            </div>
            <div v-if="currentGame>0 && status[otherUsers[1].user_id] == 1" class="app-prepare">
                <div v-for="(item,index) in [1,2,3]" :key="'group-'+index">
                    <div v-for="(emp,i) in [1,2,3]" :key="'group-'+index+'-'+i">
                        <poker :cover="!compare" v-if="singlePoker(index,i,otherUsers[1].user_id)" :value="singlePoker(index,i,otherUsers[1].user_id).value" :type="singlePoker(index,i,otherUsers[1].user_id).type"></poker>
                    </div>
                </div>
            </div>
            <div class="app-nickname">
                <m-overlay local :show="currentGame>0 && !pokers[otherUsers[1].user_id]">
                    <div class="app-wait">等待加入</div>
                </m-overlay>
                <div>{{otherUsers[1].user_nickname}}<span v-if="$dap.number.isNumber(scores[otherUsers[1].user_id])">({{scores[otherUsers[1].user_id]}})</span></div>
            </div>
        </div>
        <!-- 第四个 -->
        <div v-if="otherUsers[2]" class="app-fouth" :style="{left:currentGame>0 ? (status[otherUsers[2].user_id] == 1?'-1.2rem':'-2.2rem'):''}">
            <div class="app-pokers">
                <poker cover v-for="(item,index) in unGroupPokers(otherUsers[2].user_id)" :key="index" :value="item.value" :type="item.type"></poker>
            </div>
            <div v-if="currentGame>0 && status[otherUsers[2].user_id] == 1" class="app-prepare">
                <div v-for="(item,index) in [1,2,3]" :key="'group-'+index">
                    <div v-for="(emp,i) in [1,2,3]" :key="'group-'+index+'-'+i">
                        <poker :cover="!compare" v-if="singlePoker(index,i,otherUsers[2].user_id)" :value="singlePoker(index,i,otherUsers[2].user_id).value" :type="singlePoker(index,i,otherUsers[2].user_id).type"></poker>
                    </div>
                </div>
            </div>
            <div class="app-nickname">
                <m-overlay local :show="currentGame>0 && !pokers[otherUsers[2].user_id]">
                    <div class="app-wait">等待加入</div>
                </m-overlay>
                <div>{{otherUsers[2].user_nickname}}<span v-if="$dap.number.isNumber(scores[otherUsers[2].user_id])">({{scores[otherUsers[2].user_id]}})</span></div>
            </div>
        </div>
        <!-- 操作界面 -->
        <div v-if="currentGame>0 && status[userInfo.user_id] == 0 && pokers[userInfo.user_id]" class="app-groups">
            <div v-for="(item,index) in [1,2,3]" :key="'group-'+index" class="app-group">
                <div @click="doInsert(index,i)" class="app-group-empty" v-for="(emp,i) in [1,2,3]" :key="'group-'+index+'-'+i">
                    <poker v-if="singlePoker(index,i,userInfo.user_id)" :value="singlePoker(index,i,userInfo.user_id).value" :type="singlePoker(index,i,userInfo.user_id).type"></poker>
                </div>
                <m-button @click="removeAll(index)" size="small" round color="#0f7c94">
                    <m-icon type="times"></m-icon>
                </m-button>
            </div>
            <m-button @click="doConfirmPokers" class="mvi-mt-4" color="#033b47" form-control>确认</m-button>
        </div>
        <!-- 比试结果界面 -->
        <m-modal animation="fade" width="5.4rem" overlay-color="transparent" modal-color="rgba(0,0,0,.5)" color="#fff" v-model="resultShow" :title="'第'+ (group+1) +'组'" title-class="mvi-text-center">
            <div v-for="(item,key,index) in tempScores" :key="index" class="app-result">
                <div>{{showUser(key)?.user_nickname}}</div>
                <div>{{item>0?'+':''}}{{item}}</div>
            </div>
        </m-modal>
        <!-- 本房间对局结束画面 -->
        <m-modal animation="fade" width="5.4rem" overlay-color="transparent" modal-color="rgba(0,0,0,.8)" color="#fff" title="最终战绩" title-class="mvi-text-center" v-model="endShow">
            <div v-for="(item,key,index) in scores" :key="index" class="app-result">
                <div>{{showUser(key)?.user_nickname}}</div>
                <div>{{item>0?'+':''}}{{item}}</div>
            </div>
            <div slot="footer" class="app-end-footer">
                <m-button color="rgba(23,81,108,0.8)" form-control @click="goBack">确认</m-button>
            </div>
        </m-modal>
    </div>
</template>

<script>
import poker from '@/components/poker.vue'
export default {
    name: 'room',
    data() {
        return {
            //socket对象
            webSocket: null,
            //连接数
            connections: 0,
            //心跳检测计时器
            timer: null,
            //socket地址
            wsUrl: process.env.VUE_APP_WS,
            //房间信息
            room: null,
            //玩家用户数组
            users: [],
            //手牌集合
            pokers: {},
            //状态集合，0表示配牌中，1表示已完成配牌
            status: {},
            //积分集合
            scores: {},
            //当前局数，0表示还没有开始
            currentGame: 0,
            //被选择的未分组纸牌
            selectedPoker: null,
            //是否开始比牌
            compare: false,
            //比试组数，0表示第一组，1表示第二组，2表示第三组
            group: 0,
            //每组暂记分数
            tempScores: {},
            //结果弹窗控制
            resultShow: false,
            //结束弹窗
            endShow: false
        }
    },
    components: {
        poker
    },
    computed: {
        //房间号
        roomId() {
            return this.$route.params.id
        },
        //用户信息
        userInfo() {
            return this.$store.getters.userInfo
        },
        //其他玩家
        otherUsers() {
            return this.users.filter(item => {
                return item.user_id != this.userInfo.user_id
            })
        },
        //没有配的牌
        unGroupPokers() {
            return user_id => {
                if (this.pokers[user_id]) {
                    return this.pokers[user_id].filter(item => {
                        return item.belong[0] == -1 && item.belong[1] == -1
                    })
                }
                return []
            }
        },
        //纸牌选择样式
        pokerStyle() {
            return item => {
                let style = {}
                if (
                    this.selectedPoker &&
                    item.type == this.selectedPoker.type &&
                    item.value == this.selectedPoker.value
                ) {
                    style.marginTop = '-0.6rem'
                }
                return style
            }
        },
        //三道显示的纸牌
        singlePoker() {
            return (x, y, user_id) => {
                if (this.pokers[user_id]) {
                    let arr = this.pokers[user_id].filter(item => {
                        return item.belong[0] == x && item.belong[1] == y
                    })
                    return arr[0]
                }
                return null
            }
        },
        //结果显示的用户
        showUser() {
            return user_id => {
                return this.users.filter(user => {
                    return user.user_id == user_id
                })[0]
            }
        }
    },
    mounted() {
        this.checkRoom()
    },
    methods: {
        //解散房间
        dissolution() {
            this.$confirm({
                title: '提示',
                message: '确定要解散该房间吗？',
                callback: r => {
                    if (r) {
                        this.send({
                            type: 8,
                            room: this.roomId,
                            user: this.userInfo,
                            content: '解散房间'
                        })
                    }
                }
            })
        },
        //游戏结束返回
        goBack() {
            this.$router.replace({
                path: '/'
            })
        },
        //结束
        sendOver() {
            this.$showToast({
                type: 'loading',
                message: '正在获取结果...'
            })
            //房主发送结束
            if (this.userInfo.user_id == this.room.room_creator) {
                this.send({
                    type: 7,
                    room: this.roomId,
                    user: this.userInfo,
                    content: '此房间已结束'
                })
            }
        },
        //进入下一局
        sendNextGame() {
            //已经是最后一局则结束
            if (this.currentGame == this.room.room_mode) {
                this.sendOver()
                return
            }
            this.$msgbox('即将进入下一局', () => {
                this.compare = false
                //房主发送
                if (this.userInfo.user_id == this.room.room_creator) {
                    this.currentGame += 1
                    this.send({
                        type: 6,
                        room: this.roomId,
                        user: this.userInfo,
                        content: '下一局'
                    })
                }
            })
        },
        //推送比试
        sendCompare(group) {
            console.log('推送笔试函数sendCompare执行')
            //房主发送比试推送
            if (this.userInfo.user_id == this.room.room_creator) {
                this.send({
                    type: 5,
                    room: this.roomId,
                    user: this.userInfo,
                    content: `比试第${group + 1}组`,
                    group: group
                })
            }
        },
        //配牌完成
        completePlat() {
            console.log('全部配牌完成函数completePlat')
            //展开所有的牌
            this.compare = true
            //发送比试推送
            this.sendCompare(0)
        },
        //将一道纸牌全部撤回
        removeAll(index) {
            for (let i = 0; i < 3; i++) {
                const poker = this.singlePoker(index, i, this.userInfo.user_id)
                if (poker) {
                    const order = this.getIndex(poker)
                    this.pokers[this.userInfo.user_id][order].belong = [-1, -1]
                }
            }
            this.selectedPoker = null
        },
        //确认配牌
        doConfirmPokers() {
            const flag = this.pokers[this.userInfo.user_id].some(item => {
                return item.belong[0] == -1
            })
            if (flag) {
                this.$msgbox('配牌还没有完成')
                return
            }
            this.send({
                type: 4,
                room: this.roomId,
                user: this.userInfo,
                content: '配牌完成',
                pokers: this.pokers
            })
        },
        //将纸牌放入或者拿出组中
        doInsert(index, i) {
            const poker = this.singlePoker(index, i, this.userInfo.user_id)
            //拿出
            if (poker) {
                const order = this.getIndex(poker)
                this.pokers[this.userInfo.user_id][order].belong = [-1, -1]
            }
            //放入
            else {
                if (!this.selectedPoker) {
                    return
                }
                const order = this.getIndex(this.selectedPoker)
                this.pokers[this.userInfo.user_id][order].belong = [index, i]
            }
            this.selectedPoker = null
        },
        //选择牌
        selectPoker(poker) {
            this.selectedPoker = poker
        },
        //开始游戏
        startGame() {
            if (this.users.length == 1) {
                this.$msgbox('只有你一个人不能开始游戏噢')
                return
            }
            this.send({
                type: 3,
                room: this.roomId,
                user: this.userInfo,
                content: '开始游戏'
            })
        },
        //校验房间
        checkRoom() {
            this.$ruax
                .create({
                    url: this.$api.checkRoom,
                    data: {
                        room_id: this.roomId
                    },
                    beforeSend: () => {
                        this.$showToast({
                            type: 'loading',
                            message: 'Loading...'
                        })
                    },
                    complete: () => {
                        this.$hideToast()
                    }
                })
                .then(res => {
                    if (res.state == 200) {
                        this.room = res.data
                        this.init()
                    } else if (res.state == 301) {
                        this.$msgbox(res.message, () => {
                            this.$router.replace({
                                path: '/'
                            })
                        })
                    }
                })
        },
        //初始化
        init() {
            this.$showToast({
                type: 'loading',
                message: '正在连接...'
            })
            if ('WebSocket' in window) {
                this.webSocket = new WebSocket(this.wsUrl)
                this.webSocket.onerror = this.onError
                this.webSocket.onopen = this.onOpen
                this.webSocket.onmessage = this.onMessage
                this.webSocket.onclose = this.onClose
                window.onbeforeunload = this.onBeforeUnload
            } else {
                this.$alert({
                    title: '无法连接到聊天室',
                    message:
                        '你当前使用的浏览器不支持webSocket，请更换现代浏览器！',
                    ios: true
                })
            }
        },
        //监听窗口关闭
        onBeforeUnload() {
            if (this.webSocket) {
                this.webSocket.close()
            }
        },
        //连接发生错误的回调方法
        onError(code) {
            console.log('WebSocket连接发生错误', code)
            this.$alert({
                title: '提示',
                ios: true,
                message: '连接发生错误，点击下方确认按钮，刷新页面重新进入',
                callback: () => {
                    location.reload(true)
                }
            })
        },
        //连接成功建立的回调方法
        onOpen() {
            console.log('webSocket连接成功')
            this.$hideToast()
            //向后台推送当前用户加入房间的消息
            this.send({
                type: 1,
                room: this.roomId,
                user: this.userInfo
            })
            //心跳检测
            if (this.timer) {
                clearInterval(this.timer)
                this.timer = null
            }
            this.timer = setInterval(() => {
                this.send({
                    type: 0,
                    room: this.roomId,
                    user: this.userInfo,
                    content: '心跳检测'
                })
            }, 30000)
        },
        //接收消息的回调方法
        onMessage(event) {
            //获取数据
            const data = JSON.parse(event.data)
            //异常处理
            if (data.type == -1) {
                this.$msgbox(data.content, () => {
                    if (data.data.needRefresh) {
                        if (this.webSocket) {
                            this.webSocket.close()
                        }
                        this.$router.replace({
                            path: '/'
                        })
                    }
                })
            }
            //心跳检测
            else if (data.type == 0) {
                console.log('心跳检测回执', data)
            }
            //加入房间
            else if (data.type == 1) {
                console.log('加入房间通知', data)
                this.users = data.data.users
                this.status = data.data.status || {}
                this.currentGame = data.data.currentGame || 0
                this.scores = data.data.scores || {}
                const pokers = data.data.pokers || {}
                //如果是我自己加入房间的通知
                if (data.data.isSelf) {
                    this.pokers = pokers
                } else {
                    this.pokers = this.updateOtherPokers(pokers)
                }
            }
            //离开房间
            else if (data.type == 2) {
                console.log('离开房间通知', data)
                this.users = data.data.users
                this.status = data.data.status || {}
                this.currentGame = data.data.currentGame || 0
                this.scores = data.data.scores || {}
                const pokers = data.data.pokers || {}
                this.pokers = this.updateOtherPokers(pokers)
            }
            //游戏开始
            else if (data.type == 3) {
                console.log('游戏开始', data)
                this.users = data.data.users
                this.pokers = data.data.pokers || {}
                this.status = data.data.status || {}
                this.currentGame = data.data.currentGame || 0
                this.scores = data.data.scores || {}
            }
            //配牌完成
            else if (data.type == 4) {
                console.log('配牌完成', data)
                this.users = data.data.users
                this.status = data.data.status || {}
                this.currentGame = data.data.currentGame || 0
                this.scores = data.data.scores || {}
                const pokers = data.data.pokers || {}
                //如果是自己配牌完成了
                if (data.data.isSelf) {
                    this.pokers = pokers
                } else {
                    this.pokers = this.updateOtherPokers(pokers)
                }
                //如果全部配牌完成
                if (data.data.hasAllComplete) {
                    this.$msgbox('所有人都已经配好，即将进行比牌', () => {
                        this.completePlat()
                    })
                }
            }
            //比试
            else if (data.type == 5) {
                console.log('比试完成', data)
                this.users = data.data.users
                this.pokers = data.data.pokers || {}
                this.status = data.data.status || {}
                this.currentGame = data.data.currentGame || 0
                this.scores = data.data.scores || {}
                this.group = data.data.group || 0
                this.tempScores = data.data.tempScores || {}
                this.resultShow = true
                setTimeout(() => {
                    //已经是最后一组，则进入下一局
                    if (this.group == 2) {
                        this.resultShow = false
                        this.sendNextGame()
                    } else {
                        const group = this.group + 1
                        this.sendCompare(group)
                    }
                }, 3000)
            }
            //下一局
            else if (data.type == 6) {
                console.log('下一局开始', data)
                this.users = data.data.users
                this.pokers = data.data.pokers || {}
                this.status = data.data.status || {}
                this.currentGame = data.data.currentGame || 0
                this.scores = data.data.scores || {}
            }
            //结束
            else if (data.type == 7) {
                this.$hideToast()
                console.log('本房间游戏结束', data)
                this.users = data.data.users
                this.scores = data.data.scores || {}
                this.endShow = true
            }
            //解散
            else if (data.type == 8) {
                console.log('房间解散', data)
                this.users = data.data.users
                this.$alert({
                    ios: true,
                    title: '提示',
                    message: '房间已解散',
                    callback: () => {
                        this.$router.replace({
                            path: '/'
                        })
                    }
                })
            }
        },
        //连接关闭的回调方法
        onClose() {
            this.$hideToast()
            if (this.timer) {
                clearInterval(this.timer)
                this.timer = null
            }
            this.webSocket = null
        },
        //推送消息
        send(data) {
            if (!this.webSocket) {
                return
            }
            if (this.$dap.common.isObject(data)) {
                this.webSocket.send(JSON.stringify(data))
            }
        },
        //纸牌在数组中的位置
        getIndex(poker) {
            if (this.pokers[this.userInfo.user_id]) {
                return this.pokers[this.userInfo.user_id].findIndex(item => {
                    return item.value == poker.value && item.type == poker.type
                })
            }
            return -1
        },
        //更新其他人的pokers
        updateOtherPokers(pokers) {
            //我的pokers
            const myPokers = this.pokers[this.userInfo.user_id]
            let newPokers = {}
            newPokers[this.userInfo.user_id] = myPokers
            //更新其他人的pokers
            this.otherUsers.forEach(user => {
                newPokers[user.user_id] = pokers[user.user_id]
            })
            return newPokers
        }
    }
}
</script>

<style lang="less" scoped>
.app-main {
    position: relative;
    height: 100%;

    .app-room-start {
        position: absolute;
        z-index: 20;
        left: 50%;
        top: 50%;
        margin-top: -3rem;
        transform: translateX(-50%);
    }

    .app-room-info {
        position: absolute;
        z-index: 1;
        left: 50%;
        top: 50%;
        font-size: 0.48rem;
        color: #fff;
        transform: translate(-50%, -50%);
        opacity: 0.2;
        width: 6rem;
        text-align: center;
    }

    .app-switch {
        position: fixed;
        right: 0.1rem;
        top: 0.1rem;
        z-index: 300;
        opacity: 0.4;
    }
}
.app-first {
    display: block;
    position: absolute;
    bottom: 0.2rem;
    left: 50%;
    transform: translateX(-50%);
    padding: 0.2rem;
    z-index: 10;

    .app-pokers {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 6rem;
        margin-bottom: 0.3rem;
        margin-left: 0.3rem;

        .app-poker {
            margin-left: -0.3rem;
        }
    }

    .app-nickname {
        display: block;
        text-align: center;
        font-weight: bold;
        font-size: 0.32rem;
        color: #fff;
        width: 3rem;
        margin: 0 auto;
        position: relative;
        overflow: hidden;
    }
}
.app-seconds {
    display: block;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    padding: 0.2rem;
    z-index: 10;

    .app-pokers {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 6rem;
        margin-top: 0.3rem;
        margin-left: 0.3rem;

        .app-poker {
            margin-left: -0.3rem;
        }
    }

    .app-nickname {
        display: block;
        text-align: center;
        font-weight: bold;
        font-size: 0.32rem;
        color: #fff;
        width: 3rem;
        margin: 0 auto;
        position: relative;
        overflow: hidden;
    }
}
.app-third {
    display: block;
    position: absolute;
    top: 50%;
    left: -2.8rem;
    transform: translateY(-50%) rotate(90deg);
    padding: 0.2rem;
    z-index: 10;

    .app-pokers {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 6rem;
        margin-bottom: 0.3rem;
        margin-left: 0.3rem;

        .app-poker {
            margin-left: -0.3rem;
        }
    }

    .app-nickname {
        display: block;
        text-align: center;
        font-weight: bold;
        font-size: 0.32rem;
        color: #fff;
        width: 3rem;
        margin: 0 auto;
        position: relative;
        overflow: hidden;
    }
}
.app-fouth {
    display: block;
    position: absolute;
    top: 50%;
    right: -2.8rem;
    transform: translateY(-50%) rotate(-90deg);
    padding: 0.2rem;
    z-index: 10;

    .app-pokers {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 6rem;
        margin-bottom: 0.3rem;
        margin-left: 0.3rem;

        .app-poker {
            margin-left: -0.3rem;
        }
    }

    .app-nickname {
        display: block;
        text-align: center;
        font-weight: bold;
        font-size: 0.32rem;
        color: #fff;
        width: 3rem;
        background-color: #a51212;
        padding: 0.1rem 0.2rem;
        border-radius: 0.12rem;
        margin: 0 auto;
        position: relative;
        overflow: hidden;
    }
}
.app-wait {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    overflow: 0.1;
    font-weight: normal;
    font-size: 0.28rem;
    color: #ddd;
}
.app-groups {
    display: block;
    width: 5.2rem;
    background-color: #4b8c9b;
    border-radius: 0.12rem;
    padding: 0.2rem;
    box-shadow: 0.02rem 0.02rem rgba(0, 0, 0, 0.2);
    position: fixed;
    left: 50%;
    top: 50%;
    z-index: 300;
    transform: translate(-50%, -50%);

    .app-group {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        margin-bottom: 0.1rem;

        &:last-child {
            margin-bottom: 0;
        }

        .app-group-empty {
            display: block;
            width: 0.96rem;
            height: 1.18rem;
            background-color: #0f7c94;
            border-radius: 0.12rem;
            position: relative;

            .app-poker {
                position: absolute;
                left: 0;
                top: 0;
            }
        }
    }
}
.app-prepare {
    display: block;
    width: 4rem;
    margin: 0 auto 0.3rem auto;

    & > div {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: -0.4rem;

        &:last-child {
            margin-bottom: 0;
        }
    }
}
.app-result {
    display: block;
    width: 100%;
    margin-bottom: 0.2rem;
    padding: 0 0.6rem;

    &:last-child {
        margin-bottom: 0;
    }

    & > div:first-child {
        display: inline-block;
        width: 50%;
        text-align: left;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        vertical-align: middle;
    }

    & > div:last-child {
        display: inline-block;
        padding-left: 0.4rem;
        width: 50%;
        text-align: right;
    }
}

.app-end-footer {
    display: block;
    width: 100%;
}
</style>