<script lang="ts">
export default {
  name: 'history',
}
</script>
<script setup lang="ts">
import { onMounted ,reactive,onUnmounted} from 'vue'
import $api from '@/https'
import {useStore} from 'vuex'
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
    total:0,            //总数
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
    let res:any;
    if(Store.data.changeValue){
        res = await $api.getUserRechargelist(Store.data.pageNum,Store.data.pageSize);
    }else{
        res = await $api.getUserWithdrawlist(Store.data.pageNum,Store.data.pageSize);
    }
    if(res && res['code'] == 200){
        Store.data.total = res.total;
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
                <div class="title">可用</div>
                <p class="red-price">{{ Store.data.userMoney.IndexMoney }}</p>
            </div>
            <div class="bottom-item right">
                <div class="title">拆合(USD)</div>
                <p class="block-price">{{ Store.data.userMoney.totalUsdt - Store.data.userMoney.IndexMoney }}</p>
            </div>
        </div>
    </Cus-Card>

    <Cus-Card padding="15" v-show="Store.data.showChange">
        <div class="history-box">
            <div class="history-tit"><b>財務記錄</b></div>
            <div class="history-btn">
                <span class="btn-item" :class="{'active':Store.data.changeValue}" @click="()=>{onChange(true)}">充值</span>
                <span class="btn-item" :class="{'active':!Store.data.changeValue}" @click="()=>{onChange(false)}">提现</span>
            </div>
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
    .order-item{
        .flexMixin(space-between);
        border-bottom: 1px solid #ededed;
        line-height: 25px;
        .left{
        }
        .right{
            text-align: right;
            .wsh{
                color: #a7a7a7;
            }
            .on{
                color: #00c693;
            }
            .off{
                color: red;
            }
        }
        .title{
            font-weight: bold;
            font-size: 15px;
        }
    }
}
</style>