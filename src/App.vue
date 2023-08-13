<template>

  <Loading v-show="loading"/>
  <router-view/>
  <van-floating-bubble  axis="xy" @click="$router.go(0)">
    <img class="loading-img" src="./assets/silder/loading.png"/>
  </van-floating-bubble>
</template>
<script setup lang="ts">
  import {computed, onMounted} from 'vue'
  import {useStore} from 'vuex'
  import $api from '@/https'
  const $store = useStore();
  const loading = computed(()=>$store.state.loading);
  const WebConfig = computed(()=>$store.state.webconfig);
  var link:any = document.querySelector('link[rel*="icon"]');


  const getConfig = async () =>{
    if(WebConfig.value){
      link.href = WebConfig.value.h5_logo;
      document.title = WebConfig.value.h5_title;
      return;
    }
    try {
    const {data} = await $api.getfindConfigList();
      link.href = data.h5_logo;
      document.title = data.h5_title;
      $store.commit('setWebconfig',data);
    } catch (error) {
      console.log(error);
    }
  }

  onMounted(()=>{
    getConfig();
    $store.commit('setLoading',false);
  })

</script>
<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  --van-nav-bar-icon-color:block;
  --van-tabs-bottom-bar-color:transparent;
}
body{
  background: #F4F6F8;
  --van-floating-bubble-size:2rem;
  --van-popup-background:#666;
}
</style>
