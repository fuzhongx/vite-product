<template>
  <div class="contair">
    <el-icon  style="font-size: 27px;" @click="handleIsCollapse"><i-ep-Expand /></el-icon>
  </div>
</template>

<script setup>
import bus from '@/until/bus.js'
import {ref} from 'vue'
const isCollapse=ref(false)
const handleIsCollapse=()=>{
    isCollapse.value=!isCollapse.value 
    bus.emit('isCollapse', isCollapse.value)
    console.log(isCollapse.value);
    
}
</script>
<style lang="scss" scoped>
.contair{
  height: 60px;
  line-height: 74px;
}
</style>
