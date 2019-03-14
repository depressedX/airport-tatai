<template>
        <el-table
                :data="leavePortData"
                :row-class-name="tableRowClassName"
                class="customLeaveTable"
                :default-sort = "{prop: 'minutes', order: 'ascending'}"
                header-cell-class-name="custom-header-cell"
                cell-class-name="custom-cell">
            <el-table-column
                    prop="arcid"
                    label="航班号"
                    min-width="110"
                    class-name="custom-column-arcid"
                    align="center"
                    sortable/>
            <el-table-column
                    prop="adep"
                    label="起飞机场"
                    min-width="70"
                    align="center"
                    sortable/>
            <el-table-column
                    prop="ades"
                    label="目的机场"
                    width="70"
                    align="center"
                    sortable/>
            <el-table-column
                    prop="status"
                    label="状态"
                    class-name="custom-column-status"
                    align="center"
                    min-width="65"
                    sortable/>
            <el-table-column
                    prop="eobt"
                    label="预起时间"
                    class-name="custom-column-eobt"
                    min-width="120"
                    align="center"
                    sortable>
                <template slot-scope="scope">
                    {{scope.row.eobt?scope.row.eobt:'' | date}}<br>
                    {{scope.row.eobt?scope.row.eobt:'' | time}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="atd"
                    label="实际起飞时间"
                    min-width="60"
                    align="center"
                    sortable>
                <template slot-scope="scope">
                    {{scope.row.atd?scope.row.atd:'' | time}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="pass1"
                    label="进入时间"
                    min-width="60"
                    align="center"
                    sortable>
                <template slot-scope="scope">
                    {{scope.row.pass1?scope.row.pass1:'' | time}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="pass2"
                    label="离开时间"
                    min-width="60"
                    align="center"
                    sortable>
                <template slot-scope="scope">
                    {{scope.row.pass2?scope.row.pass2:'' | time}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="minutes"
                    label="剩余时间"
                    min-width="60"
                    align="center"
                    sortable/>
        </el-table>
</template>

<script>
    // 830 500
    import store from '../store/store'
    import {Formatter} from '../util'

    let state = store.state,
        getters = store.getters

    export default {
        name: "leave-port-table",

        methods: {
            tableRowClassName(v) {
                if (v.row.minutes <= 10) return 'row-danger'
                else return 'row-normal'
            },
            formatTime: Formatter.formatTime
        },
        computed: {
            leavePortData: () => getters.leavePortData
        },
        filters: {
            time: value => (typeof value === 'number' || value instanceof Number) ? Formatter.formatTime(value) : value,
            date: value => (typeof value === 'number' || value instanceof Number) ? Formatter.formatDate(value) : value,
        }
    }
</script>
<style>
    .customLeaveTable{
        font-size: 18px;
        color: #3d3d3d;
    }
    .customLeaveTable thead{
        color: #3d3d3d;
    }
    .customLeaveTable .row-danger {
        background-color: rgb(242, 222, 222);
    }

    .customLeaveTable .row-normal {
        background-color: rgb(223, 240, 216);
    }
    .customLeaveTable .custom-header-cell{
        background-color: #99bfe6 !important;
    }

    .customLeaveTable .custom-cell{
        padding-top: 4px;
        padding-bottom: 4px;
    }
    .customLeaveTable .custom-cell .cell {
        padding-left: 4px;
        padding-right: 4px;
    }
    
    /*需要加粗的列*/
    .customLeaveTable .custom-column-arcid,.customLeaveTable .custom-column-status,
    .customLeaveTable .custom-column-eobt{
        font-weight: bold;
    }
    
    .customLeaveTable .descending .sort-caret.descending {
        border-top-color: #3d3d3d;
    }
    .customLeaveTable .ascending .sort-caret.ascending {
        border-bottom-color: #3d3d3d;
    }
</style>