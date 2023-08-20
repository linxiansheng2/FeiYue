<script lang="ts">
export default {
  name: 'service',
}
</script>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from  'vue-router'
import {useStore} from 'vuex'
const $store = useStore();
const route = useRoute();
const iframeSrc = ref<any>('');
let token = JSON.parse(sessionStorage.getItem('vuex') as string);
const loading = computed(()=>$store.state.loading);

$store.commit('setLoading',true);
const  loadFrameFn = () => {
    // 在iframe渲染之前将高度设置0
    const iframe:any = document.querySelector('#iframe');
    iframe.style.height = 0;
    console.log(token,route,'sbcxk');
    
    iframeSrc.value = token.login ? route.meta.link + '&nickName=' + token['userinfo'].token : route.meta.link;
    // 监听iframe渲染dom的节点
    iframe.onload = function () {
      // 在内嵌页面渲染完成后，通过定时器再设置页面高度，注意：定时器必须加，毫秒单位不能为0
      setTimeout(() => {
        iframe.style.height = '100vh';
        $store.commit('setLoading',false);
      }, 500)
    }
}

onMounted(()=>{
  loadFrameFn();
})
</script>

<template>
  <div>
    <Loading v-show="loading"/>
    <div id="iframe-container">
      <iframe :src="iframeSrc" scrolling="auto" frameborder="0" class="trend-container2" width="100%" id="iframe"></iframe>
    </div>
  </div>
</template>

<style scoped lang="less">

</style>