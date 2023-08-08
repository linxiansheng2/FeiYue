<script lang="ts">
export default {
  name: 'trade',
}
</script>
<script setup lang="ts">
import { ref, reactive,onMounted,onUnmounted} from 'vue'
import $api from '@/https'
import { useStore } from 'vuex'
const $store = useStore();

const Store:any = reactive({data:{
    active:true,
    state:3,            //3=持仓中 4=已完成
    loading:false,      //是否处于加载状态
    finished:false,     //是否已加载完成，加载完成后不再触发 load 事件
    pageNum:1,          //当前页数
    pageSize:10,        //单页最大值
    list:[],            //订单列表
}})

/**
 * 
 * @param val 启用tab
 * @param state 3=持仓中 4=已完成
 */
const onChange = (val:boolean,state:number) => {
    Store.data.state = state;
    Store.data.active = val;
    Store.data.pageNum = 1;
    Store.data.list = []
    Store.data.finished = false;
    Store.data.loading = true;
    onLoad();
}


const onLoad = async () => {
    let res = await $api.getQQJYOrderList(Store.data.state,Store.data.pageNum,Store.data.pageSize);
    if(res && res['code'] == 200){
        Store.data.list.push(...res.rows);
        // 加载状态结束
        Store.data.loading = false;
        if(res.rows.length < res.total || !res.rows.length){
            // 数据全部加载完成
            Store.data.finished = true;
        }else{
            Store.data.pageNum+=1;
        }
    }
    $store.commit('setUseLoading',false);
}

// 组件销毁时启用全局加载
onUnmounted(()=>{
  $store.commit('setUseLoading',true);
})

</script>

<template>
  <div class="page-main">
    <div class="trade-tab" >
      <div class="trade-item" :class="{'active':Store.data.active}" @click="()=>{onChange(true,3)}">Holding detail</div>
      <div class="trade-item" :class="{'active':!Store.data.active}" @click="()=>{onChange(false,4)}">History detail</div>
    </div>
    <Cus-Card marginTop="30">
      <div class="trade-list">
        <van-empty image-size="10rem" description="No record" />
      </div>
    </Cus-Card>

        <Cus-Card padding="15">
        <van-list
            v-model:loading="Store.data.loading"
            :finished="Store.data.finished"
            finished-text="没有更多了"
            @load="onLoad"
            >
            <div class="order-list">
                <div class="order-item" v-for="(item,index) in Store.data.list" :key="item.id">
                    <div class="left">
                        <div class="title">{{`${Store.data.changeValue?'充值':'提现'}金额:${item.money}`}}</div>
                        <div class="time">{{ item.create_time }}</div>
                    </div>
                    <div class="right">
                        <div class="title">状态</div>
                        <div class="state" 
                        :class="{
                        'wsh':item.State == 0,
                        'on':item.State == 1,
                        'off':item.State == 2,
                        }"
                        >{{ item.State?(item.State == 1 ? 'Approve' :'Refuse'):'Unaudited'}}</div>
                    </div>
                </div>
            </div>
        </van-list>
    </Cus-Card>
  </div>
</template>

<style scoped lang="less">
.page-main{
  padding-top: 20px;
}
.trade-tab{
  display: flex;
  flex: 0 0 50%;
  justify-content: center;
  padding: 0 25px;
  .trade-item{
    background: #fff;
    box-shadow: 0 3px 25px rgba(0,0,0,.1);
    border-radius: 5px;
    text-align: center;
    line-height: 44px;
    font-size: 17px;
    font-weight: 500;
    color: #3b3e4e;
    padding: 0 5px;
    height: 44px;
    width: 100%;
  }
  .trade-item.active{
    color: #fff;
    background: #2850E7;
  }
}
</style>