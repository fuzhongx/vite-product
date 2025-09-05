<template>
  <div class="contair">
    <!-- 时间展示 -->
    <div class="dayTime">
      <div>
        <el-form :inline='true' :rules="rules">
          <el-form-item label="起始时间" prop="dayValue">
            <el-date-picker type="datetimerange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
              v-model="dayValue" size style="width:100%" value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD"
              time-format="hh:mm:ss" :default-time=defaultTime editable />
          </el-form-item>
          <el-form-item>
            <el-button class="btnSelect">查询</el-button></el-form-item>
        </el-form>

      </div>
      <div class="nav">
        <ul>
          <li v-for="(item, i) in dayList" :key="i" @click="getMonthDays(item)" ref="liRef" class="getLi">{{ item.label
          }}</li>
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
import { ref, onMounted } from 'vue'
import { getToday, getYesterday, getThisMonth, getWeek, getHalfMoon } from '@/until/getToday.js'
const dayValue = ref()
const liRef = ref()

//日期格式
const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59),
]

//日期列表
const dayList = [
  {
    label: '今天',
    value: getToday()
  },
  {
    label: '昨天',
    value: getYesterday()
  },
  {
    label: '本月',
    value: getThisMonth()
  },
  {
    label: '近7天',
    value: getWeek()
  },
  {
    label: '近15天',
    value: getHalfMoon()
  },

]

//表单校验规则
const rules = {
  dayValue: [
    { required: 'true', message: '', trigger: 'blur' }
  ]
}

onMounted(() => {
  BgColor()
})

/**
 * getMonthDays 获取日期时间
 */
const today = ref('今天')
//设置默认选中
const BgColor = () => {
  let Uli = liRef.value
  for (let i = 0; i <= Uli.length - 1; i++) {
    if (today.value == Uli[i].innerText) {
      Uli[i].style.background = '#3671e8'
      Uli[i].style.color = '#fff'
    } else {
      Uli[i].style.background = ''
      Uli[i].style.color = ''
    }
  }
}

const getMonthDays = (day) => {
  today.value = day.label
  BgColor()
  dayValue.value=day.value
  console.log(dayValue.value);
  
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
    .btnSelect{
      background: #3671e8;
      color: #fff;
    }
  }
}
</style>