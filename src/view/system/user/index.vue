<template>
  <div class="contair">
    <div class="treeSelect">
      <el-input v-model="filterText" placeholder="Filter keyword" />
      <el-tree ref="treeRef" class="filter-tree" :data="treeData" :props="defaultProps" default-expand-all
        :filter-node-method="filterNode" @node-click="getTreeValue" />
      <!-- //filter-node-method对树节点进行筛选时执行的方法， 返回 false 则表示这个节点会被隐藏	Function(value, data, node) -->
    </div>
    <div class="showTable">
      <myFrom v-bind="FromConfig" v-model="FormData" ref="myFormRef">
        <template #userButton>
          <el-button class="submitSelect" @click="submitSelect">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </template>
      </myFrom>
      <!-- 查询导航 -->
      <div>
        <el-button class="submitSelect">新增</el-button>
        <el-button class="submitSelect">编辑</el-button>
        <el-button class="submitSelect">删除</el-button>
        <el-button class="submitSelect">导入</el-button>
        <el-button class="submitSelect">导出</el-button>
      </div>

      <!-- 表格数据 -->
      <div class="myTable">
        <myTable v-bind="tableConfig" :data="myTableData">
          <template #option>
            <div class="options">
              <span>编辑</span>
              <span>删除</span>
              <span>更多</span>
            </div>
          </template>
        </myTable>
      </div>
    </div>

  </div>


</template>

<script setup>
import myFrom from '@/components/myForm/myForm.vue'
import FromConfig from '@/until/system/user.js'
import myTable from '@/components/myTable/myTable.vue'
import tableConfig from '@/until/system/userTable.js'
import { getDept, getUserTable, getUserSelect } from '@/api/user.js'
import { ref, watch, onMounted, reactive } from 'vue'

onMounted(() => {
  handleDept()
  handleTable()
})

const myFormRef = ref()

const formItem = FromConfig.formItem ?? []
const FormParams = {}
formItem.forEach(e => {
  FormParams[e.feild] = ''
});
const FormData = ref(FormParams)

//树结构配置
const defaultProps = {
  children: 'children',
  label: 'label',
}
const treeRef = ref()
const filterText = ref('')

//监听输入的数据
watch(filterText, (v) => {
  treeRef.value.filter(v)
})

/**
 * 
 * @param value 输入框数据
 * @param data Tree结构数据
 */
const filterNode = (value, data) => {
  if (!value) return true
  return data.label.includes(value) //将过滤的数据添加到data生成新的数组
}

//获取后端接口返回的部门数据
const treeData = ref()
const handleDept = () => {
  getDept().then(res => {
    treeData.value = res.data.data
  })
}

//部门查询信息
const getTreeValue = async (v) => {
  await getUserTable({
    pageNum: 1,
    pageSize: 10,
    deptId: v.id
  }).then(Ures => {
    myTableData.value = Ures.data.rows
  })
}

const p = ['beginTime', 'endTime']


//查询
const submitSelect = () => {
  let { params, ...data } = FormData.value
  getUserSelect({
    pageNum: 1,
    pageSize: 10,
    ...data,
    'params[beginTime]': params[0],
    'params[endTime]': params[1]
  }).then(res => {
    myTableData.value = res.data.rows
  })
}

//重置
const reset = () => {
  myFormRef.value.resetForm()
  handleTable()
}

// 表格数据
const myTableData = ref()
const handleTable = async () => {
  await getUserTable({
    pageNum: 1,
    pageSize: 10,
  }).then(Ures => {
    myTableData.value = Ures.data.rows
  })
}
const handleSelectionChange = () => {

}

</script>

<style lang="scss" scoped>
@mixin flex-center {
  display: flex;
  justify-content: space-between;
}

.contair {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;

  .treeSelect {
    width: 17%;
  }

  .showTable {
    width: 83%;
    padding-left: 10px;
  }
}

//公共按钮颜色
.submitSelect {
  color: #fff;
  background-color: #3671e8;
  border-color: #3671e8;
}

.myTable {
  width: 100%;
}

.options {
  display: flex;
  justify-content: space-evenly;

  span {
    color: #3671e8;
    cursor: pointer;
  }

  span:hover {
    color: #b9cbf0;
  }
}

::v-deep .el-select__wrapper {
  width: 240px !important;
}

::v-deep .el-range-editor.el-input__wrapper {
  width: 240px !important;
}
</style>