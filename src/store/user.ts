import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo:{}
  }),
  actions: {
    SetUserStore(data: any) {
      console.log(data);
      
      this.userInfo = data;
    }
  }
  
})
