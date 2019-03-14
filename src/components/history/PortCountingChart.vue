<template>
    <div ref="chart" :style="chartSize"></div>
</template>

<script>
    import echarts from 'echarts'
    import {Formatter} from "../../util"
    import store from '../../store/store'
    import {mapGetters, mapState} from 'vuex'

    let state = store.state,
        getters = store.getters

    export default {
        name: "port-counting-chart",
        props: {
            chartSize: {
                type: Object,
                default: () => ({
                    width: '1260px',
                    height: '625px'
                })
            },
            // 图表类型  line  bar
            type: {
                type: String,
                validator(v) {
                    return v === 'line' || v === 'bar'
                },
                default: 'line'
            }
        },
        data() {
            let that = this
            return {
                chart: null,
                mapedEnterData: {num: [], content: []},
                mapedLeaveData: {num: [], content: []},
                option: {
                    legend:{
                        show:true
                    },
                    tooltip: {
                        axisPointer: {
                            type: 'cross'
                        },
                        trigger: 'axis',
                        formatter(params, ticket) {

                            return `${params[0].axisValue}后<br>`
                                + params.map(
                                    v => `${v.seriesName}:${v.data}<br>${(v.seriesName === '进港' ? that.mapedEnterData : that.mapedLeaveData).content[v.dataIndex].join('<br>')}`
                                )
                                    .join('<br>')
                        }
                    },
                    grid: {
                        left: '5%',
                        right: '5%',
                        bottom: '5%',
                        containLabel: false
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: [],
                            axisLabel: {
                                show: true,
                                rotate: 30,
                                margin: 5,
                            }
                        }
                    ],
                    yAxis: that.type === 'line' ?
                        [
                            {
                                type: 'category',
                                boundaryGap: false,
                                data: Array.from({length: 201}).map((v, i) => i),
                                axisLabel: {
                                    show: true,
                                    interval: 19,
                                    rotate: 0,
                                    margin: 10,
                                }
                            }
                        ] :
                        [
                            {
                                type: 'value',
                                splitNumber: 2,
                                min: 0,
                                max: 200,
                                interval: 20,
                                axisLabel: {
                                    show: true,
                                    interval: 0,
                                    rotate: 0,
                                    margin: 10,
                                }
                            }
                        ],
                    series: [
                        {
                            name: '出港',
                            type: this.type,
                            stack: this.type + (this.type === 'bar' ? '' : '1'),
                            get data() {
                                return that.dataType === that.ENTER ? [] : that.mapedLeaveData.num
                            }
                        },
                        {
                            name: '进港',
                            type: this.type,
                            stack: this.type + (this.type === 'bar' ? '' : '2'),
                            get data() {
                                return that.dataType === that.LEAVE ? [] : that.mapedEnterData.num
                            }
                        }
                    ],

                },

                // 间隔  单位分钟
                step: 5
            }
        },
        mounted() {
            // 初始化图表
            this.$nextTick(() => {
                // 基于准备好的dom，初始化echarts实例
                this.chart = echarts.init(this.$refs.chart)
                this.chart.setOption(this.option)
                this.updateAxisX()
            })
        },
        methods: {
            generalAxisXList() {
                let axisXList = []

                // 开始时间向下取整  结束时间向上取整
                let startTime = this.roundedTimeStart,
                    endTime = this.roundedTimeEnd

                for (let curTime = startTime; curTime <= endTime; curTime += this.step * 60 * 1000) {
                    axisXList.push(Formatter.formatTime(curTime))
                }
                return axisXList
            },


            // 更新this.option的series
            updateSeries() {

                // 更新映射后的航班数
                this.mapedEnterData = this.mapPortData(this.enterHistory,this.ENTER)
                this.mapedLeaveData = this.mapPortData(this.leaveHistory,this.LEAVE)

                this.chart.setOption(this.option)
            },
            // 更新this.option的X轴
            updateAxisX() {
                let axisX = this.generalAxisXList()
                this.option.xAxis[0].data = axisX

                this.updateSeries()
            },

            getInterval(v,dataType){
                if (dataType===this.ENTER){
                    return{
                        left:v.pass1,
                        right:v.ata
                    }
                }else if (dataType === this.LEAVE){
                    return{
                        left:v.atd,
                        right:v.atd+7*60*1000
                    }
                }else {
                    throw new Error('wrong dataType')
                }
            },

            // 将飞行数据按duration和step映射到X轴上   返回数组
            mapPortData(arr,dataType) {
                let res = {num:[],content:[]}
                for (let i = 0; i < Math.floor((this.roundedTimeEnd - this.roundedTimeStart) / this.step/60/1000) + 1; i++) {
                    res.num[i] = 0
                    res.content[i] = []
                }
                arr.forEach(v => {
                    let interval = this.getInterval(v,dataType)
                    let startIndex = Math.ceil((interval.left - this.roundedTimeStart) / this.step / 60 / 1000),
                        endIndex = Math.ceil((interval.right - this.roundedTimeStart) / this.step / 60 / 1000)
                    startIndex = Math.max(startIndex, 0)
                    endIndex = Math.min(endIndex, Math.floor((this.roundedTimeEnd - this.roundedTimeStart) / this.step / 60 / 1000) + 1)
                    for (let i = startIndex; i < endIndex; i++) {
                        res.num[i]++
                        res.content[i].push(v.arcid)
                    }
                })
                return res
            }
        },
        computed: {
            ENTER: () => state.dataState.ENTER,
            LEAVE: () => state.dataState.LEAVE,
            BOTH: () => state.dataState.BOTH,



            ...mapState(['historyStart', 'historyEnd', 'historyDataType', 'enterHistory', 'leaveHistory']),

            // 近似后的开始时间，向下取整
            roundedTimeStart() {
                let t = new Date(this.historyStart)
                return t.setMinutes(Math.floor(t.getMinutes() / 5)*5)
            },
            // 近似后的结束时间，向上取整
            roundedTimeEnd() {
                let t = new Date(this.historyEnd)
                return t.setMinutes(Math.ceil(t.getMinutes() / 5)*5)
            },
        },
        watch: {
            historyDataType(v) {
                this.updateSeries()
            },
            enterHistory() {
                this.updateSeries()
            },
            leaveHistory() {
                this.updateSeries()
            },

            // 改变X轴必然要重新计算数据
            historyStart() {
                this.updateAxisX()
            },
            historyEnd() {
                this.updateAxisX()
            },
        }
    }
</script>

<style scoped>

</style>