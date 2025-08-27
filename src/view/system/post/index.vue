<template>
  <div class="animate__animated " style="height: 100%;">
    <el-form :inline="true" v-model="from" class="demo-form-inline">
      <el-form-item label="岗位编码">
        <el-input v-model="from.postCode" placeholder="请输入岗位编码" clearable class="input" />
      </el-form-item>
      <el-form-item label="岗位名称">
        <el-input v-model="from.postName" placeholder="请输入岗位名称" clearable class="input" />
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
      <el-button class="tav_btn" @click="updPost" :disabled="disabled">编辑</el-button>
      <el-button class="tav_btn" @click="delPost">删除</el-button>
      <el-button class="tav_btn" @click="handleDaochu">导出</el-button>
    </div>
    <div>
      <el-table ref="multipleTableRef" :data="data.post_LIST" style="width: 100%" @select-all="selectALL"
        :row-key="getKey" :select-on-indeterminate="allChecked" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" reserve-selection />
        <el-table-column prop="postId" label="岗位编号" align="center" />
        <el-table-column prop="postCode" label="岗位编码" align="center" />
        <el-table-column prop="postName" label="岗位名称" align="center" />
        <el-table-column prop="postSort" label="岗位排序" align="center" />
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
   
    <!------------
      -编辑-
    --------- -->
    <el-dialog v-model="play.upddialog" title="编辑岗位" width="25%">
      <el-form :model="data.addpost" style="padding: 30px 20px" :rules="rules">
        <el-form-item label="岗位名称" :label-width="data.formLabelWidth" prop="postName">
          <el-input v-model="data.updpost.postName" autocomplete="off" class="input" />
        </el-form-item>
        <el-form-item label="岗位编码" :label-width="data.formLabelWidth" prop="postCode">
          <el-input autocomplete="off" v-model="data.updpost.postCode" class="input" />
        </el-form-item>
        <el-form-item label="岗位排序" :label-width="data.formLabelWidth" prop="postSort">
          <el-input-number v-model="data.updpost.postSort" :min="0"  class="input" />
        </el-form-item>
        <el-form-item label="  状态" label-width="50px" prop="status">
          <el-radio-group v-model="data.updpost.status" class="ml-4">
            <el-radio label="0" size="large" value="0">正常</el-radio>
            <el-radio label="1" size="large" value="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" label-width="50px" style="label-l">
          <el-input type="textarea" v-model="data.updpost.remark" autocomplete="off" placeholder="请添加备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="tav_btn" @click="updSubmit">确认</el-button>
          <el-button @click="play.upddialog = false"> 取消 </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- -------
     --- 添加--
     ------------>
     
    <el-dialog v-model="play.adddialog" title="添加岗位" width="25%">
      <el-form :model="data.addpost" :rules="rules" class="el-from-padding">
        <el-form-item label="岗位编码" :label-width="data.formLabelWidth" prop="postCode">
          <el-input autocomplete="off" v-model="data.addpost.postCode" class="input" />
        </el-form-item>
        <el-form-item label="岗位名称" :label-width="data.formLabelWidth" prop="postName">
          <el-input v-model="data.addpost.postName" autocomplete="off" class="input" />
        </el-form-item>
        <el-form-item label="岗位排序" :label-width="data.formLabelWidth" prop="postSort">
          <el-input-number v-model="data.addpost.postSort" :min="0"  class="input" />
        </el-form-item>
        <el-form-item label="  状态" label-width="50px" prop="status">
          <el-radio-group v-model="data.addpost.status" class="ml-4">
            <el-radio label="0" size="large" value="0">正常</el-radio>
            <el-radio label="1" size="large" value="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" label-width="50px" style="label-l">
          <el-input type="textarea" v-model="data.addpost.remark" autocomplete="off" placeholder="请添加备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="tav_btn" @click="addSubmit">确认</el-button>
          <el-button @click="play.adddialog = false"> 取消 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { postListApi, addpostAPI, updpostAPI } from "@/requert/system/post.js";
import { onMounted, reactive, ref } from "vue";
import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
import cookies from "vue-cookies";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const data = reactive({
  Radio_postId: "",
  post_LIST: [],
  formLabelWidth: "",
  addpost: {
    postCode: "",
    postName: "",
    postSort: "0",
    status: "0",
    remark: "",
  },
  updpost: {
    postId: "",
    postCode: "",
    postName: "",
    postSort: "0",
    status: "0",
    remark: "",
  },
});
const from = reactive({
  postCode: "",
  postName: "",
  status: "0",
});
const play = reactive({
  adddialog: false,
  upddialog: false,
  deldialog: false,
});
const disabled = ref(true);
const allChecked = ref();
const token = cookies.get("token");
const rules = {
  postCode: [
    { required: true, message: "请输入岗位编码", trigger: "blur" },
    { min: 1, max: 20, message: "Length should be 1 to 5", trigger: "blur" },
  ],
  postName: [
    { required: true, message: "请输入岗位名称", trigger: "blur" },
    { min: 1, max: 20, message: "Length should be 1 to 5", trigger: "blur" },
  ],
  postSort: [
    { required: true, message: "请选择排序编号", trigger: "blur" },
    { min: 1, max: 5, message: "Length should be 1 to 5", trigger: "blur" },
  ],
};
onMounted(() => {
  list();
});
const getKey = (row) => {
  return row.id;
};
const handleDaochu = () => {
  // 创建一个workbook
  const workbook = XLSX.utils.book_new();
  // 导出数据
  const worksheet = XLSX.utils.json_to_sheet(data.post_LIST);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");

  // 将workbook转为二进制数据
  const excelData = XLSX.write(workbook, {
    type: "array",
    bookType: "xlsx",
  });
  // 创建blob对象并保存excel文件
  const blob = new Blob([excelData], { type: "application/octet-stream" });
  // 设置导出文件名字
  saveAs(blob, "岗位列表.xlsx");
};

const list = () => {
  postListApi({
    pageNum: 1,
    pageSize: 10,
  })
    .then((res) => {
      console.log(res, 33);
      data.post_LIST = res.data.rows;
    })
    .catch((error) => {
      console.log(error);
    });
};
const updateRow = (row) => {
  play.upddialog = true;
  data.updpost.postCode = row.postCode;
  data.updpost.postName = row.postName;
  data.updpost.postSort = row.postSort;
  data.updpost.status = row.status;
  data.updpost.remark = row.remark;
  data.updpost.createBy = row.createBy;
  data.updpost.createTime = row.createTime;
  data.updpost.flag = row.flag;
  data.updpost.tenantId = row.tenantId;
  data.updpost.updateBy = row.updateBy;
  data.updpost.updateTime = row.updateTime;
  data.updpost.postId = row.postId;
};
const updSubmit = () => {
  updpostAPI({
    postId: data.updpost.postId,
    postCode: data.updpost.postCode,
    postName: data.updpost.postName,
    postSort: data.updpost.postSort,
    remark: data.updpost.remark,
    status: data.updpost.status,
    createBy: data.updpost.createBy,
    createTime: data.updpost.createTime,
    flag: data.updpost.flag,
    tenantId: data.updpost.tenantId,
    updateBy: data.updpost.updateBy,
    updateTime: data.updpost.updateTime,
  }).then((res) => {
    if (res.data.code == 200) {
      data.post_LIST = res.data.rows;
      list();
      ElMessage.success(res.data.msg);
      play.upddialog = false;
    } else {
      ElMessage.error(res.data.msg);
    }
  });
};
const deleteRow = (row) => {
  axios({
    url: "https://www.cp-mes.cn/prod-api/system/post/" + row.postId,
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
  }).then(() => {
    ElMessage.success("删除成功");
    list();
  });
};
const handleSelectionChange = (val) => {
  if (val.length > 1 || val.length == 0) {
    disabled.value = true;
  } else {
    disabled.value = false;
  }
  val.forEach((e) => {
    data.Radio_postId = e.postId;
  });

  console.log(val);
};
const delPost = () => {
  ElMessageBox.confirm("是否要删除此岗位?", "岗位删除操作", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      axios({
        url: "https://www.cp-mes.cn/prod-api/system/post/" + data.Radio_postId,
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      }).then(() => {
        ElMessage.success("删除成功");
        list();
      });
      ElMessage({
        type: "success",
        message: "删除成功",
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "删除失败",
      });
    });
};
const updPost = () => {
  play.upddialog = true;
  axios({
    url: "https://www.cp-mes.cn/prod-api/system/post/" + data.Radio_postId,
    method: "get",
    headers: {
      Authorization: "Bearer " + token,
    },
  }).then((res) => {
    data.updpost.postCode = res.data.data.postCode;
    data.updpost.postName = res.data.data.postName;
    data.updpost.postSort = res.data.data.postSort;
    data.updpost.status = res.data.data.status;
    data.updpost.remark = res.data.data.remark;
    data.updpost.createBy = res.data.data.createBy;
    data.updpost.createTime = res.data.data.createTime;
    data.updpost.flag = res.data.data.flag;
    data.updpost.tenantId = res.data.data.tenantId;
    data.updpost.updateBy = res.data.data.updateBy;
    data.updpost.updateTime = res.data.data.updateTime;
    data.updpost.postId = res.data.data.postId;
  });
};
const addPost = () => {
  play.adddialog = true;
};
const addSubmit = () => {
  addpostAPI({
    postCode: data.addpost.postCode,
    postName: data.addpost.postName,
    postSort: data.addpost.postSort,
    status: data.addpost.status,
    remark: data.addpost.remark,
  }).then((res) => {
    data.post_LIST = res.data.rows;
    list();
    play.adddialog = false;
  });
};
const onSelect = () => {
  postListApi({
    pageNum: 1,
    pageSize: 10,
    postCode: from.postCode,
    postName: from.postName,
    status: from.status,
  }).then((res) => {
    console.log(res, 33);
    data.post_LIST = res.data.rows;
  });
};
const reset = () => {
  (from.postCode = ""), (from.postName = ""), (from.status = "");
};
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
