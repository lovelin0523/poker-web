<template>
    <div id="app">
        <router-view />
    </div>
</template>
<script>
export default {
    name: 'app',
    created() {
        this.$store.commit('appVue', this)
    }
}
</script>
<style lang="less">
#app {
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: @basic;
    color: #fff;
}
</style>
