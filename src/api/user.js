import axios from '@/until/requerts'


//用户部门
export const getDept=params=>axios.get('/system/user/deptTree',params)

//用户获取表格数据
export const getUserTable=params=>axios.get('/system/user/list',{params})

//用户查询
// export function getUserSelect(params){
//     return axios({
//         url:'/system/user/list',
//         method:'get',
//         params
//     })
// }
export const getUserSelect=params=>axios.get('/system/user/list',{params})