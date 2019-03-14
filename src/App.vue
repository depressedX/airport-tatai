<template>
    <el-container id="app">
        <el-aside width="123px">
            <the-aside/>
        </el-aside>
        <el-main class="main">
            <router-view/>
        </el-main>
    </el-container>
</template>

<script>
    import TheAside from './components/TheAside'


    export default {
        name: 'app',
        components: {
            TheAside
        },
        mounted() {
        },
    }
</script>

<style>
    #app {
        font-family: PingFang SC,  "Microsoft YaHei UI",Microsoft Yahei,  Tahoma, 华文细黑,"Microsoft JhengHei", sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        margin-top: 0px;

        height: 100%;
    }

    .main {
        background-color: rgb(238, 238, 238);
    }
</style>
