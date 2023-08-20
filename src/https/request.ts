  import { useToken} from '@/common/useToken';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
const instance:AxiosInstance = axios.create({
  baseURL: 'https://www1.feiyueadmin.com/',
  timeout: 13000
})
import router from '@/router';
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

// 请求拦截器
instance.interceptors.request.use((config:any):any  => {
  // 获取浏览器语言或上一次记录的语言
  const Languagetype:string = window.localStorage.getItem('language') || (navigator.language || 'en').toLocaleLowerCase().split('-')[0] || 'zh';
  // 获取token
  config.headers['Authorization'] = JSON.parse(sessionStorage.getItem('vuex') as any).userinfo.token;
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
    let {code} = response.data;    
    if(code == 5001){
      document.cookie = "cookieName=; path=/;";
      store.commit('setLogin',false);
      store.commit('setUserInfo',{});
      setTimeout(() => {
        router.push('/home');
      }, 200);
    }

    if(code != 200){
      showToast(response.data?.msg);
    }
  return response.data ? response.data : response
  
},(err: AxiosError) => {
  return new Promise((reject) => reject(err.response))
})

export default instance
