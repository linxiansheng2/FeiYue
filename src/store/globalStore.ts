import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', {
  state: () => ({
    PageLoading:true
  }),
  actions: {
    SetPageLoadStore(data: any) {
      this.PageLoading = data
    }
  }
})
