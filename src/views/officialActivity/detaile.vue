<script lang="ts">
export default {
  name: 'detaile',
}
</script>
<script setup lang="ts">
import { ref, reactive,onMounted } from 'vue'
import { useRoute } from  'vue-router'
import $api from '@/https'
import dayjs from 'dayjs';
const route = useRoute() // this.$route
const loading = ref<boolean>(true);
const Store:any = reactive({data:{
  id:'',
  data:''
}})
const createtime=ref<any>(0)
const timeend=ref<any>(0)
  const nowdate=ref<any>(0)
const getbulletin = async (id:number) => {
  const res = await $api.getbulletin(id);
  if(res && res.code == 200){
    Store.data.data = res.data1;
    createtime.value=dayjs(Store.data.data.create_time).unix();
    timeend.value=dayjs(Store.data.data.time_end).unix()*1000; //结束时间
    nowdate.value=dayjs().valueOf() //当前时间
    time.value= timeend.value-nowdate.value//结束时间减去当前时间
    // console.log(time.value,'zong');
    // console.log(nowdate.value,'当前',timeend.value);
    loading.value = true;
  }
}
//倒计时
const time = ref<any>(30 * 60 * 60 * 1000);
onMounted(()=>{
  let {id} = route.params;
  if(id){
    getbulletin(Number(id));
  }
})
</script>

<template>
 <div class="layout" v-if="loading">
    <div class="main">
        <div><img class="main_img" :src=Store.data.data.img alt=""></div>
      <div class="main-tit">
        <h1 class="title">{{ Store.data.data.title }}</h1>
       <div>
        <span class="time">{{ Store.data.data.create_time }}</span>——
        <span class="time">{{ Store.data.data.time_end }}</span>
       </div>
      </div>
      <div class="main-info">
        <div class="rich_cxk" v-html="Store.data.data.body"></div>
      </div>
    </div>
  </div>
  <div v-if="nowdate>timeend" class="timercxcka">
      <div class="timer">已结束</div>
  </div>
  <div class="timercxcka" v-else>
    <div class="timer">
    <span>{{$t('officialActivity_detaile.officialActivity_detaile1')}}：</span>
    <van-count-down :time="time" :format="`DD ${$t('officialActivity_detaile.officialActivity_detaile2')} HH ${$t('officialActivity_detaile.officialActivity_detaile3')}mm${$t('officialActivity_detaile.officialActivity_detaile4')}ss${$t('officialActivity_detaile.officialActivity_detaile5')}`" />
  </div>
  </div>
</template>

<style scoped lang="less">
:deep(.rich_cxk img){
  width: 100%;
}
@padding:8px;
.layout{
  padding: 12px 15px;
  .main{
    border-radius: 10px;
    background-color: #fff;
    .main_img{
        width: 100%;
        height: 154px;
    }
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
      .rich_cxk img{
        width: 100%;
      }
    }
  }
}
.timer{
  height: 48px;
    background: #2850e7;
    border-radius: 14px;
    color: #fff;
    font-weight: 500;
    font-size: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 52px;
    margin-bottom: 76px;
    width: 90%;
    
    .van-count-down{
      color: #fff;
    } 
}
.timercxcka{
  display: flex;
  justify-content: center;
}
</style>