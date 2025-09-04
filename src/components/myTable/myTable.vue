<template>
    <el-table ref="multipleTableRef" :data="myTableData" style="width: 100%" v-bind="$attrs" height="600" fit :header-cell-style="{background:'#f8f8f9',color:'#515a6e'}">
        <template v-for="(v,i) in tableItem" :key="i">     
        <el-table-column :type=v.type :width=v.width v-if="v.type==='selection'"/>
        <el-table-column :type=v.type :label="v.label" :width=v.width  :align='v.align' v-if="v.type==='status'">
             <template v-slot="scope">
                <el-switch v-model="scope.row.status" active-value="0" inactive-value='1'
                style="--el-switch-on-color: #3671e8;"/>
             </template>
        </el-table-column>
        <el-table-column :type=v.type :prop="v.prop" :label="v.label" :width=v.width  :align='v.align' v-if="v.type==='option'" fixed="right">
            <slot name="option"></slot>
        </el-table-column>
        <el-table-column :prop="v.prop" :label="v.label" :width=v.width  :align='v.align' v-if="v.type==='column'"/>
    </template>   
    </el-table>
</template>

<script setup>
const props = defineProps({
    myTableData: {
        type: Object
    },
    tableItem:{
        type:Array
    }
})
</script>

<style>
.el-table td.el-table__cell, .el-table th.el-table__cell.is-leaf {
    border-bottom: 1px solid #dfe6ec;
}
</style>