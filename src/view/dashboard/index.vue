<template>
  <div class="contair">
    <!-- 时间展示 -->
    <div class="dayTime">
      <div>
        <el-form inline='false' :rules="rules">
          <el-form-item label="起始时间" prop="dateValue">
            <el-date-picker type="datetimerange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
              v-model="dateValue" size style="width:100%" value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD"
              time-format="hh:mm:ss" :default-time=defaultTime editable @change="getTime" />
          </el-form-item>
          <el-form-item>
            <el-button>查询</el-button></el-form-item>
        </el-form>

      </div>
      <div class="nav">
        <ul>
          <li v-for="(item, i) in dayList" :key="i" @click="getMonthDays(item)" ref="liRef" class="getLi">{{ item.label }}</li>
        </ul>
      </div>
    </div>
    <!-- 各工单列表数量展示 -->
    <div class="navList"></div>
    <!-- 工单进度表 -->
    <div class="classTable"></div>
    <!-- 计划与产出 -->
    <div class="play"></div>
  </div>

</template>

<script setup>
import { ref } from 'vue'
const dateValue = ref()
const liRef = ref()
const dayList = [
  {
    label: '今天',
    value: 0
  },
  {
    label: '昨天',
    value: -1
  },
  {
    label: '本月',
    value: 30
  },
  {
    label: '近7天',
    value: 7
  },
  {
    label: '近15天',
    value: 15
  },

]
const rules = {
  dateValue: [
    { required: 'true', message: '', trigger: 'blur' }
  ]
}

const getMonthDays = (day) => {
  console.log(day)
  dayList.forEach(e => {
    if (day.value == e.value) {
      document.querySelector('.getLi').style.background='red'
      // console.log( document.querySelector('.getLi'));
      
      // liRef.value.style.background='red'
      // console.log(e.value, '日期');
    } else {
      // console.log('不是');
        // document.querySelector('.getLi').style.background='#fff'
    }

  })


}
</script>

<style lang="scss" scoped>
.contair {
  width: 100%;
  height: 100%;

  .dayTime {
    display: flex;
    justify-content: space-between;
    height: 50px;

    .nav {
      ul {
        display: flex;

        li {
          width: 80px;
          height: 36px;
          text-align: center;
          cursor: pointer;
          line-height: 36px;
          border-right: 1px solid #eff0f2;
          border-top: 1px solid #eff0f2;
          border-bottom: 1px solid #eff0f2;
          list-style: none;
        }

        li:nth-child(1) {
          border-top-left-radius: 5px;
          border-bottom-left-radius: 5px;
          border-left: 1px solid #eff0f2;
          ;
        }

        li:last-child {
          border-top-right-radius: 5px;
          border-bottom-right-radius: 5px;
          border-right: 1px solid #eff0f2;
          ;
        }

        li:hover {
          color: #3671e8;
        }

        li:focus {
          background-color: #3671e8;
        }
      }
    }
  }
}
</style>