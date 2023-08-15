<script lang="ts">
export default {
  name: 'history',
}
</script>
<script setup lang="ts">
import { onMounted ,reactive,onUnmounted} from 'vue'
import $api from '@/https'
import {useStore} from 'vuex'
import { useI18n } from 'vue-i18n'
const { locale , t } = useI18n();
const $store = useStore();
const Store:any = reactive({data:{
    userMoney:{},
    pgloading:false,    //是否渲染页面
    loading:false,      //是否处于加载状态
    changeValue:true,   //切换tab
    finished:false,     //是否已加载完成，加载完成后不再触发 load 事件
    showChange:true,    //
    pageNum:1,          //当前页数
    pageSize:10,        //单页最大值
    list:[],            //充提记录
}})


const onChange = (val:boolean) => {
    Store.data.changeValue = val;
    Store.data.pageNum = 1;
    Store.data.list = []
    Store.data.finished = false;
    Store.data.loading = true;
    onLoad()
}


const onLoad = async () => {
    let res:any,total:any;
    if(Store.data.changeValue){
        res = await $api.getUserRechargelist(Store.data.pageNum,Store.data.pageSize);
    }else{
        res = await $api.getUserWithdrawlist(Store.data.pageNum,Store.data.pageSize);
    }
    if(res && res['code'] == 200){
        Store.data.list.push(...res.rows);
        // 加载状态结束
        Store.data.loading = false;
        total = parseInt(String((res['total'] + Store.data.pageSize -1 ) / Store.data.pageSize));
        if(Store.data.pageNum == total){
            // 数据全部加载完成
            Store.data.finished = true;
        }else{
            Store.data.pageNum+=1;
        }
    }
    $store.commit('setUseLoading',false);
}

const getMoney = async () => {
    const res = await $api.getMoney('all');
    Store.data.userMoney = res;
    Store.data.pgloading = true;
}

onMounted(()=>{
    getMoney();
})

// 组件销毁时启用全局加载
onUnmounted(()=>{
  $store.commit('setUseLoading',true);
})
</script>

<template>
  <div class="cus-card-box" v-if="Store.data.pgloading">
    <Cus-Card padding="20">
        <div class="top-content">
            <!-- <img class="logo" :src="getAssetURL('assetcenter/depositico1.png')" alt="logo"> -->
            <span class="name">USDT</span>
        </div>
        <van-divider />
        <div class="bottom-content">
            <div class="bottom-item left">
                <div class="title">{{$t('assetcenter_history.assetcenter_history1')  }}</div>
                <p class="red-price">{{ Store.data.userMoney.IndexMoney }}</p>
            </div>
            <div class="bottom-item right">
                <div class="title">{{$t('assetcenter_history.assetcenter_history2')  }}(USD)</div>
                <p class="block-price">{{ Store.data.userMoney.totalUsdt - Store.data.userMoney.IndexMoney }}</p>
            </div>
        </div>
    </Cus-Card>

    <Cus-Card padding="15" v-show="Store.data.showChange">
        <div class="history-box">
            <div class="history-tit"><b>{{$t('assetcenter_history.assetcenter_history3')  }}</b></div>
            <div class="history-btn">
                <span class="btn-item" :class="{'active':Store.data.changeValue}" @click="()=>{onChange(true)}">{{$t('assetcenter_history.assetcenter_history4')  }}</span>
                <span class="btn-item" :class="{'active':!Store.data.changeValue}" @click="()=>{onChange(false)}">{{$t('assetcenter_history.assetcenter_history5')  }}</span>
            </div>
        </div>
    </Cus-Card>


    <Cus-Card padding="15">
        <van-list
            v-model:loading="Store.data.loading"
            :finished="Store.data.finished"
            :finished-text="$t('assetcenter_history.assetcenter_history6')"
            :loading-text = "$t('vantGlobal.loadingtext')"
            @load="onLoad"
            >
            <div class="order-list">
                <!-- {{ item.State?(item.State == 1 ? 'Approve' :'Refuse'):'Unaudited'}} -->
                <div class="order-item" v-for="item in Store.data.list" :key="item.id">
                    <div class="order-info"><span>{{`${Store.data.changeValue?`${$t('assetcenter_history.assetcenter_history7')  }`:`${$t('assetcenter_history.assetcenter_history8')  }`}${$t('assetcenter_history.assetcenter_history9')  }`}}</span><span>{{ item.money }}</span></div>
                    <div class="order-info"><span>{{$t('assetcenter_history.assetcenter_history10')  }}</span><span>{{ item.SJmoney }}</span></div>
                    <div class="order-info"><span>{{$t('assetcenter_history.assetcenter_history11')  }}</span><span class="state" 
                        :class="{
                        'wsh':item.State == 0,
                        'on':item.State == 1,
                        'off':item.State == 2,
                        }">{{ item.State?(item.State == 1 ? `${$t('assetcenter_history.assetcenter_history12')  }` :`${$t('assetcenter_history.assetcenter_history13')  }`):`${$t('assetcenter_history.assetcenter_history14')  }`}}</span></div>
                    <div class="order-info"><span>{{$t('assetcenter_history.assetcenter_history15')  }}</span><span>{{ item.create_time }}</span></div>
                </div>
            </div>
        </van-list>
    </Cus-Card>
  </div>

</template>

<style scoped lang="less">
.flexMixin(@justify){
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    -webkit-justify-content: @justify;
    justify-content: @justify;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
}
.cus-card-box{
    background-image: url(../../assets/assetcenter/history_bg.png);
    background-size: 450px;
    height: 200px;
    border-bottom-left-radius: 50px;
    border-bottom-right-radius: 50px /*padding: 33rpx;*/;
    padding-top:15px;
    --van-divider-margin: 12px 0;
}
.top-content{
    position: relative;
    .flexMixin(flex-start);
    .logo{
        width: 29px;
        height: 29px;
        margin-right: 10px;
    }
    .name{
        font-size: 16px;
        font-weight: bold;
    }
}
.bottom-content{
    .flexMixin(space-between);
    .bottom-item{
        flex-basis: 50%;
        font-size: 13px;
        .title{
            color: #999ba9;
            margin-bottom: 4px;
        }
        .red-price{
            color: #fa6142;
        }
        .block-price{
            color: #3b3e4e;
        }

    }

    .bottom-item.right{
        text-align: right;
    }
}

.history-box{
    .flexMixin(space-between);
    .history-btn{
        text-align: center;
        .btn-item{
            display: inline-block;
            padding: 0 5px;
            min-width: 70px;
            height: 30px;
            opacity: 1;
            color: #a7a7a7;
            line-height: 30px;
            border-radius: 8px;
            background: #ececec;
            margin-left: 10px;
        }
        .btn-item.active{
            background: #424eff;
            color: #fff;
            position: relative;
        }
        .btn-item.active::after{
            position: absolute;
            content: "";
            left: 50%;
            -webkit-transform: translateX(-50%);
            transform: translateX(-50%);
            top: 30px;
            border-top: 6px solid #424eff;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;

        }

    }
}
.order-list{
      font-size: 12px;
      line-height: 24px;
      .order-item{
        border-top: 1px solid #e9e9e9;
        padding: 5px 0;
        .order-info{
          .flexMixin(flex-start);
          span{
            flex-basis: 40%;
          }
          .state.wsh{color: #a7a7a7;}
          .state.on{color: #00c693;}
          .state.off{color: red;}
        }
      }
    }
</style>