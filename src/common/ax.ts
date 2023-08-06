import axios from 'axios'
const instance = axios.create({
  baseURL: 'http://w2.feiyue688.com/' // 设置默认api地址
})
// 添加请求拦截器
instance.interceptors.request.use(config => {
	
	//console.log(token);
	config.headers.Authorization = localStorage.getItem("token");
  // 在发送请求之前做些什么
  return config
}, error => {
  // 对请求错误做些什么
  return Promise.reject(error)
})
// 添加响应拦截器
instance.interceptors.response.use(response => {
  // 对响应数据做点什么
  return response.data
}, error => {
  // 对响应错误做点什么
  return Promise.reject(error)
})
export default instance