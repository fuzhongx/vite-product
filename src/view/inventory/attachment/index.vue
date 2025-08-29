<template>
  <el-form :inline="true" v-model="from" class="demo-form-inline">
    <el-form-item label="库存编号">
      <el-input v-model="from.attachmentCode" placeholder="请输入库存编号" clearable class="input" />
    </el-form-item>
    <el-form-item label="库存名称">
      <el-input v-model="from.attachmentName" placeholder="请输入库存名称" clearable class="input" />
    </el-form-item>
    <el-form-item>
      <el-button @click="onSelect" class="tav_btn">查询</el-button>
      <el-button @click="Reset" class="tav_btn">重置</el-button>
    </el-form-item>
  </el-form>
  <div style="margin: 10px 0">
    <el-button class="tav_btn" @click="KUCUN_ADD">新增</el-button>
    <el-button class="tav_btn" :disabled="upd_disabled" @click="handelUpdate">修改</el-button>
    <el-button class="tav_btn" @click="handeDelete" :disabled="deleteId.length==0? true:false">删除</el-button>
    <el-button class="tav_btn" @click="handleDaochu">导出</el-button>
  </div>
  <div>
    <el-table ref="multipleTableRef" :data="data.Data_Table" style="width: 100%;" :row-key="getKey" fit
      @selection-change="getCheckedBox_Value">
      <el-table-column type="selection" width="55" align="center" reserve-selection />
      <el-table-column prop="attachmentCode" label="库存编号" align="center" />
      <el-table-column prop="type" label="库存类型" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.type == 1" class="el_tag" type="success">物料</el-tag>
          <el-tag v-else class="el_tag" type="info">产品</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="attachmentName" label="库存名称" align="center" />
      <el-table-column prop="model" label="库存规格" align="center" />
      <el-table-column prop="quantity" label="数量" align="center" />
      <el-table-column prop="unit" label="单位" align="center" />
      <el-table-column prop="createName" label="姓名" align="center" />
      <el-table-column prop="createTime" label="创建时间" align="center" />
      <el-table-column fixed="right" label="操作" align="center">
        <template #default="scope">
          <el-button link type="primary" size="small" @click.prevent="HandleRuku(scope.row)">
            + 入库
          </el-button>
          <el-button link type="primary" size="small" @click.prevent="HandleCuku(scope.row)">
            - 出库
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 入库 -->
    <el-dialog v-model="play.RuKu_Dialog" title="入库管理" width="20%">
      <div style="padding: 20px 0px 10px 0px"><label for="supplyType">出（入）库数量：</label></div>
      <el-input-number v-model="Inventory.supplyType" :min="1" :max="100" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="play.RuKu_Dialog = false">取消</el-button>
          <el-button type="primary" @click="Ruku_Submit">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 出库 -->
    <el-dialog v-model="play.CuKu_Dialog" title="出库管理" width="20%">
      <div style="padding: 20px 0px 10px 0px"><label for="supplyType">出（入）库数量：</label></div>
      <el-input-number v-model="Inventory.supplyType" :min="1" :max="100" />
      <div style="padding: 20px 0px 10px 0px">
        <div style="padding: 20px 0px 10px 0px"><label for="supplyType">领料人：</label></div>
        <el-select v-model="nickName_Select" placeholder="请选择领料人" style="width:150px">
          <el-option :label="item.nickName" :value="item.nickName" v-for="item in nickName" :key="item.id" />
        </el-select>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="play.CuKu_Dialog = false">取消</el-button>
          <el-button type="primary" @click="Cuku_Submit">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 出入库添加 -->
    <el-dialog v-model="play._ADD_Dialog" title="添加出入库管理" width="22%">
      <el-form ref="ruleFormRef" :model="KuCun_ADD" :rules="rules" class="demo-ruleForm" status-icon>

        <el-form-item label="库存类型" style="margin-top: 30px;" class="item-m-30">
          <el-select v-model="KuCun_ADD.type" placeholder="请选择库存类型" clearable>
            <el-option :label="item.dictLabel" :value="item.dictLabel" v-for="item in Inventory_types"
              :key="item.dictCode" />
          </el-select>
        </el-form-item>

        <el-form-item label="库存名称" class="item-m-20-30" prop="attachmentName" v-if="KuCun_ADD.type == '物料'">
          <el-select v-model="KuCun_ADD.attachmentName" placeholder="请输入库存名称" clearable
            :disabled="KuCun_ADD.type ? false : true">
            <el-option :label="item.materialName" :value="item.materialName" v-for="item in Material_list"
              :key="item.createBy" @click="getOptionChange(item)" />
          </el-select>
        </el-form-item>

        <el-form-item label="库存名称" class="item-m-20-30" prop="attachmentName" v-else>
          <el-select v-model="KuCun_ADD.attachmentName" placeholder="请输入库存名称" clearable
            :disabled="KuCun_ADD.type ? false : true">
            <el-option :label="item.productName" :value="item.productName" v-for="item in Product_list" :key="item"
              @click="getOption_Prd_Change(item)" />
          </el-select>
        </el-form-item>

        <el-form-item label="库存编号" class="item-m-20-30" prop="attachmentCode">
          <el-input v-model="KuCun_ADD.attachmentCode" placeholder="请输入库存编号" clearable :disabled="disabled" />
        </el-form-item>

        <el-form-item label="库存规格" class="item-m-30">
          <el-select v-model="KuCun_ADD.model" placeholder="请输入库存规格" clearable :disabled="disabled">
            <el-option label="物料" value="shanghai" />
            <el-option label="产品" value="shanghai" />
          </el-select>
        </el-form-item>

        <el-form-item label="单位" label-width="70px" class="item-m-30" prop="unit">
          <el-select v-model="KuCun_ADD.unit" placeholder="请输入对应单位" clearable :disabled="disabled">
            <el-option label="物料" value="shanghai" />
            <el-option label="产品" value="shanghai" />
          </el-select>
        </el-form-item>

        <el-form-item label="初始数量" class="item-m-30">
          <el-input-number v-model="KuCun_ADD.quantity" :min="0" :max="100"
            style="width: 100%; height: 36px;"></el-input-number>
        </el-form-item>

        <el-form-item label="备注" label-width="70px" style="margin-bottom: 50px;" class="item-m-30">
          <el-input type="textarea" v-model="KuCun_ADD.remark" style="width: 100%;" placeholder="请输入备注" />
        </el-form-item>

      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="play._ADD_Dialog = false">取消</el-button>
          <el-button type="primary" @click="_ADD_SuBmit">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>


    <!-- 修改出入库管理 -->
    <el-dialog v-model="play._UPD_Dialog" title="修改出入库管理" width="22%">
      <el-form ref="ruleFormRef" :model="fromData" :rules="rules" class="demo-ruleForm" status-icon>

        <el-form-item label="库存类型" style="margin-top: 30px;" class="item-m-30">
          <el-select v-model="fromData.type" placeholder="请选择库存类型" clearable>
            <el-option :label="item.dictLabel" :value="item.dictLabel" v-for="item in Inventory_types"
              :key="item.dictCode" />
          </el-select>
        </el-form-item>

        <el-form-item label="库存名称" class="item-m-20-30" prop="attachmentName" v-if="fromData.type == '物料'">
          <el-select v-model="fromData.attachmentName" placeholder="请输入库存名称" clearable
            :disabled="fromData.type ? false : true">
            <el-option :label="item.specification" :value="item.specification" v-for="item in Material_list" :key="item"
              @click="getOptionChange(item)" />
          </el-select>
        </el-form-item>

        <el-form-item label="库存名称" class="item-m-20-30" prop="attachmentName" v-else>
          <el-select v-model="fromData.attachmentName" placeholder="请输入库存名称" clearable
            :disabled="fromData.type ? false : true">
            <el-option :label="item.productName" :value="item.productName" v-for="item in Product_list" :key="item"
              @click="getOption_Prd_Change(item)" />
          </el-select>
        </el-form-item>

        <el-form-item label="库存编号" class="item-m-20-30" prop="attachmentCode">
          <el-input v-model="fromData.attachmentCode" placeholder="请输入库存编号" clearable :disabled="disabled" />
        </el-form-item>

        <el-form-item label="库存规格" class="item-m-30">
          <el-select v-model="fromData.model" placeholder="请输入库存规格" clearable :disabled="disabled">
            <el-option label="物料" value="shanghai" />
            <el-option label="产品" value="shanghai" />
          </el-select>
        </el-form-item>

        <el-form-item label="单位" label-width="70px" class="item-m-30" prop="unit">
          <el-select v-model="fromData.unit" placeholder="请输入对应单位" clearable :disabled="disabled">
            <el-option label="物料" value="shanghai" />
            <el-option label="产品" value="shanghai" />
          </el-select>
        </el-form-item>

        <el-form-item label="初始数量" class="item-m-30">
          <el-input-number v-model="fromData.quantity" :min="0" :max="100"
            style="width: 100%; height: 36px;"></el-input-number>
        </el-form-item>

        <el-form-item label="备注" label-width="70px" style="margin-bottom: 50px;" class="item-m-30">
          <el-input type="textarea" v-model="fromData.remark" style="width: 100%;" placeholder="请输入备注" />
        </el-form-item>

      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="play._UPD_Dialog = false">取消</el-button>
          <el-button type="primary" @click="_UPD_SuBmit">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
    <el-pagination v-model:current-page="Page.currentPage" v-model:page-size="Page.pageSize"
      :page-sizes="Page.page_sizes" background layout="total, sizes, prev, pager, next, jumper" :total='Page.total'
      @size-change="handleSizeChange" @current-change="handleCurrentChange"  size="small" style="float: right; margin-top: 10px;" />
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, watch } from 'vue';
import axios from 'axios';
import {
  List_Attachment, Ruku_Attachment, Ruku_Num_Attachment, inventory_types,
  material_list, product_list, Ruku_Add_Attachment
} from '@/requert/inventory/attachment.js';
import { userList } from '@/requert/system/user.js';
import { ElMessage } from 'element-plus';
import { dateValue } from '@/ulit/DateTime.js'
import cookies from 'vue-cookies'
import XLXS from '@/ulit/export';
import Delete from "@/ulit/delete";

const token = cookies.get('token')

/**
 * 公共数据
 */
const data = reactive({
  Data_Table: [],
  pathUrl: 'https://www.cp-mes.cn/prod-api/system/attachment/',

})
const ruleFormRef = ref()

/**
 * @param Page 分页
 */
const Page = reactive({
  pageSize: 10,
  currentPage: 1,
  total: 0,
  page_sizes: [ 5, 10, 15, 20],
})

const handleSizeChange = (val) => {
  Page.currentPage = 1;
  Page.pageSize = val;
  list();
}

const handleCurrentChange = (val) => {
  Page.currentPage = val
  list();
}

/**
 * rules校验规则
 */
const rules = reactive({
  attachmentCode: [
    { required: true, message: '请选择库存编号', trigger: 'blur' },
  ],
  attachmentName: [
    { required: true, message: '请选择库存名称', trigger: 'blur' },
  ],
  unit: [
    { required: true, message: '请选择对应单位', trigger: 'blur' },
  ]
})

//判断编辑逻辑
const disabled = ref(true)

/**
 * play dialog展示判断介质
 */
const play = reactive({
  RuKu_Dialog: false,
  CuKu_Dialog: false,
  _ADD_Dialog: false,
  _UPD_Dialog: false
})

onMounted(() => {
  list()
  Ruku_NickName()
})

/**
 * 表单数据后端返回数据来源
 * list()
 */
const from = reactive({
  attachmentCode: '',
  attachmentName: '',
})
const list = async () => {
  await List_Attachment({
  pageNum: Page.currentPage,
  pageSize: Page.pageSize,
  attachmentCode:from.attachmentCode,
  attachmentName:from.attachmentName,
  }).then(res => {
    data.Data_Table = res.data.rows
    Page.total = res?.data.total || 0
  })
}
const onSelect = () => {
  Page.currentPage = 1
  list()
}
const Reset = () => {
  from.attachmentCode = '',
  from.attachmentName = '',
  list()
}

/**
 * 添加参数
 */

const KuCun_ADD = reactive({
  attachmentCode: "",
  attachmentName: "",
  model: "",
  specification: '',
  quantity: 1,
  remark: "",
  type: "",
  unit: "",
})

/**
 * @param KuCun_ADD.type 监听输入框数据变化
 */
watch(() => KuCun_ADD.type, (newVal, oldVal) => {
  if (newVal != oldVal) {
    KuCun_ADD.attachmentName = []
    KuCun_ADD.attachmentCode = ''
    KuCun_ADD.model = '',
      KuCun_ADD.remark = '',
      KuCun_ADD.unit = ''
    KuCun_ADD.specification = ''
  }
})


const KUCUN_ADD = () => {
  play._ADD_Dialog = true
}

/**
 * 
 * @param row 物料根据选中的库存名称展示相应数据
 */
const getOptionChange = (row) => {
  KuCun_ADD.attachmentCode = row.materialNumber
  KuCun_ADD.materialName = row.materialName
  KuCun_ADD.unit = row.materialUnit
  KuCun_ADD.quantity = row.materialQuantity
  KuCun_ADD.model = row.specification
  KuCun_ADD.remark = row.remark
}

/**
 * 
 * @param prd 物料根据选中的库存名称展示相应数据
 * 
 */
const getOption_Prd_Change = (prd) => {
  KuCun_ADD.attachmentCode = prd.productNumber
  KuCun_ADD.attachmentName = prd.productName
  KuCun_ADD.unit = prd.productUnit
  KuCun_ADD.quantity = prd.productQuantity
  KuCun_ADD.model = prd.specification
  KuCun_ADD.remark = prd.remark
}

/**
 * @property _ADD_SuBmit 添加库存 
 */
const _ADD_SuBmit = () => {
  const type = KuCun_ADD.type == '物料' ? '1' : '0'
  Ruku_Add_Attachment({
    attachmentCode: KuCun_ADD.attachmentCode,
    attachmentName: KuCun_ADD.attachmentName,
    model: KuCun_ADD.model,
    quantity: KuCun_ADD.quantity,
    type: type,
    unit: KuCun_ADD.unit,
  }).then(res => {
    if (res.data.code == 200) {
      play._ADD_Dialog = false
      ElMessage.success(res.data.msg)
      list()
    } else {
      ElMessage.error(res.data.msg)
    }
  })
}

/**
 * @property handelUpdate 修改函数
 * @property _UPD_SuBmit 修改函数
 * @param  deleteId 获取选中checkedBox的attachmentId
 */

const deleteId = ref([])

const getCheckedBox_Value = (row) => {
  const newId=ref(new Set())
    newId.value.clear() // 清空现有的id集合
    row.forEach(item=>{
        newId.value.add(item.attachmentId); // 添加新的id到集合中，自动处理唯一性
    })
    const a=ref([])
    a.value=Array.from(newId.value)
    console.log(Array.from(newId.value)); // 输出当前选中的id数组（如果不希望是Set，可以转换为Array） 
}

/**
 * @param fromData 根据ID后端返回的数据
 * @param upd_disabled 是否修改
 */
const upd_disabled = ref(true)
let fromData = ref({})

const handelUpdate = () => {
  play._UPD_Dialog = true
  getValue(deleteId.value)
}

const _UPD_SuBmit = () => {
  // const type = KuCun_ADD.type == '物料' ? '1' : '0'
  Ruku_Num_Attachment(fromData.value).then(res => {
    if (res.data.code == 200) {
      play._UPD_Dialog = false
      ElMessage.success(res.data.msg)
      list()
    } else {
      ElMessage.error(res.data.msg)
    }
  })
}


//删除方法所需参数
const props=reactive({
    url:'/system/attachment/',
    ArrayId:deleteId.value,
    method(){
        list()
    }
})

//删除
const handeDelete = () => {
  console.log(Array.from(deleteId.value));
  Delete(props)
}

/**
 * @property {handleDaochu} 导出表格
 */
const handleDaochu = () => {
  XLXS(data.Data_Table)
}

/**
 * 入库
 * params 获取当前id数据
 * Ruku_Submit 提交入库事件
 * Inventory 入库/出库共有属性
 */
const Inventory = reactive({
  supplyType: 1,
  address: ''
})

/**
 * @param params 公共的，根据ID获取到后端数据存储数组
 */
const params = ref()

const HandleRuku = (row) => {
  play.RuKu_Dialog = true
  getValue(row.attachmentId)
}

/**
 * 根据ID获取值函数
 */
const getValue = (attachmentId) => {
  axios({
    url: data.pathUrl + attachmentId,
    method: 'get',
    headers: {
      Authorization: 'Bearer ' + token
    }
  }).then(res => {
    params.value = res.data.data
    let { attachmentCode, attachmentId, attachmentName, createBy, createName, createTime, model, purveyorId,
      purveyorName, quantity, remark, type, unit, updateBy, updateTime } = res.data.data
    fromData.value = {
      attachmentCode, attachmentId, attachmentName, createBy, createName, createTime, model, purveyorId,
      purveyorName, quantity, remark, type, unit, updateBy, updateTime
    }
    fromData.value.type = fromData.value.type == 1 ? '物料' : '产品'

  })

}

/**
 * 入库出库共有函数
 */
const attachment = () => {
  Ruku_Num_Attachment({
    attachmentCode: params.value.attachmentCode,
    attachmentId: params.value.attachmentId,
    attachmentName: params.value.attachmentName,
    createBy: params.value.createBy,
    createName: null,
    createTime: params.value.createTime,
    model: params.value.model,
    purveyorId: params.value.purveyorId,
    purveyorName: params.value.purveyorName,
    quantity: params.value.quantity,
    remark: params.value.remark,
    type: params.value.type,
    unit: params.value.unit,
    updateBy: params.value.updateBy,
    updateTime: dateValue(),
  })
}

const Ruku_Submit = () => {
  Ruku_Attachment({
    address: nickName_Select.value,
    contractEmail: null,
    contractName: params.value.contractName,
    contractPhone: Inventory.supplyType,
    contractPost: params.value.unit,
    nature: params.value.model,
    purveyorCode: params.value.attachmentCode,
    purveyorName: params.value.attachmentName,
    supplyType: '1',
    type: params.value.type,
  }).then(res => {
    if (res.data.code == 200) {
      play.RuKu_Dialog = false
      ElMessage.success('入库成功')
      attachment()
      list()
    } else {
      ElMessage.error(res.data.msg)
    }
  })

}

/**
 * 出库
 * @param params 获取当前id数据
 * @param nickName 领料人后端返回数据
 * @param Ruku_Submit 提交入库事件
 * @param Product_list 存储产品列表
 * @param Material_list 存储物料数组
 */
const dataRow = ref()
const nickName = ref()
const nickName_Select = ref(null)
const Inventory_types = ref()
const Product_list = ref()
const Material_list = ref()

const HandleCuku = (row) => {
  play.CuKu_Dialog = true
  getValue(row)
  dataRow.value = row
}

/**
 * @param userList用户姓名
 * @param inventory_types库存类型函数
 * @param product_list 产品函数
 * @param material_list 物料函数
 * 
 */
const Ruku_NickName = () => {
  userList().then(res => {
    nickName.value = res.data.rows
  })
  inventory_types().then(res => {
    Inventory_types.value = res.data.data
  })
  product_list().then(res => {
    Product_list.value = res.data.rows
  })
  material_list().then(res => {
    Material_list.value = res.data.rows
  })

}
const Cuku_Submit = () => {
  Ruku_Attachment({
    address: nickName_Select.value,
    contractEmail: null,
    contractName: params.value.createBy,
    contractPhone: Inventory.supplyType,
    contractPost: params.value.unit,
    nature: params.value.model,
    purveyorCode: params.value.attachmentCode,
    purveyorName: params.value.attachmentName,
    supplyType: '0',
    type: params.value.type,
  }).then(res => {
    if (res.data.code == 200) {
      data.Data_Table = res.data.rows
      play.CuKu_Dialog = false
      ElMessage.success('入库成功')
      list()
    } else {
      ElMessage.error(res.data.msg)
    }

  })
}

/**
 * 
 * @param row checkedBox 唯一标识,防止二次触发选中
 */
const getKey = (row) => {
  return row.id
}
</script>

<style lang="scss" scoped>
.item-m-30 {
  margin: 20px 30px;
}

.item-m-20-30 {
  margin: 20px 30px 20px 20px;
}

.el-form-item__label {
  font-weight: 700;
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


.el-dropdown-link {
  outline: 0;
  color: #409eff;
  font-size: 12px;
  cursor: pointer;
}

.el-dropdown-lin:hover {
  color: rgb(149, 187, 224)
}

.infinite-list {
  height: 300px;
  padding: 0;
  margin: 0;
  list-style: none;
  overflow: auto
}

.infinite-list .infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background: var(--el-color-primary-light-9);
  margin: 10px;
  color: var(--el-color-primary);
}

.infinite-list .infinite-list-item+.list-item {
  margin-top: 10px;
}

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