<template>
  <div>

<!-- from表单 -->
    <ELForm v-bind="formConfig" v-model:modelValue="formData" ref="myFormRef">
      <template #footer>
      <el-form-item>
        <el-button class="tav_btn" @click="btnSelect">搜索</el-button>
        <el-button class="tav_btn" @click="reset">重置</el-button>
      </el-form-item>
    </template>
    </ELForm>

    <!-- from编辑表单 -->
    <el-dialog v-model="uPddialog" :title="flag==true? '产品修改操作': '产品新增操作'" width="40%">
    <ELForm v-bind="updFormConfig" v-model:modelValue="updFormData" ref="myFormRef">
      <template #footer>
          <el-form-item>
            <div class="btn-left">
              <el-button class="tav_btn" @click="uPdSubmit">确认</el-button>
              <el-button class="tav_btn" @click="uPddialog = false">取消</el-button>
            </div>
          </el-form-item>
        </template>
    </ELForm>
    </el-dialog>

<!-- 事项 -->
   <div style="margin: 20px 0 10px 0">
      <el-button class="tav_btn" @click="handleAdd">新增</el-button>
      <el-button class="tav_btn" @click="handelEdit" :disabled="getId.length==1? false:true">修改</el-button>
      <el-button class="tav_btn" @click='handel' :disabled="getId.length==0? true:false">删除</el-button>
      <el-button class="tav_btn" @click="handleExport">导出</el-button>
   </div>

<!--表单 -->
    <ElTable :column="tableConfig.columns" :data="tableData">
      <template #operation="scope">
        <el-button @click="editRow(scope.row)" class="btn_active">
        修改
      </el-button>
      <el-button @click="deleteRow(scope.row)" class="btn_active">删除</el-button>
      </template>
    </ElTable>

<!-- 分页 -->
    <el-pagination
      v-model:current-page="Page.currentPage"
      v-model:page-size="Page.pageSize"
      :page-sizes="Page.page_sizes" 
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="Page.total"
      size="small"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      style="float: right; margin-top: 10px"
    />

  </div>
 
</template>

<script setup>
import ELForm from '@/components/fromConfig/EIForm.vue'
import formConfig from '@/components/basic-data/product/form'
import updFormConfig from '@/components/basic-data/product/uPd-product'

import ElTable from '@/components/TableConfig/ElTable.vue'
import tableConfig from '@/components/basic-data/product/table'

import { ElMessage } from 'element-plus'
import handleDelete from '@/ulit/delete'
import {handleDaochu} from '@/ulit/XLSX.js';
import bus from "@/ulit/Bus.js";
import cookies from "vue-cookies";
const token = cookies.get("token");
import {ref,onMounted,reactive} from 'vue'
import {
  List_Produce,
  add_Produce,
  edit_Produce
} from '@/requert/basic-data/product.js'
import axios from 'axios'



const tableData=ref()
const myFormRef=ref()

//配置项
const formItems=formConfig.formItems?? []
const uPdformItems=updFormConfig.formItems?? []

const form={}
const updForm={}

//绑定值转换
formItems.map(item=>{
  form[item.field]=''
})

uPdformItems.map(item=>{
  updForm[item.field]=''
})

//表单值绑定
const formData=ref(form)
const updFormData=ref(updForm)

//弹窗判定
const uPddialog=ref(false)

//分页配置项
const Page = reactive({
  pageSize: 10,
  currentPage: 1,
  total: 0,
  page_sizes: [5, 10, 15, 20],
});

const handleSizeChange = (val) => {
  Page.pageSize = val;
  Page.currentPage = 1;
  List();
};

const handleCurrentChange = (val) => {
  Page.currentPage = val;
  //   debouncedFetch()
  List();
};

onMounted(()=>{
  List()
})

const List=()=>{
  List_Produce({
    pageNum:Page.currentPage,
    pageSize:Page.pageSize
  }).then(res=>{
    tableData.value=res.data.rows
    Page.total=res.data.total
  })
}

//查询
const btnSelect=()=>{
  formData.value.pageNum=1,
  formData.value.pageSize=10
  List_Produce(formData.value).then(res=>{
    if(res.data.code==200){
      tableData.value=res.data.rows
      ElMessage.success(res.data.msg)
    }else{
      ElMessage.error(res.data.msg)
    }
  })
}

//重置
const reset=()=>{
  myFormRef.value.reset()
  List()
}

let deleteParams = {
  url: "/system/product/",
  ArrayId: [],
  method() {
    List();
  },
};

//表格选中ID
const getId=ref([])
const getIdList=[]

bus.on('getCheckedBoxID',k=>{
  getId.value=k
  const newId = ref(new Set());
  k.forEach((item) => {
    newId.value.add(item.productId);
    getIdList.value=Array.from(newId.value)
    getAxios.url='https://www.cp-mes.cn/prod-api/system/product/'+Array.from(newId.value)
 }); 

})

//多选删除
const handel=()=>{
  deleteParams.ArrayId=getIdList.value
  handleDelete(deleteParams)
}
  
//删除
const deleteRow=(row)=>{
deleteParams.ArrayId=row.productId
handleDelete(deleteParams)
}

/**
 * @param flag 判定编辑或者新增逻辑
 */
const flag=ref(true)

//新增
const handleAdd=()=>{
  uPddialog.value=true
  flag.value=false
  updFormConfig.formItems.map(item=>{
    item.disabled=false
  })

}


const getAxios={
  url: "",
  method:"get",
  headers: {
    Authorization: "Bearer " + token,
  },
}

const handelEdit=()=>{
uPddialog.value=true
axios(getAxios).then(res=>{
  updFormData.value=res.data.data
})
}


//编辑
const editRow=async(row)=>{
  uPddialog.value=true
  flag.value=true
  updFormData.value=row 
  updFormConfig.formItems.map(item=>{
    if(item.label=='产品编号'||item.label=='自动生成')
    item.disabled=true
  })
}

//编辑或新增提交
const uPdSubmit=()=>{
if(flag.value==true){ //flag判断此操作是编辑还是增加
  edit_Produce(updFormData.value).then(res=>{  //编辑
    if(res.data.code==200){
      tableData.value=res.data.rows
      ElMessage.success(res.data.msg)
      uPddialog.value=false
      List()
    }else{
      ElMessage.error(res.data.msg)
    }
  })
}else{
  add_Produce({
    inventoryMax: 0,
    inventoryMin: 0,
    inventorySafe: 0,
    productAttribute: updFormData.value.productAttribute,
    productName:  updFormData.value.productName,
    productNumber:  updFormData.value.productNumber,
    productQuantity: 0,
    productUnit: updFormData.value.productUnit,
    remark: updFormData.value.remark,
    routeId:  updFormData.value.routeId,
    routeName: updFormData.value.routeName,
    specification:  updFormData.value.specification,
  }).then(res=>{  //新增
    if(res.data.code==200){
      tableData.value=res.data.rows
      ElMessage.success(res.data.msg)
      uPddialog.value=false
      List()
    }else{
      ElMessage.error(res.data.msg)
    }
  })
}
}
const handleExport=()=>{
  handleDaochu(tableData.value)
}

</script>

<style lang="scss" scoped>
.btn-left{
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 50px;
}
.tav_btn {
  padding: 0px 20px;
  color: #fff;
  background-color: #3671e8;
  border: 1px solid #3671e8;
}
.btn_active {
  padding: 0px 10px;
  // margin: 30px 5px 20px 5px;
  color: #3671e8;
  background: #fff;
  border: 0;
  outline: 0;
}
</style>