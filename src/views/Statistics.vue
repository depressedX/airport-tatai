<template>
    <div>
        <div class="row row-1">
            <el-date-picker
                    v-model="userTimeStart"
                    type="datetime"
                    placeholder="选择开始时间"
                    :default-time="userTimeEnd"
                    value-format="timestamp">
            </el-date-picker>
            <el-button>结束时间 {{userTimeEnd | dateTime}}</el-button>
            <el-button type="success" :disabled="submiting" @click="refreshHistoryData">搜索</el-button>
        </div>
        <div class="row row-2">
            <p class="description">
                在<em>{{historyStart |dateTime}}</em>至<em>{{historyEnd |dateTime}}</em>时间内进港航班总计<em>{{enterCount}}</em>架，
                出港航班总计<em>{{leaveCount}}</em>架，进出港港航班总计<em>{{enterCount+leaveCount}}</em>架
            </p>
        </div>
        <div class="row row-3">
            <data-type-control-button-panel/>
        </div>
        <div class="row row-4">
            <port-counting-chart type="line"/>
        </div>
        <div class="row row-5">
            <port-counting-chart type="bar"/>
        </div>
        <div class="row row-6">
            <enter-port-table v-if="historyDataType===ENTER||historyDataType===BOTH"/>
        </div>
        <div class="row row-7">
            <leave-port-table v-if="historyDataType===LEAVE||historyDataType===BOTH"/>
        </div>
    </div>
</template>

<script>
    import store from '../store/store'
    import {Formatter} from '../util'
    import PortCountingChart from '../components/history/PortCountingChart'
    import DataTypeControlButtonPanel from '../components/history/DataTypeControlButtonPanel'
    import EnterPortTable from '../components/history/EnterPortTable'
    import LeavePortTable from '../components/history/LeavePortTable'
    import {PermissionDenied} from "../errors";

    let state = store.state,
        getters = store.getters

    export default {
        name: "statistics",
        components: {
            DataTypeControlButtonPanel,
            PortCountingChart,
            EnterPortTable,
            LeavePortTable
        },
        data() {
            return {

                // 是否正在提交搜索
                submiting: false,

                userTimeStart:getters.now,
                userTimeEnd:getters.now
            }
        },
        methods: {
            refreshHistoryData() {
                this.submiting = true
                let UTCOffset = new Date().getTimezoneOffset()*60*1000
                store.dispatch('refreshHistoryData', {
                    start: this.userTimeStart+UTCOffset,
                    end: this.userTimeEnd+UTCOffset
                }).catch(error => {
                    if (error instanceof PermissionDenied) {
                        this.$router.push('/permissionDenied')
                    } else {
                        this.$alert(error)
                    }
                }).then(
                    () => {
                        this.submiting = false
                    },
                    error => {
                        this.submiting = false
                    }
                )
            }
        },
        computed: {
            now: () => getters.now,

            enterCount: () => state.enterHistory.length,
            leaveCount: () => state.leaveHistory.length,

            historyDataType: () => state.historyDataType,
            ENTER: () => state.dataState.ENTER,
            LEAVE: () => state.dataState.LEAVE,
            BOTH: () => state.dataState.BOTH,

            historyStart: () => state.historyStart,
            historyEnd: () => state.historyEnd,
        },
        filters: {
            dateTime: value => (typeof value === 'number' || value instanceof Number) ? `${Formatter.formatDate(value)} ${Formatter.formatTime(value)}` : value
        }
    }
</script>

<style scoped>
    .description em {
        color: #f56c6c;
    }
</style>