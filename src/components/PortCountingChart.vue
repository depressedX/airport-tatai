<template>
    <div ref="chart" :style="chartSize"></div>
</template>

<script>
    import echarts from 'echarts'
    import {mapState, mapGetters} from 'vuex'
    import {Formatter} from "../util"
    import store from '../store/store'


    export default {
        name: "port-counting-chart",
        props: {
            chartSize: {
                type: Object,
                default: () => ({
                    // 使用原网站的尺寸
                    width: '90%',
                    height: '500px'
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
                    legend: {
                        show: true,
                        left: 'left'
                    },
                    tooltip: {
                        axisPointer: {
                            type: 'cross',
                        },
                        trigger: 'axis',
                        formatter(params, ticket) {
                            return `${params[0].axisValue}后<br>`
                                + params
                                    .filter(v => ['进港', '出港'].some(vv => vv === v.seriesName))
                                    .map(
                                        v => `
                                        ${v.seriesName}:${v.data}<br>
${(v.seriesName === '进港' ? that.mapedEnterData : that.mapedLeaveData).content[v.dataIndex]
                                            .map(({value, isUnderControl}) => `
<span ${isUnderControl ? 'style="color: red"' : ''}>${value}</span>
`
                                            )
                                            .join('<br>')}`
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
                        // 因为想要后面的横线 暂时不用category
                        // [
                        //     {
                        //         type: 'category',
                        //         boundaryGap: false,
                        //         data: Array.from({length: 10}).map((v, i) => i),
                        //         axisLabel: {
                        //             show: true,
                        //             interval: 0,
                        //             rotate: 0,
                        //             margin: 10,
                        //         }
                        //     }
                        // ] :
                        [
                            {
                                type: 'value',
                                boundaryGap: false,
                                min: 0,
                                max: 10,
                                interval: 1,
                                axisLabel: {
                                    show: true,
                                    interval: 0,
                                    rotate: 0,
                                    margin: 10,
                                }
                            }
                        ]:
                        [
                            {
                                type: 'value',
                                boundaryGap: false,
                                min: 0,
                                max: 10,
                                interval: 1,
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
                        },
                        // 对于折线图显示总数
                        {
                            name: '进出港',
                            type: this.type,
                            stack: this.type + (this.type === 'bar' ? '' : '3'),
                            get data() {
                                return that.dataType === that.BOTH && that.type === 'line' ?
                                    that.mapedEnterData.num.map((v, i) => v + that.mapedLeaveData.num[i]) : []
                            }
                        }
                    ],

                }
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
        }
        ,
        methods: {
            generalAxisXList() {
                let axisXList = []
                let startTime = this.timeStart
                // 注意这里duration+1 总时间是指当前时间转换后的时间长度
                let allSteps = Math.floor((this.duration + 1) * 60 / this.step) + 1
                for (let curTime = startTime, i = 0; i < allSteps; i++, curTime += this.step * 60 * 1000) {
                    axisXList.push(Formatter.formatTime(curTime))
                }
                return axisXList
            }
            ,

            // 将飞行数据按duration和step映射到X轴上   返回{num:[],content:[]}
            mapPortData(arr) {
                let res = {num: [], content: []}
                for (let i = 0; i < Math.floor((this.duration + 1) * 60 / this.step) + 1; i++) {
                    res.num[i] = 0
                    res.content[i] = []
                }
                const MAX_INDEX = res.num.length - 1
                // 当前时间所在的序号
                let nowIndex = Math.ceil((this.now - this.timeStart) / this.step / 60 / 1000)
                arr.forEach(v => {
                    let startIndex = Math.ceil((this.now + v.minutes * 60 * 1000 - this.timeStart) / this.step / 60 / 1000)
                    startIndex = Math.max(startIndex, 0)
                    if (startIndex > MAX_INDEX) {
                        return
                    }
                    let isUnderControl = startIndex == nowIndex
                    res.num[startIndex]++
                    res.content[startIndex].push({value: v.arcid, isUnderControl})
                })
                return res
            }
            ,

            // 更新this.option的series
            updateSeries() {
                // 更新映射后的航班数
                this.mapedEnterData = this.mapPortData(this.enterPortData)
                this.mapedLeaveData = this.mapPortData(this.leavePortData)


                // 更改当前时间显示轴
                this.option.series[3] = {
                    name: '当前时间',
                    type: 'line',
                    markLine: {
                        data: [
                            [{
                                name: Formatter.formatTime(this.now),
                                x: 5 + (this.now - this.timeStart) / ((this.duration + 1) * 60 * 60 * 1000) * 100 * .9 + '%',
                                y: '95%'
                            }, {
                                x: 5 + (this.now - this.timeStart) / ((this.duration + 1) * 60 * 60 * 1000) * 100 * .9 + '%',
                                y: '25%'
                            }]
                        ]
                    }
                }
                this.chart.setOption(this.option)
            }
            ,
            // 更新this.option的X轴
            updateAxisX() {
                let axisX = this.generalAxisXList()
                this.option.xAxis[0].data = axisX

                this.updateSeries()
            }
            ,


        }
        ,
        computed: {

            ...
                mapState({
                    step: state => state.dataState.step,
                    duration: state => state.dataState.duration,
                    dataType: state => state.dataState.dataType,
                    ENTER: state => state.dataState.ENTER,
                    LEAVE: state => state.dataState.LEAVE,
                    BOTH: state => state.dataState.BOTH,
                }),

            ...
                mapGetters(['now', 'enterPortData', 'leavePortData', 'timeStart']),


        }
        ,
        watch: {
            // ENTER / LEAVE / BOTH
            dataType(v) {
                this.updateSeries()
            }
            ,
            leavePortData() {
                this.updateSeries()
            }
            ,
            enterPortData() {
                this.updateSeries()
            }
            ,

            // 改变X轴必然要重新计算数据
            duration() {
                this.updateAxisX()
            }
            ,
            step() {
                this.updateAxisX()
            }
            ,
            now() {
                this.updateAxisX()
            }
        }
    }
</script>

<style scoped>

</style>