<template>
    <el-form :inline="inline" ref="ruleFormRef" :label-width="labelWidth" :model="modelValue" :rules="rules">
        <template v-for="(v, i) in formItem" :key="i">
            <el-form-item :label="v.label" :prop="v.feild">
                <!-- 输入框 -->
                <template v-if="v.type === 'input' || v.type === 'password'">
                    <el-input :placeholder="v.placeholder" :show-password="v.type === 'password'"
                        v-model="modelValue[v.feild]" />
                </template>
                <!-- 验证码 -->
                <template v-if="v.type === 'captchaKey'">
                    <el-input :placeholder="v.placeholder" v-model="modelValue[v.feild]">
                        <template #append>
                            <slot name="src"></slot>
                        </template>
                    </el-input>

                </template>
                <!-- 下拉框 -->
                <template v-else-if="v.type === 'select'">
                    <el-select :placeholder="v.placeholder" v-model="modelValue[v.feild]">
                        <el-option :label="opt.label" :value="opt.value" v-for="opt in v.options()" :key="opt.value" />
                    </el-select>
                </template>

                <!-- 时间日期
                <template v-else-if="v.type === 'date'">
                    <el-date-picker type="date" :placeholder="v.placeholder" style="width: 100%"
                        v-model="modelValue[v.feild]" />
                </template> -->
                <!-- 时间日期 -->
                <template v-else-if="v.type === 'datetimerange'">
                    <el-date-picker type="datetimerange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
                        v-model="modelValue[v.feild]" size style="width:100%" value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD"
                        time-format="hh:mm:ss" :default-time=defaultTime editable clearable/>
                </template>

                <!-- 开关按钮 -->
                <template v-else-if="v.type === 'switch'">
                    <el-switch v-model="modelValue[v.feild]" />
                </template>

                <!-- 多选按钮 -->
                <template v-else-if="v.type === 'checkbox'">
                    <el-checkbox-group v-model="modelValue[v.feild]">
                        <el-checkbox label="Online activities" name="type" />
                        <el-checkbox label="Promotion activities" name="type" />
                    </el-checkbox-group>
                </template>

                <!-- 单选按钮 -->
                <template v-else-if="v.type == 'date'">
                    <el-radio-group v-model="modelValue[v.feild]">
                        <el-radio label="Sponsor" />
                        <el-radio label="Venue" />
                    </el-radio-group>
                </template>

                <!-- 文本框备注 -->
                <template v-else-if="v.type == 'textarea'">
                    <el-input type="textarea" v-model="modelValue[v.feild]" />
                </template>
            </el-form-item>
        </template>
        <el-form-item style="margin: 0px !important;">
            <slot name="un_username"></slot>
        </el-form-item>
        <el-form-item>
            <slot name="userButton"></slot>
        </el-form-item>
        <el-form-item>
            <slot name="footer"></slot>
        </el-form-item>
    </el-form>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({
    formItem: {
        type: Object
    },
    inline: {
        type: Boolean,
    },
    labelWidth: {
        type: String,
        default: '120px'
    },
    modelValue: {
        type: Object,
    },
    rules: {
        type: Object
    }
})
const ruleFormRef = ref()
const defaultTime = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59),
] 

//默认重置
const resetForm = () => {
    ruleFormRef.value?.resetFields()  //?.链判断运算符
}

// 暴露方法
defineExpose({
    resetForm
})

</script>

<style>
.el-input-group__append {
    background-color: var(--el-fill-color-blank);
    width: 100px !important;
    padding: 0 !important;
}

.el-form--inline .el-form-item__label {
    color: #606266;
    font-weight: bold;
}
</style>