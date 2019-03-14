<template>
        <el-table
                :data="enterPortData"
                :row-class-name="tableRowClassName"
                class="el-table"
                :default-sort = "{prop: 'minutes', order: 'ascending'}">
            <el-table-column
                    prop="arcid"
                    label="航班号"
                    sortable/>
            <el-table-column
                    prop="adep"
                    label="起飞机场"
                    sortable/>
            <el-table-column
                    prop="ades"
                    label="目的机场"
                    sortable/>
            <el-table-column
                    prop="status"
                    label="状态"
                    sortable/>
            <el-table-column
                    prop="atd"
                    label="实际起飞时间"
                    width="150"
                    sortable>
                <template slot-scope="scope">
                    {{scope.row.atd?scope.row.atd:'未起飞' | time}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="ata"
                    label="实际降落时间"
                    width="150"
                    sortable>
                <template slot-scope="scope">
                    {{scope.row.ata?scope.row.ata:'' | time}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="pass1"
                    label="进入时间"
                    sortable>
                <template slot-scope="scope">
                    {{scope.row.pass1?scope.row.pass1:'' | time}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="pass2"
                    label="离开时间"
                    sortable>
                <template slot-scope="scope">
                    {{scope.row.ata?scope.row.ata:'' | time}}
                </template>
            </el-table-column>
        </el-table>
</template>

<script>
    // 830 500
    import store from '../../store/store'
    import {Formatter} from '../../util'

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
            enterPortData: () => state.enterHistory
        },
        filters: {
            time: value => (typeof value === 'number' || value instanceof Number) ? Formatter.formatTime(value) : value
        }
    }
</script>
<style>
    .el-table .row-danger {
        background-color: rgb(242, 222, 222);
    }

    .el-table .row-normal {
        background-color: rgb(223, 240, 216);
    }
</style>