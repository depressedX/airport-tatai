<template>
    <div class="the-aside">
        <h1>山东空管流量预测系统</h1>
        <p class="time">{{time}}</p>
        <p class="username">你好，{{username}}</p>
        <p class="role">身份：{{role}}</p>
        <div class="button-group">
            <router-link to="/prediction" style="display: inline-block;margin-bottom: .5em">
                <el-button type="primary"  style="width: 100%">进近流量预测</el-button>
            </router-link>
            <router-link to="/statistics" style="display: inline-block;margin-bottom: 1em">
                <el-button type="primary"  style="width: 100%">进近流量统计</el-button>
            </router-link>
            <a href="/logout" style="display: inline-block">
                <el-button type="danger"  style="width: 100%">退出登录</el-button>
            </a>
        </div>
    </div>
</template>

<script>
    import store from '../store/store'
    import {Formatter} from "../util";

    const state = store.state

    export default {
        name: "the-aside",
        computed: {
            time() {
                return Formatter.formatDate(state.JNowTime) + ' ' + Formatter.formatTime(state.JNowTime)
            },
            username: () => state.username,
            role: () => state.role
        },
        methods: {}
    }
</script>
<style scoped>
    .the-aside{
        background-color: rgb(238,226,226);
        height: 100%;
        text-align: center;
    }
    .button-group{
        display: flex;
        justify-content: stretch;
        flex-direction: column;
    }
    .time,.username,.role{
        font-size: .75em;
    }
    h1{
        margin: 0;
        padding: 1em .5em;
    }
</style>