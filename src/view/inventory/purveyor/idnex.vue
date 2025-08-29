<template>
    <div>
        <el-form :inline="true" v-model="formItems" class="demo-form-inline">
            <el-form-item label="库存编号">
                <el-input v-model="formItems.purveyorCode" placeholder="请输入库存编号" clearable class="input" />
            </el-form-item>
            <el-form-item label="库存名称">
                <el-input v-model="formItems.purveyorName" placeholder="请输入库存名称" clearable class="input" />
            </el-form-item>
            <el-form-item label="库存规格">
                <el-input v-model="formItems.nature" placeholder="请输入库存规格" clearable class="input" />
            </el-form-item>
            <el-form-item>
                <el-button class="tav_btn" @click="handleSelect">查询</el-button>
                <el-button class="tav_btn" @click="handleReset">重置</el-button>
            </el-form-item>
        </el-form>
        <div style="margin: 10px 0">
            <el-button class="tav_btn" @click="handleDelete" :disabled="deleteId.length==0? true:false">删除</el-button>

            <el-button class="tav_btn" @click="handleDaochu">导出</el-button>
        </div>

        <el-table ref="TableRef" :data="DataTable" style="width: 100%" :row-key="getKey" fit
            @selection-change="getCheckedBox_Value">
            <el-table-column type="selection" width="55" align="center" reserve-selection />
            <el-table-column prop="purveyorCode" label="库存编号" align="center" />
            <el-table-column prop="type" label="库存类型" align="center">
                <template #default="scope">
                    <el-tag v-if="scope.row.type == 1" class="el_tag" type="success">物料</el-tag>
                    <el-tag v-else class="el_tag" type="info">产品</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="purveyorName" label="库存名称" align="center" />
            <el-table-column prop="nature" label="库存规格" align="center" />
            <el-table-column prop="supplyType" label="操作类型" align="center">
                <template #default="scope">
                    <el-tag v-if="scope.row.supplyType == 1" class="el_tag" type="success">入库</el-tag>
                    <el-tag v-else class="el_tag" type="info">出库</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="contractPhone" label="数量" align="center" />
            <el-table-column prop="contractPost" label="单位" align="center" />
            <el-table-column prop="address" label="领料人" align="center" />
            <el-table-column prop="updateBy" label="出（入）库人" align="center" />
            <el-table-column prop="createTime" label="创建时间" align="center" />
            <el-table-column prop="updateTime" label="创建时间" align="center" />
            <el-table-column fixed="right" label="操作" align="center">
                <template #default="scope">
                    <el-button link type="primary" size="small" @click="deleteRow(scope.row)"> 删除 </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination v-model:current-page="Page.currentPage" v-model:page-size="Page.pageSize"
            :page-sizes="Page.page_sizes" background layout="total, sizes, prev, pager, next, jumper"
            :total='Page.total' @size-change="handleSizeChange" @current-change="handleCurrentChange"
            size="small" style="float: right; margin-top: 10px;" />
    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import XLSX from '@/ulit/export.js'
import Delete from "@/ulit/delete";
// import { debounce } from 'lodash-es'

// const debouncedFetch = debounce(List, 300)

import {
    List_purveyor,
} from '@/requert/inventory/purveyor.js';

// import { ElMessage, ElMessageBox } from "element-plus";
// import axios from "axios";

const data = reactive({
    pathUrl: 'https://www.cp-mes.cn/prod-api/system/purveyor/',
})

/**
 * 
 * @param DataTable 表单数据数组
 */
const DataTable = ref([])
const TableRef=ref()

/**
 * @property{List}后端返回数据列表函数
 */
const List = async () => {
    try {
        await List_purveyor({
            pageNum: Page.currentPage,
            pageSize: Page.pageSize,
            purveyorCode: formItems.purveyorCode,
            purveyorName: formItems.purveyorName,
            nature: formItems.nature,
        }).then(res => {
            DataTable.value = (res.data.rows)
            Page.total = res.data.total
        })
    } catch (error) {
        console.error('数据加载失败:', error);
    }
}
const Page = reactive({
    pageSize: 10,
    currentPage: 1,
    total: 0,
    page_sizes: [5, 10, 15, 20],
})

const handleSizeChange = (val) => {
    Page.pageSize = val;
    Page.currentPage = 1;
    List()
}

const handleCurrentChange = (val) => {
    Page.currentPage = val
    //   debouncedFetch()
    List()
}

onMounted(() => {
    List()
})

/**
 * @param formItems 表单查询
 * 
 */
const formItems = reactive({
    purveyorCode: "",
    purveyorName: "",
    nature: '',
    pageNum: 1,
    pageSize: 10
});

/**
 * @param handleSelect 查询函数
 */
const handleSelect = () => {
    Page.currentPage = 1
    List()
}
const handleReset = () => {
    formItems.purveyorCode = '',
        formItems.purveyorName = '',
        formItems.nature = '',
        List()
}

/**
 * @property getCheckedBox_Value 表格选中ID返回信息
 * @param deleteId ID数组
 */
const deleteId = ref(new Set())

const getCheckedBox_Value = (row) => {
    deleteId.value.clear() // 清空现有的id集合
    row.forEach(item=>{
        deleteId.value.add(item.purveyorId); // 添加新的id到集合中，自动处理唯一性
        console.log(Array.from(deleteId.value),678);
        
    })
    console.log(deleteId.value);//set
    console.log(Array.from(deleteId.value)); // 输出当前选中的id数组（如果不希望是Set，可以转换为Array） 
}
//删除方法所需参数
const props=reactive({
    url:'/system/purveyor/',
    ArrayId:Array.from(deleteId.value),
    method(){
        List()
    }
})
//删除
const handleDelete = () => {
   console.log(Array.from(deleteId.value));
    Delete(props)
    console.log(props);
    
}
const deleteRow=(row)=>{
    props.ArrayId=row.purveyorId
    Delete(props)
}

//导出
const handleDaochu = () => {
    XLSX(DataTable.value)
}




/**
 * 
 * @param getKey 
 */

const getKey = (row) => {
    return row.id; // 确保每行的唯一标识是id
};
</script>

<style lang="scss" scoped>
.el-dialog__title {
    font-weight: 400px;
}

.input {
    height: 36px !important;
}

.tav_btn {
    padding: 0px 20px;
    color: #fff;
    background-color: #3671e8;
    border: 1px solid #3671e8;
}

.el-tag {
    background-color: #ebf1fd;
    border-color: #d7e3fa;
    display: inline-block;
    height: 32px;
    padding: 0 10px;
    line-height: 30px;
    font-size: 12px;
    color: #3671e8;
    border-width: 1px;
    border-style: solid;
    border-radius: 4px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    white-space: nowrap;
}
</style>
