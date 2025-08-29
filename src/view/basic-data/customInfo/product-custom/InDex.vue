<template>
   <el-button @click="handelAdd" class="add_btn">
        增加新字段
      </el-button>
  <ElTable :column="column" :data="dataTable">
    <template #operation="scope">
      <el-button @click="handelEdit(scope.row)" class="btn_active" >
        编辑
      </el-button>
      <el-button @click="deleteRow(scope.row)" class="btn_active">删除</el-button>
    </template>
  </ElTable>

  <!-- 
  编辑 -->
  <el-dialog v-model="uPddialog" :title="flag=='Edit'? '修改自定义字段':'添加自定义字段'" width="22%">
      <EIForm v-bind="tableConfig" v-model:modelValue="EditFormData"  ref="myFormRef" style="margin-top: 30px;">
        <template #footer>
          <el-form-item style="margin-bottom: 0px;">
            <div class="btn-left">
              <el-button class="tav_btn" @click="EditBtn">确认</el-button>
              <el-button class="tav_btn" @click="uPddialog = false">取消</el-button>
            </div>
          </el-form-item>
        </template>
      </EIForm>
    </el-dialog>

 <!-- 分页 -->
  <el-pagination
      class="pagination"
      v-model:current-page="currentPage"
      :page-size="pageSize"
      :page-sizes="page_sizes"
      :small="small"
      background
      layout="total,  prev, pager, next, jumper,sizes,"
      :total=total
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />




</template>

<script setup>
import EIForm from "@/components/fromConfig/EIForm.vue";
import ElTable from "@/components/TableConfig/ElTable.vue";
import column from "@/components/basic-data/customInfo/product.js";
import uPdformConfig from '@/components/basic-data/customInfo/uPdproduct.js'
import aDdformConfig from '@/components/basic-data/customInfo/aDdproduct.js'
import detele from '@/ulit/delete.js'
import { onMounted, ref } from "vue";

import { List_product ,Edit_product,add_product} from "@/requert/basic-data/customInfo/product.js";
import { ElMessage } from "element-plus";

//分页配置
const currentPage = ref(1)
const pageSize= ref(10)
const page_sizes=ref([10,15,20])
const total=ref(0)
const small = ref(false)

const handleSizeChange = (val) => {
  pageSize.value=val 
  List()
}
const handleCurrentChange = (val) => {
  currentPage.value=val
  List()
}

// 表格配置项
const tableConfig=ref()

// 配置项
const EditFormItems = uPdformConfig.formItems ?? [];

//配置项转换参数
const formData={}

// 遍历转换model为空
EditFormItems.map(item=>{
  formData[item.field]=''
})

//转换为响应式
const EditFormData=ref(formData)


//弹窗标志
const uPddialog=ref(false)

const dataTable = ref();

onMounted(() => {
  List();
});

const List = () => {
  const k=ref()
  List_product({
    pageNum:currentPage.value,
    pageSize:pageSize.value,
    customTable: 0,
  }).then((res) => {
    dataTable.value = res.data.rows;
    total.value=res.data.total

    dataTable.value.map(item=>{
     switch (item.customType){
     case '0': item.customType='文本'; break;
     case '1': item.customType='数字'; break;
     case '2' :  item.customType='时间'; break;
     case '3':  item.customType='文件'; break;
     case '4' :  item.customType='图片'; break;
     default: item.customType='单选框'; break;
    }
    })
    
  });
};

const pramsConfig={
url:'system//CustomInfo/',
ArrayId:'',
method(){
  List()
}
}

//删除
const deleteRow=(row)=>{
  pramsConfig.ArrayId= row.customId
  detele(pramsConfig)
}


// 编辑
const handelEdit=(row)=>{
  tableConfig.value=uPdformConfig
  uPddialog.value=true
  EditFormData.value=row
  flag.value='Edit'
}

//添加
const handelAdd=()=>{
  tableConfig.value=aDdformConfig
  uPddialog.value=true
    flag.value='Add'
}

//检验编辑添加操作
const flag=ref()

const EditBtn=()=>{
  console.log(EditFormData.value);
  
  if(flag.value=='Add'){
    EditFormData.value.customTable='0'
    EditFormData.value.radioType=''

    add_product(EditFormData.value).then(res=>{
    if(res.data.code==200){
      ElMessage.success(res.data.msg)
      List()
      uPddialog.value=false
    }else{
      ElMessage.error(res.data.msg)
    }
  })

  }else{
    Edit_product(EditFormData.value).then(res=>{
    if(res.data.code==200){
      ElMessage.success(res.data.msg)
      List()
      uPddialog.value=false
    }else{
      ElMessage.error(res.data.msg)
    }
  })
  }


 
}
</script>

<style lang="scss" scoped>
.pagination{
  float: right;
  margin-top: 10px;
}
.tav_btn{
  padding: 0px 20px;
  color: #fff;
  background-color: #3671e8;
  border: 1px solid #3671e8;
}
.btn-left{
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 50px;
}
.add_btn{
  color:#efff;
  border-radius: 5px;
  margin-bottom: 10px;
  background: #3671e8;
}
.btn_active{
  color:#3671e8;
  outline: 0px;
  border: 0px;
}
</style>