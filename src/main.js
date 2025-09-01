import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from '@/router/router.js'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import { createPinia } from 'pinia'
const pinia=createPinia()

const app=createApp(App)
app.use(pinia)
app.use(router)
app.use(ElementPlus,{locale:zhCn})


app.mount('#app')

