import axios from '@/until/requerts'

//登录
export const login=data=>axios.post('/login',data)

//验证码
export const captchaApi=params=>axios.get('/captchaImage',params)

//获取路由
export const getRouters=params=>axios.get('/getRouters',params)