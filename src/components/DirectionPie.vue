<template>
    <div id="direction-pie" style="width: 300px;height: 250px"></div>
</template>

<script>
    import echarts from 'echarts'
    import store from '../store/store'

    let state = store.state,
        getters = store.getters
    import {mapGetters} from 'vuex'

    export default {
        name: "direction-pie",
        data() {
            let that = this
            return {
                directionChart: null,

                option: {
                    title: {
                        text: '方向分步图',
                        x: 'center',
                        left: 'left'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: function (params, ticket, callback) {
                            let header
                            if (that.dataType === state.dataState.ENTER) {
                                header = '进港分布--' + params.data.name
                            } else if (that.dataType === state.dataState.LEAVE) {
                                header = '出港分布--' + params.data.name
                            } else {
                                header = '进出港分布--' + params.data.name
                            }

                            return `<div style="text-align: right">${header}<br>${params.data.value}<br>${params.data.content}</div>`;
                        }
                    },
                    legend: {
                        x: 'center',
                        y: 'bottom',
                        data: ['东', '南', '西', '北']
                    }
                    ,
                    toolbox: {
                        show: true,
                        feature: {
                            mark: {
                                show: true
                            }
                            ,
                            dataView: {
                                show: true, readOnly: false
                            }
                            ,
                            magicType: {
                                show: true,
                                type: ['pie', 'funnel']
                            }
                            ,
                            restore: {
                                show: true
                            }
                            ,
                            saveAsImage: {
                                show: true
                            }
                        }
                    }
                    ,
                    calculable: true,
                    series: [
                        {
                            name: '方向分步图',
                            type: 'pie',
                            radius: [15, 75],
                            center: ['50%', 125],
                            roseType: 'area',
                            startAngle: 45,
                            data: [
                                {value: 0, name: '东', content: ''},
                                {value: 0, name: '南', content: ''},
                                {value: 0, name: '西', content: ''},
                                {value: 0, name: '北', content: ''}
                            ]
                        }
                    ]
                }
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.chart = echarts.init(document.getElementById('direction-pie'))
                this.chart.setOption(this.option)
                this.updateSerieData(this.dataType)
            })
        },
        computed: {
            ...mapGetters([
                'enterPortN',
                'leavePortN',
                'enterPortS',
                'leavePortS',
                'enterPortW',
                'leavePortW',
                'enterPortE',
                'leavePortE',
                'leavePortData',
                'enterPortData',
            ]),
            dataType: () => state.dataState.dataType,
            ENTER: () => state.dataState.ENTER,
            LEAVE: () => state.dataState.LEAVE,
            BOTH: () => state.dataState.BOTH,
        },
        watch: {
            dataType() {
                // 通知更新饼状图数据
                this.updateSerieData()
            },
            leavePortData(){
                // 通知更新饼状图数据
                this.updateSerieData()
            },
            enterPortData(){
                // 通知更新饼状图数据
                this.updateSerieData()
            },
        },
        methods: {
            updateSerieData() {
                let v = this.dataType
                // v:数据集状态
                // 当数据集状态发生改变时需要改变option
                let portE, portS, portW, portN
                if (v === state.dataState.ENTER) {
                    portE = this.enterPortE
                    portS = this.enterPortS
                    portW = this.enterPortW
                    portN = this.enterPortN
                } else if (v === state.dataState.LEAVE) {
                    portE = this.leavePortE
                    portS = this.leavePortS
                    portW = this.leavePortW
                    portN = this.leavePortN
                } else {
                    portE = this.leavePortE.concat(this.enterPortE)
                    portS = this.leavePortS.concat(this.enterPortS)
                    portW = this.leavePortW.concat(this.enterPortW)
                    portN = this.leavePortN.concat(this.enterPortN)

                }
                let arrayMap = {
                    '东': portE,
                    '南': portS,
                    '西': portW,
                    '北': portN
                }


                this.option.series[0].data.forEach(object => {
                    object.value = arrayMap[object.name].length
                    object.content = arrayMap[object.name].map((v, index) => v.arcid + (index % 5 === 4 ? '<br>' : '')).join(' ')
                })

                this.chart.setOption(this.option)

            },
        }
    }
</script>

<style scoped>
    #direction-pie {
        width: 300px;
        height: 300px;
    }
</style>