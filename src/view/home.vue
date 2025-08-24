<template>
    <MyForm v-bind="formConfig" v-model="FormData" ref="myFormRef">
        <template #header>
            <h3>表单数据</h3>
        </template>
        <template #footer>
            <el-button type="primary">提交</el-button>
            <el-button type="primary" @click="reset">重置</el-button>
        </template>
    </MyForm>
</template>

<script setup>
import MyForm from '@/components/myForm/myForm.vue'
import formConfig from '@/components/myForm/myForm.js'

import { reactive, ref } from 'vue'

// 配置中取出表单项
const formItem = formConfig.formItem ?? [] //空值合并操作符

// 遍历拿到设置model项
const data = {}
formItem.map(v => {
    data[v.feild] = ''
})

// 转换为响应式
const FormData = ref(data)

const myFormRef=ref()

const reset=()=>{
    myFormRef.value?.resetForm()
}


</script>

<style scoped></style>