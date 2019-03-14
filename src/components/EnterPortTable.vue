<template>
        <el-table
                :data="enterPortData"
                :row-class-name="tableRowClassName"
                class="customEnterTable"
                :default-sort = "{prop: 'minutes', order: 'ascending'}"
                header-cell-class-name="custom-header-cell"
                cell-class-name="custom-cell"
                >
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
                    sortable>
            </el-table-column>
            <el-table-column
                    prop="ades"
                    label="目的机场"
                    min-width="70"
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
                    prop="atd"
                    label="实际起飞时间"
                    class-name="custom-column-atd"
                    min-width="60"
                    align="center"
                    sortable>
                <template slot-scope="scope">
                    {{scope.row.atd?scope.row.atd:'未起飞' | time}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="eta"
                    label="预落时间"
                    min-width="60"
                    align="center"
                    sortable>
                <template slot-scope="scope">
                    {{scope.row.eta?scope.row.eta:'' | time}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="ata"
                    label="实际降落时间"
                    sortable
                    align="center"
                    width="60">
                <template slot-scope="scope">
                    {{scope.row.ata?scope.row.ata:'' | time}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="pass1"
                    label="进入时间"
                    class-name="custom-column-pass1"
                    sortable
                    align="center"
                    min-width="60">
                <template slot-scope="scope">
                    {{scope.row.pass1?scope.row.pass1:'' | time}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="pass2"
                    label="离开时间"
                    sortable
                    align="center"
                    min-width="60">
                <template slot-scope="scope">
                    {{scope.row.pass2?scope.row.pass2:'' | time}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="minutes"
                    label="剩余时间"
                    sortable
                    align="center"
                    min-width="40"/>
        </el-table>
</template>

<script>
    // 830 500
    import store from '../store/store'
    import {Formatter} from '../util'

    let state = store.state,
        getters = store.getters

    export default {
        name: "enter-port-table",

        methods: {
            tableRowClassName(v) {
                if (v.row.minutes <= 10) return 'row-danger'
                else return 'row-normal'
            },
            formatTime: Formatter.formatTime
        },
        computed: {
            enterPortData: () => getters.enterPortData
        },
        filters: {
            time: value => (typeof value === 'number' || value instanceof Number) ? Formatter.formatTime(value) : value
        }
    }
</script>
<style>
    .customEnterTable{
        font-size: 18px;
        color: #3d3d3d;
    }
    .customEnterTable thead{
        color: #3d3d3d;
    }
    .customEnterTable .row-danger {
        background-color: rgb(242, 222, 222);
    }

    .customEnterTable .row-normal {
        background-color: rgb(223, 240, 216);
    }
    .customEnterTable .custom-header-cell{
        background-color: #99bfe6 !important;
    }
    .customEnterTable .custom-cell{
        padding-top: 4px;
        padding-bottom: 4px;
    }
    .customEnterTable .custom-cell .cell{
        padding-left: 4px;
        padding-right: 4px;
    }
    .customEnterTable .custom-column-arcid,.customEnterTable .custom-column-status,
    .customEnterTable .custom-column-pass1,.customEnterTable .custom-column-atd{
        font-weight: bold;
    }
    .customEnterTable .descending .sort-caret.descending {
        border-top-color: #3d3d3d;
    }
    .customEnterTable .ascending .sort-caret.ascending {
        border-bottom-color: #3d3d3d;
    }
</style>