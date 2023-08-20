<script lang="ts">
export default {
  name: 'invite',
}
</script>
<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from  'vue-router'
import { useStore } from 'vuex'

const route = useRoute();
const router = useRouter();
const $store = useStore();

$store.commit('setLoading',true);

onMounted(()=>{
    let {id} = route.params;
    localStorage.setItem('ycode',id as any);
    setTimeout(() => {
      $store.commit('setLoading',false);
      router.push('/');
    }, 1500);
})
</script>

<template>
  <div>
    
  </div>
</template>

<style scoped lang="less">

</style>