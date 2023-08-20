<template>

  <Loading v-show="loading"/>
  <router-view/>
  <van-floating-bubble  axis="xy" @click="$router.go(0)" :gap="10" v-model:offset="offset2">
    <img class="loading-img" src="./assets/silder/loading.png"/>
  </van-floating-bubble>
  <van-floating-bubble v-if="$route.name != 'cusservice'" v-model:offset="offset" axis="xy" icon="chat" @click="$router.push('/service')" :gap="10" />
  <van-floating-bubble v-else v-model:offset="offset" axis="xy" icon="home-o" @click="$router.push('/home')" :gap="10" />
</template>
<script setup lang="ts">
  import {computed, onMounted, ref , onUnmounted} from 'vue'
  import {useStore} from 'vuex'
  import $api from '@/https'
  const $store = useStore();
  const loading = computed(()=>$store.state.loading);
  const WebConfig = computed(()=>$store.state.webconfig);
  var link:any = document.querySelector('link[rel*="icon"]');
  const offset = ref({ x: -1, y: -1 });
  const offset2 = ref({});
  
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

  // const onsupport = () => {
  //   var link = 'https://a1.feiyuechat.com/chat/index?noCanClose=1&token=be790a8ed6e1b7890cfe2afd8696294c';
  //   let token = JSON.parse(sessionStorage.getItem('vuex') as string);
  //   if(token && token['userinfo'].token){
  //     link = link + '&nickName=' + token['userinfo'].token;
  //   }
  //   window.open(link)
  // }

  onMounted(()=>{
    offset2.value = {
      x:window.innerWidth - 42,
      y:window.innerHeight - 80
    }
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
}
body{
  background: #F4F6F8;
}
:root:root{
  --van-overlay-background:rgba(0, 0, 0, .5);
  --van-floating-bubble-size:2rem;
  --van-popup-background:#666;
  --van-floating-bubble-icon-size:20px;
  --van-floating-bubble-background:#4A43E9;
  --van-nav-bar-icon-color:block;
  --van-tabs-bottom-bar-color:transparent;
}
</style>
