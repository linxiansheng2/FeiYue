<script lang="ts">
export default {
  name: 'articleDetails',
}
</script>
<script setup lang="ts">
import { ref, reactive,onMounted } from 'vue'
import { useRoute } from  'vue-router'
import $api from '@/https'
const route = useRoute() // this.$route
const loading = ref<boolean>(true);
const Store:any = reactive({data:{
  id:'',
  data:''
}})

const getBulletinDetail = async (id:number) => {
  const res = await $api.getBulletinDetail(id);
  if(res && res.code == 200){
    Store.data.data = res.data1;
    loading.value = true;
  }
}


onMounted(()=>{
  let {id} = route.params;
  if(id){
    getBulletinDetail(Number(id));
  }
})
</script>

<template>
  <div class="layout" v-if="loading">
    <div class="main">
      <div class="main-tit">
        <h1 class="title">{{ Store.data.data.title }}</h1>
        <p class="time">{{ Store.data.data.create_time }}</p>
      </div>
      <div class="main-info">
        <div v-html="Store.data.data.body"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
@padding:8px;
.layout{
  padding: 12px 15px;
  .main{
    border-radius: 10px;
    background-color: #fff;
    .main-tit{
      padding: @padding;
      border-bottom: 0.5px solid #f0f0f0;
      .title{
        font-size: 16px;
        font-weight: 700;
        margin-bottom: 4px;
        color: #4d4d4d;
        line-height: 150%;
      }
      .time{
        font-weight: 400;
      font-size: 12px;
      line-height: 150%;
      color: #666;
      }
    }
    .main-info{
      padding: @padding;
    }
  }
}
</style>