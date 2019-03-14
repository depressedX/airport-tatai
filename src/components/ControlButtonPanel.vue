<template>
    <div class="control-button-panel">
        <div class="row row-1" style="margin-left: .5em">
            <data-type-control-button-panel/>
        </div>
        <div class="row row-2">
            <el-select size="medium" @change="changeTrackId" :value="trackId" placeholder="选择跑道"
                       style="width: 8em;margin: 0 .5em">
                <el-option-group label="跑道选择">
                    <el-option
                            v-for="id in trackIds"
                            :key="id"
                            :label="id+'跑道'"
                            :value="id">
                    </el-option>
                </el-option-group>
            </el-select>
            <el-select size="medium" :value="isFly" @change="changeIsFly" placeholder="开飞选择"
                       style="width: 8em;margin: 0 .5em">
                <el-option-group label="开飞选择">
                    <el-option
                            :key="true"
                            label="开飞"
                            :value="true">
                    </el-option>
                    <el-option
                            :key="false"
                            label="不开飞"
                            :value="false">
                    </el-option>
                </el-option-group>
            </el-select>
            <el-select size="medium" :value="duration" @change="changeDuration" placeholder="时间区间"
                       style="width: 8em;margin: 0 .5em">
                <el-option-group label="总时间">
                    <el-option
                            v-for="i in 3"
                            :key="i"
                            :label="`总时间 ${i}小时`"
                            :value="i">
                    </el-option>
                </el-option-group>
            </el-select>
            <el-select size="medium" :value="step" @change="changeStep" placeholder="分钟" style="width: 8em;margin: 0 .5em">
                <el-option-group label="时间间隔">
                    <el-option
                            :key="1"
                            :label="'间隔 1分钟'"
                            :value="1">
                    </el-option>
                    <el-option
                            :key="5"
                            :label="'间隔 5分钟'"
                            :value="5">
                    </el-option>
                </el-option-group>
            </el-select>
        </div>
    </div>
</template>

<script>
    import store from '../store/store'

    let state = store.state,
        getters = store.getters

    import DataTypeControlButtonPanel from './DataTypeControlButtonPanel'

    export default {
        name: "control-button-panel",
        components: {
            DataTypeControlButtonPanel
        },
        data() {
            return {}
        },
        computed: {
            trackIds: () => state.dataState.trackIds,
            trackId: () => state.dataState.trackId,
            isFly: () => state.dataState.isFly,
            duration: () => state.dataState.duration,
            step: () => state.dataState.step,
        },
        methods: {
            changeTrackId(id) {
                store.dispatch('refreshAllData', id).then(trackId => {
                    this.$alert(`跑道号修改为 ${trackId}`)
                }, error => {
                    this.$alert(`修改失败`)
                })
            },
            changeIsFly(v) {
                store.commit('changeIsFly', v)
            },
            changeDuration(duration) {
                store.commit('changeDuration', duration)
            },
            changeStep(step) {
                store.commit('changeStep', step)
            }
        }
    }


</script>
<style>
    .control-button-panel .el-select .el-input__inner {
        background-color: rgb(239, 113, 122);
        border-color: rgb(239, 113, 122);
        color: white;
    }
    .control-button-panel .el-select .el-input__inner:hover {
        background-color: #c9302c;
        border-color: #ac2925;
        color: white;
    }
    .control-button-panel .el-select .el-input .el-select__caret{
        color: white;
    }
</style>
<style scoped>
    .control-button-panel{
        margin: 0 -8px;
    }
    .control-button-panel > .row {
        margin-top: 10px;
    }
</style>