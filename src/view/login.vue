<template>
    <div class="constair">
        <div class="myforms">
            <div class="FormCenter">
                <MyForm v-bind="formConfig" v-model="FormData" ref="myFormRef">
                    <template #src>
                        <img :src="'data:image/jpeg;base64,' + keyWord.imgs" class="imgsKey" />
                    </template>
                    <template #un_username>
                        <el-checkbox v-model="un_username" label="记住账号" @change="checkUserName" class="un-username" />
                    </template>
                    <template #footer>
                        <el-button type="primary" @click="loginSubmit(myFormRef)">登录</el-button>
                        <el-button type="primary" @click="reset">重置</el-button>
                    </template>
                </MyForm>
            </div>

        </div>
    </div>

</template>

<script setup>
import MyForm from '@/components/myForm/myForm.vue'
import formConfig from '@/until/login.js'
import { captchaApi, login } from '@/api/login.js'

import { useRouter } from 'vue-router'
import { reactive, ref, onMounted } from 'vue'
const router = new useRouter()

/**
 * @params un_username 保存密码
 */
const un_username = ref()

const myFormRef = ref()

// 配置中取出表单项
const formItem = formConfig.formItem ?? [] //空值合并操作符

// 遍历拿到设置model项
const data = {}
formItem.map(v => {
    data[v.feild] = ''
})

// 转换为响应式
const FormData = ref(data)

const keyWord = reactive({
    imgs: '',
    uuid: ''
})

onMounted(() => {
    captchaKey()
    if (localStorage.getItem('username')) {
        un_username.value = true
    } else {
        un_username.value = false
    }
    FormData.value.password = localStorage.getItem('password')
    FormData.value.username = localStorage.getItem('username')
})

/**
 * 
 * @param v 记住账号,保存本地
 */
const checkUserName = (v) => {
    if (v) {
        localStorage.setItem('username', FormData.value.username)
        localStorage.setItem('password', FormData.value.password)
    } else {
        localStorage.removeItem('username')
        localStorage.removeItem('password')
    }

}

/**
 * @property loginSubmit() 提交登录
 */
const imgs = ref()
const loginSubmit = () => {
    captchaKey()
    const loginForm = reactive({
        code: FormData.value.code,
        password: FormData.value.password,
        username: FormData.value.username,
        tenantId: "000000",
        uuid: keyWord.uuid
    })
    login(loginForm).then(res => {
        if (res.data.code == 200) {
            localStorage.setItem('token', res.data.data.token)
            router.push('/main')
        } else {
            ElMessage.error(res.data.msg)
        }

    }).catch(error => {
        ElMessage.error(error)
    })

}
const captchaKey = () => {
    captchaApi().then(cres => {
        keyWord.imgs = cres.data.data.img
        keyWord.uuid = cres.data.data.uuid
    })
}


const reset = () => {
    myFormRef.value?.resetForm()
}

</script>

<style scoped>
::v-deep .el-form-item {
    margin-bottom: 30px;
}

::v-deep .el-form-item--label-right .el-form-item__label {
    color: #fff;
}

.constair {
    height: 100%;
    background: #97bfee;
    display: flex;
    align-items: center;
}

.myforms {
    width: 100%;
    height: 30%;
    background: #277fe4;
    padding-top: 30px;
}

.FormCenter {
    color: #fff;
    width: 25%;
    height: 100%;
    margin: 0px auto;
}

.imgsKey {
    width: 100px;
    height: 32px;
}

::v-deep .el-checkbox__input.is-checked+.el-checkbox__label {
    color: #fff !important;

}
</style>