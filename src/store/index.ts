import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate';
import $api from '@/https'
export default createStore({
  state: {
    loading:true,   //全局加载动画
    login:false,    //登录状态
    userinfo:{},    //用户信息
    useLoading:true,//启用加载动画
    webconfig:"",
  },
  getters: {
    getUseloading(state){
      return state.useLoading;
    },
    getUserinfo(state){
      return state.userinfo;
    },
  },
  mutations: {
    setLoading(state,params){
      state.loading = params
    },
    // 更新登录状态
    setLogin(state,params){
      state.login = params
    },
    setUserInfo(state,params){
      state.userinfo = params
    },
    setUseLoading(state,params){
      state.useLoading = params;
    },
    setWebconfig(state,params){
      state.webconfig = params
    }
  },
  actions: {
  },
  modules: {
  },
  //持久化数据
  plugins: [
    createPersistedState({
        storage: window.sessionStorage,
        // 只保存State的数据
        reducer(val) {
          return {
            login:val.login,
            userinfo:val.userinfo,
            webconfig:val.webconfig
          }
        }
    })
]
})
