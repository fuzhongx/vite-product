<template>
  <MyForm v-bind="formConfig" v-model="FormData"></MyForm>
</template>

<script setup>
import MyForm from '@/components/myForm/myForm.vue'
import formConfig from '@/until/table.js'
import {ref} from 'vue'

// 配置中取出表单项
const formItem = formConfig.formItem ?? [] //空值合并操作符

// 遍历拿到设置model项
const data = {}
formItem.map(v => {
    data[v.feild] = ''
})

// 转换为响应式
const FormData = ref(data)
</script>

<style scoped>

</style>