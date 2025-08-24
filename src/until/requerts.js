import axios from "axios";

//配置地址
const service = axios.create({
  baseURL: "https://www.cp-mes.cn/prod-api/",
  timeout: 5000,
});
const token= localStorage.getItem('token')
//请求拦截器
service.interceptors.request.use((config) => {
  if(token){
    config.headers['Authorization']='Bearer ' + token
  }

  return config;
}),
  (error) => {
    return Promise.reject(error);
  };

//响应拦截器
service.interceptors.response.use((response) => {
  return response;
}),
  (error) => {
    return Promise.reject(error);
  };

  export default service
