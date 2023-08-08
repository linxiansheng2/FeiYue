import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
const instance:AxiosInstance = axios.create({
  baseURL: 'https://www1.feiyueadmin.com/',
  timeout: 8000
})

import store from "@/store";
import { showToast } from "vant";
const langArray:any = {
  'zh':0,   //繁体中文
  'en':1,   //英语
  'jap':2,  //日语
  'kr':3,   //韩语
  'fr':4,   //法语
  'rus':5,  //俄语
  'ger':6,   //德语
  'es':7,   //西班牙语
}

var msg = '';
// 请求拦截器
instance.interceptors.request.use((config:any):any  => {
  // 重置全局响应massage
  msg = '';
  // 获取浏览器语言或上一次记录的语言
  const Languagetype:string = window.localStorage.getItem('language') || (navigator.language || 'en').toLocaleLowerCase().split('-')[0] || 'zh';
  // 获取token
  config.headers['Authorization'] = sessionStorage.getItem("token");
  config.headers['Languagetype'] = langArray[Languagetype];
  // 允许启用全局加载动画
  if(store.getters.getUseloading){
    store.commit('setLoading',true);
  }
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
    if(code == 5001){
      sessionStorage.removeItem('vuex')
    }
  }

  return response.data ? response.data : response
},(err: AxiosError) => {
  return new Promise((reject) => reject(err.response))
})

export default instance
