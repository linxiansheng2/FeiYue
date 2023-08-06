import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate';

export default createStore({
  state: {
    loading:true,   //全局加载动画
    login:false,    //登录状态
    userinfo:{},    //用户信息
    useLoading:true,//启用加载动画
    silderData:""
  },
  getters: {
    getUseloading(state){
      return state.useLoading;
    }
  },
  mutations: {
    setLoading(state,params){
      state.loading = params
    },
    setLogin(state,params){
      state.login = params
    },
    setUserInfo(state,params){
      state.userinfo = params
    },
    setUseLoading(state,params){
      state.useLoading = params;
    },
    setSilderData(state,params){
      state.silderData = params;
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
            silderData:val.silderData
          }
        }
    })
]
})
