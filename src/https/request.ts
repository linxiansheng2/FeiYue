import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
const instance:AxiosInstance = axios.create({
  baseURL: 'https://www1.feiyueadmin.com/',
  timeout: 8000
})

import store from "@/store";
import { showToast } from "vant";
const langArray:any = {
  'zh':1,
  'en':2
}

var msg = '';
// 请求拦截器
instance.interceptors.request.use((config:any):any  => {
  config.headers.Authorization = sessionStorage.getItem("token");
  // const Languagetype:string | null = window.localStorage.getItem('language');
  // 获取浏览器语言或上一次记录的语言
  // const lang = (navigator.language || 'en').toLocaleLowerCase();
  // const language = localStorage.getItem('language') || lang.split('-')[0] || 'zh';
  if(store.getters.getUseloading){
    store.commit('setLoading',true);
  }
  msg = '';

  // config.headers['Languagetype'] = 1;
  return config
},(err: AxiosError) => {
    return new Promise((reject) => reject(err.response))
})

// 响应拦截器 
instance.interceptors.response.use((response:AxiosResponse) => {
  store.commit('setLoading',false);
  if(response.data){
    let {code} = response.data;
    switch(code){
      case 5001: msg = '未登录'; break;
      case 5003: msg = '未注册当前玩法'; break;
      case 4001: msg = '登录失败'; break;
      case 4002: msg = '重复代码'; break;
      case 4003: msg = '执行失败'; break;
      case 4004: msg = '参数不全'; break;
      case 4005: msg = '不允许'; break;
      case 4006: msg = '余额不足'; break;
      case 4007: msg = '金额过少'; break;
      case 4008: msg = '全局账号被冻结'; break;
      case 4009: msg = '当前玩法账号被冻结'; break;
      case 4010: msg = '金额过大'; break;
      case 400: msg = response.data?.msg; break;
      case 1001: msg = '质押_存在转账中质押'; break;
      default:break;
    }
    msg && showToast(msg);
  }
  return response.data ? response.data : response
},(err: AxiosError) => {
  return new Promise((reject) => reject(err.response))
})

export default instance
