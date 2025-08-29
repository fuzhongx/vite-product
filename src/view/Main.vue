<template>
    <div class="common-layout">
        <el-container>
            <el-aside :width="isCollapse == true ? '64px' : '200px'">
                <el-menu default-active="2" class="el-menu-vertical-demo" :collapse="isCollapse" router ellipsis>
                    <template v-for="v in nav" :key="v.name">
                        <el-menu-item :index="`/${v.children[0].path}`" v-if="getRoutes(v)" @click="getR(v.children[0].path)">
                            {{ v.children.meta }}
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
                                @click="getMenuIndex(childs.path)">{{ childs.meta?.title }}</el-menu-item>
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
import {mainStore} from '@/store/index.js'
import {storeToRefs} from 'pinia'//响应式处理

const store=mainStore()//获取缓存数据
const {nav}=storeToRefs(store)//结构并使数据具有响应式

const isCollapse = ref(false)

// const menuRoutes = ref()

bus.on('isCollapse', data => {
    isCollapse.value = data
})
const getR=(v)=>{
console.log(v);

}

const getRoutes = (v) => {
    if (v.path === '/') {
        return v.children
    }
}
const getMenuIndex = (a) => {
    console.log(a,'触发了');
    
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
    /* width: 0px; */
    /* height:100vh; */
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    /* min-height: 100vh; */
}

.el-aside {
    width: auto !important;
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