<template>
  <div class="common-layout">
      <el-container>
          <el-aside :width="isCollapse == true ? '64px' : '200px'" >
              <el-menu default-active="2" class="el-menu-vertical-demo" :collapse="isCollapse" router ellipsis>
                  <el-menu-item index="/home">
                      <el-icon> <i-ep-upload-filled /></el-icon>
                      <template #title>
                          Navigator Four</template>
                  </el-menu-item>
                  <el-sub-menu index="1-4">
                      <template #title>
                          <el-icon>
                              <i-ep-location />
                          </el-icon>
                          <span>Navigator One</span>
                      </template>
                      <el-menu-item index="1-4-1">item one</el-menu-item>
                  </el-sub-menu>
                  <el-menu-item index="/table">
                      <el-icon>
                          <i-ep-setting />
                      </el-icon>
                      <span>Navigator Four</span>
                  </el-menu-item>
              </el-menu>
          </el-aside>
          <el-container>
              <el-header>
                  <Header />
              </el-header>
              <el-main><router-view></router-view></el-main>
          </el-container>
      </el-container>
  </div>
</template>

<script setup>
import Header from '@/view/Header.vue'
import bus from '@/until/bus.js'
import { onMounted, ref } from 'vue'
const isCollapse = ref(false)
bus.on('isCollapse', data => {
  isCollapse.value = data
})

onMounted(() => {

})

</script>

<style>
.common-layout,
.el-container {
  width: 100%;
  height: 100%;
}

.el-menu {
  /* width: 0px; */
  /* height:100vh; */
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  /* min-height: 100vh; */
}

.el-aside {
  /* height: 0px !important; */
  background: none;
  transition: width 0.2s;
}

.el-header {
  background: goldenrod;
}

.el-main {
  background: gainsboro;
}

@media(max-width:768px) {
  .el-aside {
      display: none;
  }
}
</style>