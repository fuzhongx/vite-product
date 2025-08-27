<template>
 <div>
    <el-form :inline="true" v-model="from" class="demo-form-inline">
      <el-form-item label="部门名称">
        <el-input v-model="from.deptName" placeholder="请输入部门名称" clearable class="input" />
      </el-form-item>
     
      <el-form-item label="状态">
        <el-select v-model="from.status" placeholder="请选择状态" clearable style="width: 192px; height: 36px">
          <el-option label="正常" value="0" />
          <el-option label="停用" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSelect" class="tav_btn">查询</el-button>
        <el-button @click="reset" class="tav_btn">重置</el-button>
      </el-form-item>
    </el-form>
    <div style="margin: 10px 0">
      <el-button class="tav_btn" @click="addPost">新增</el-button>
      <el-button class="tav_btn" @click="updPost">编辑</el-button>
      <el-button class="tav_btn" @click="delPost">删除</el-button>
      <el-button class="tav_btn" @click="expPost">导出</el-button>
    </div>
    <div>
      <el-table  :data="data.dept_List" style="width: 100%"
      row-key="id"
      lazy
       :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="deptName" label="部门名称" align="center" />
        <el-table-column prop="orderNum" label="排序" align="center" />
        <el-table-column prop="status" label="状态" align="center">
          <template #default="scope">
            <span v-if="scope.row.status == 0">正常</span>
            <span v-else>停用</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" />
        <el-table-column fixed="right" label="操作" width="120" align="center">
          <template #default="scope">
            <el-button link type="primary" size="small" @click.prevent="updateRow(scope.row)">
              编辑
            </el-button>
            <el-button link type="primary" size="small" @click.prevent="deleteRow(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { reactive,onMounted } from 'vue';
import {deptListApi}from '@/requert/system/dept.js'
import { ElMessage } from 'element-plus';

const data=reactive({
  dept_List:[
    {
      list:'',
      children:[]
    }
  ]

})
const from=reactive({
  deptName:'',
  status:'0'
})
onMounted(() => {
  list();
});
const list = () => {
  deptListApi({
    pageNum: 1,
    pageSize: 10,
  })
    .then((res) => {
      console.log(res, 33);
      if(res.data.code==200){
        data.dept_List.list=res.data.data[0]
        data.dept_List.children=res.data.data[1,res.data.data.length]
        console.log( data.dept_List.children,'123');
   
       
        
      }else{
        ElMessage.error(res.data.msg)
      }
      
    })
    .catch((error) => {
      console.log(error);
    });
};
const reset=()=>{
  from.deptName='',
  from.status=''
}
</script>

<style lang="scss" scoped>
.el-from-padding {
  padding: 30px 20px;
}

.label-l .el-form-item--default .el-form-item__labe {
  padding-left: 10px !important;
}

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

</style>