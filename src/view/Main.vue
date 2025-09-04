<template>
    <div class="common-layout">
        <el-container>
            <el-aside :width="isCollapse === true ? '65px' : '250px'">
                <el-menu default-active="2" class="el-menu-vertical-demo" :collapse="isCollapse" router ellipsis>
                    <el-menu-item style="display:flex;justify-content: center;">
                        <el-icon> <i-ep-upload-filled /></el-icon>
                        <template #title><span style="font-weight: bold;font-size: 18px;">云麦数字工厂</span></template>
                    </el-menu-item>
                    <template v-for="v in menuNav" :key="v.name">
                        <el-menu-item :index="`/${v.children[0].path}`" v-if="getRoutes(v)"
                            @click="getR(v.children[0])">
                            <!-- {{ v.children.meta }} -->
                            <el-icon> <i-ep-upload-filled /></el-icon>
                            <template #title> {{ v.children[0].meta?.title }}</template>
                        </el-menu-item>
                        <el-sub-menu :index=v.path v-else>
                            <template #title>
                                <el-icon>
                                    <i-ep-location />
                                </el-icon>
                                <span>{{ v.meta?.title }}</span>
                            </template>
                            <el-menu-item :index=childs.path v-for="childs in v.children" :key="childs.name"
                                @click="getMenuIndex(childs)">{{
                                    childs.meta?.title }}</el-menu-item>
                        </el-sub-menu>
                    </template>
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
import { getRouters } from '@/api/login.js'
import { onMounted, reactive, ref } from 'vue'
import { mainStore } from '@/store/index.js'
import { storeToRefs } from 'pinia'//响应式处理

const store = mainStore()//获取缓存数据
const { menuNav } = storeToRefs(store)//结构并使数据具有响应式

const isCollapse = ref(false)

// const menuRoutes = ref()

bus.on('isCollapse', data => {
    isCollapse.value = data
})
const getR = (v) => {
    console.log(v, 'l')
    store.setRouter(v)
    console.log(store, 'kk');

}

const getRoutes = (v) => {
    if (v.path === '/') {
        return v.children
    }
}
const getMenuIndex = (a) => {
    console.log(a, '触发了');

}

onMounted(async () => {
    // const { data: { data } } = await getRouters()
    // menuRoutes.value = data
})

</script>

<style>
.common-layout,
.el-container {
    width: 100%;
    height: 100%;
}

.el-menu {
    transition: all 80ms;
    background: #104697;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: auto !important;
    height: 100vh;
}

.el-menu--collapse {
    width: auto !important;
    height: 100vh;
}

.el-sub-menu__title * {
    color: #fff !important;
}

.el-menu-item {
    color: #fff !important;
}

.el-sub-menu__title:hover {
    background: #051940 !important;
}

.el-menu-item:hover {
    background: #051940 !important;
}

.el-menu-item:active {
    background: #051940 !important;
}

.el-menu-item:focus {
    background: #051940 !important;
}

.el-aside { 
    transition: width 0.3s;
    /* transition: width 0.25s;
    -webkit-transition: width 0.25s;
    -moz-transition: width 0.25s;
    -o-transition: width 0.25s; */
}

.el-header {
    height: 80px;
    padding: 0px !important;
    border-bottom: 1px solid #d8dce5;
    box-shadow: 0px 1px 1px #d8dce5;
    ;
}

.el-main {
    padding: 10px !important;
}

@media(max-width:768px) {
    .el-aside {
        display: none;
    }
}
</style>