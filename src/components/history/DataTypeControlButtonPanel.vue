<template>
    <div>
        <el-button :type="dataType===ENTER?'success':''" @click="changeDataType(ENTER)">进港表</el-button>
        <el-button :type="dataType===LEAVE?'success':''" @click="changeDataType(LEAVE)">出港表</el-button>
        <el-button :type="dataType===BOTH?'success':''" @click="changeDataType(BOTH)">出港进港表</el-button>
    </div>
</template>

<script>
    import store from '../../store/store'

    let state = store.state,
        getters = store.getters

    export default {
        name: "data-type-control-button-panel",
        computed:{
            dataType:()=>state.historyDataType,

            ENTER:()=>state.dataState.ENTER,
            LEAVE:()=>state.dataState.LEAVE,
            BOTH:()=>state.dataState.BOTH,
        },
        methods:{
            changeDataType(type){
                store.commit('changeHistoryDataType',type)
            },
        }
    }
</script>

<style scoped>

</style>