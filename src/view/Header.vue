<template>
  <div class="contair">
    <div class="header">
      <div> <el-icon style="font-size: 27px;" @click="handleIsCollapse"><i-ep-Expand /></el-icon></div>
      <div class="bread">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }" >{{store.nav}}</el-breadcrumb-item>
          <!-- <el-breadcrumb-item></el-breadcrumb-item> -->
        </el-breadcrumb>
      </div>

    </div>
    <div class="nav"></div>
  </div>
</template>

<script setup>
import bus from '@/until/bus.js'
import { ref } from 'vue'
import {mainStore} from '@/store/index.js'
const store=mainStore()

const navList=ref()
navList.value=store.nav?? ''

const isCollapse = ref(false)
const handleIsCollapse = () => {
  isCollapse.value = !isCollapse.value
  bus.emit('isCollapse', isCollapse.value)
  console.log(isCollapse.value);

}
</script>
<style lang="scss" scoped>
.contair {
  .header {
    display: flex;
    height: 50px;
    line-height: 64px;
    border-bottom: 1px solid #e4edf9;
    box-shadow: 0px 1px 0px #e4edf9;
    padding: 0 20px !important;
    .bread{
      display: flex;
      justify-content: center;
      align-items: center;
      padding-left: 20px;
    }
  }

  .nav {
    height: 30px;
  }
}
</style>
