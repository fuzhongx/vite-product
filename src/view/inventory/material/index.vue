<template>
  <div>
    <ELForm v-bind="formConfig" v-model:modelValue="formData" ref="myFormRef">
      <template #footer>
        <el-form-item>
          <el-button class="tav_btn" @click="btnSelect">搜索</el-button>
          <el-button class="tav_btn" @click="reset">重置</el-button>
        </el-form-item>
      </template>
    </ELForm>

    <!-- 事项 -->
    <div style="margin: 20px 0 10px 0">
      <el-button class="tav_btn" @click="handleAdd">新增</el-button>
      <el-button class="tav_btn" @click="handleUpdata" :disabled="updateBtn"
        >修改</el-button
      >
      <el-button class="tav_btn" @click="handleDel">删除</el-button>
      <el-button class="tav_btn" @click="handelExport">导出</el-button>
    </div>

    <!-- 表单 -->
    <ElTable :tableData="tableData" :column="column.columns">
      <template #operation="scope">
        <button @click="handelEdit(scope.row)" class="btn_active" type="text">
          修改
        </button>
        <button @click="deleteRow(scope.row)" class="btn_active">删除</button>
      </template>
    </ElTable>

    <!-- 修改 -->
    <el-dialog v-model="uPddialog" title="物料修改操作" width="35%">
      <ELForm
        v-bind="UpdformConfig"
        v-model:modelValue="uPdFormData"
        ref="myFormRef"
      >
        <template #footer>
          <el-form-item>
            <el-button class="tav_btn" @click="uPdbtn">确认</el-button>
            <el-button class="tav_btn" @click="uPddialog = false"
              >取消</el-button
            >
          </el-form-item>
        </template>
      </ELForm>
    </el-dialog>

    <!-- 添加 -->
    <el-dialog v-model="aDDdialog" title="物料新增操作" width="35%">
      <ELForm
        v-bind="UpdformConfig"
        v-model:modelValue="aDdFormData"
        ref="myFormRef"
      >
        <template #footer>
          <el-form-item>
            <el-button class="tav_btn" @click="AddBtn">确认</el-button>
            <el-button class="tav_btn" @click="aDDdialog = false"
              >取消</el-button
            >
          </el-form-item>
        </template>
      </ELForm>
    </el-dialog>
    <el-pagination
      v-model:current-page="Page.currentPage"
      v-model:page-size="Page.pageSize"
      :page-sizes="Page.page_sizes"
      background  size="small"
      layout="total, sizes, prev, pager, next, jumper"
      :total="Page.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      style="float: right; margin-top: 10px"
    />
  </div>
</template>

<script setup>
import { ref, reactive, defineExpose, onMounted } from "vue";
import ELForm from "@/components/fromConfig/EIForm.vue";
import formConfig from "@/components/fromConfig/material";
import ElTable from "@/components/TableConfig/ElTable.vue";
import column from "@/components/TableConfig/MyTable";
import UpdformConfig from "@/components/material/uPd-Material";
import { ElMessage } from "element-plus";
import { dateValue } from "@/ulit/DateTime.js";
import { handleDelete } from "@/ulit/delete.js";
import { handleDaochu } from "@/ulit/XLSX";
import bus from "@/ulit/Bus.js";
import cookies from "vue-cookies";
const token = cookies.get("token");

import {
  List_material,
  uPd_material,
  Add_material,
} from "@/requert/inventory/material";
import axios from "axios";

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

const uPddialog = ref(false);
const aDDdialog = ref(false);

//form 配置项
const formItems = formConfig.formItems ?? [];
const uPdFormItem = UpdformConfig.formItems ?? [];
const aDdFormItem = UpdformConfig.formItems ?? [];

const from = {};
const uPdForm = {};
const aDdForm = {};

// 见每个配置项转化为空
formItems.map((item) => {
  from[item.field] = "";
});

//修改项目转化为空
uPdFormItem.map((item) => {
  uPdForm[item.field] = "";
});

//添加项目转化为空
aDdFormItem.map((item) => {
  aDdForm[item.field] = "";
});

const formData = ref(from);
const uPdFormData = ref(uPdForm);
const aDdFormData = ref(aDdForm);

const myFormRef = ref();
formData.value.pageNum = 1;
formData.value.pageSize = 10;

const btnSelect = () => {
  List_material(formData.value).then((res) => {
    tableData.value = res.data.rows;
  });
};

// 重置
const reset = () => {
  myFormRef.value.reset();
};

onMounted(() => {
  List();
});

const List = () => {
  List_material({
    pageNum: Page.currentPage,
    pageSize: Page.pageSize,
  }).then((res) => {
    tableData.value = res.data.rows;
    Page.total = res.data.total;
  });
};

//表格数据
const tableData = ref([]);
const RowValue = ref();

// 导出
const handelExport = () => {
  handleDaochu(tableData.value);
};

// 新增
const handleAdd = () => {
  aDDdialog.value = true;
};

const AddBtn = () => {
  console.log(aDdFormData.value);
  Add_material({
    inventoryMax: 0,
    inventoryMin: 0,
    inventorySafe: 0,
    materialAttribute: aDdFormData.value.materialAttribute,
    materialName: aDdFormData.value.materialName,
    materialNumber: aDdFormData.value.materialNumber,
    materialQuantity: 0,
    materialUnit: aDdFormData.value.materialUnit,
    specification: aDdFormData.value.specification,
  }).then((res) => {
    if (res.data.code == 200) {
      tableData.value = res.data.rows;
      ElMessage.success(res.data.msg);
      List();
      aDDdialog.value = false;
    } else {
      ElMessage.error(res.data.msg);
    }
  });
};

/**
 * @param deleteParams 删除所需参数
 */
let deleteParams = {
  url: "/system/material/",
  ArrayId: [],
  method() {
    List();
  },
};

const handleDel = () => {
  deleteParams.ArrayId = changeId.value;
  handleDelete(deleteParams);
};

//删除
const deleteRow = (row) => {
  deleteParams.ArrayId = row.materialId;
  handleDelete(deleteParams);
};

//多选编辑
const changeId = [];
const updateBtn = ref(true);

//编辑展示的值
const showValue = ref();

bus.on("getCheckedBoxID", (k) => {
  const newId = ref(new Set());
  k.forEach((item) => {
    newId.value.add(item.clientId);
    changeId.value = Array.from(newId.value);
    getAxios.url =
      "https://www.cp-mes.cn/prod-api/system/material/" +
      Array.from(newId.value);

    //判断是否禁用按钮
    if (k.length == 1) {
      //修改按钮是否可用
      updateBtn.value = false;
    } else {
      updateBtn.value = true;
    }
  });
});

const getAxios = {
  url: "",
  method: "get",
  headers: {
    Authorization: "Bearer " + token,
  },
};

const handleUpdata = () => {
  uPddialog.value = true;
  axios(getAxios).then((res) => {
    showValue.value = res.data.data;
    let {
      createBy,
      createName,
      createTime,
      inventoryMax,
      inventoryMin,
      inventorySafe,
      materialAttribute,
      materialId,
      materialName,
      materialNumber,
      materialQuantity,
      materialUnit,
      remark,
      specification,
      updateBy,
      updateTime,
    } = res.data.data;
    uPdFormData.value = {
      materialNumber,
      materialName,
      materialUnit,
      specification,
      materialAttribute,
      remark,
    };
    RowValue.value = {
      createBy,
      createName,
      createTime,
      inventoryMax,
      inventoryMin,
      inventorySafe,
      materialId,
      materialQuantity,
      updateBy,
      updateTime,
    };
  });
  RowValue.value.updateTime = dateValue();
};

//编辑
const handelEdit = (row) => {
  uPddialog.value = true;
  let {
    createBy,
    createName,
    createTime,
    inventoryMax,
    inventoryMin,
    inventorySafe,
    materialAttribute,
    materialId,
    materialName,
    materialNumber,
    materialQuantity,
    materialUnit,
    remark,
    specification,
    updateBy,
    updateTime,
  } = row;
  uPdFormData.value = {
    materialNumber,
    materialName,
    materialUnit,
    specification,
    materialAttribute,
    remark,
  };
  RowValue.value = {
    createBy,
    createName,
    createTime,
    inventoryMax,
    inventoryMin,
    inventorySafe,
    materialId,
    materialQuantity,
    updateBy,
    updateTime,
  };
  RowValue.value.updateTime = dateValue();
};
const uPdbtn = () => {
  let {
    materialNumber,
    materialName,
    materialUnit,
    specification,
    materialAttribute,
    remark,
  } = uPdFormData.value;
  let {
    createBy,
    createName,
    createTime,
    inventoryMax,
    inventoryMin,
    inventorySafe,
    materialId,
    materialQuantity,
    updateBy,
    updateTime,
  } = RowValue.value;
  uPd_material({
    createBy,
    createName,
    createTime,
    inventoryMax,
    inventoryMin,
    inventorySafe,
    materialAttribute,
    materialId,
    materialName,
    materialNumber,
    materialQuantity,
    materialUnit,
    remark,
    specification,
    updateBy,
    updateTime,
  }).then((res) => {
    if (res.data.code == 200) {
      tableData.value = res.data.rows;
      ElMessage.success("修改成功");
      List();
      uPddialog.value = false;
    } else {
      ElMessage.error(res.data.msg);
    }
  });
};
</script>

<style lang="scss" scoped>
.el-dialog__title {
  font-weight: 800;
}
.btn_active {
  padding: 0px 10px;
  margin: 0 10px;
  color: #3671e8;
  background: #fff;
  border: 0;
  outline: 0;
}

.tav_btn {
  padding: 0px 20px;
  color: #fff;
  background-color: #3671e8;
  border: 1px solid #3671e8;
}
</style>
