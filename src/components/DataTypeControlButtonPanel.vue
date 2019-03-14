<template>
    <div class="data-type-control-button-panel">
        <el-button size="medium"  @click="changeDataType(LEAVE)">出港表</el-button>
        <el-button size="medium"  @click="changeDataType(ENTER)">进港表</el-button>
        <el-button size="medium"  @click="changeDataType(BOTH)">出港进港表</el-button>
    </div>
</template>

<script>
    import store from '../store/store'

    let state = store.state,
        getters = store.getters

    export default {
        name: "data-type-control-button-panel",
        computed:{
            dataType:()=>state.dataState.dataType,

            ENTER:()=>state.dataState.ENTER,
            LEAVE:()=>state.dataState.LEAVE,
            BOTH:()=>state.dataState.BOTH,
        },
        methods:{
            changeDataType(type){
                store.commit('changeDataType',type)
            },
        }
    }
</script>

<style>
    .data-type-control-button-panel .el-button{
        background-color: rgb(239, 113, 122);
        border-color: rgb(239, 113, 122);
        color: white;
    }
    .data-type-control-button-panel .el-button:hover{
        background-color: #c9302c;
        border-color: #ac2925;
        color: white;
    }
</style>