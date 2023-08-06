<script lang="ts">
export default {
  name: 'history',
}
</script>
<script setup lang="ts">
import { ref ,onMounted ,reactive} from 'vue';
import { getAssetURL } from '@/common/load_asset';
import $api from '@/https'
const loading = ref(false);
const Store:any = reactive({data:{
    list:[],            //充提记录
    changeValue:true,   //切换tab
    finished:false,     //
    showChange:true,    //
}})


const onChange = (val:boolean) => {
    Store.data.changeValue = val;
}

const onLoad = () => {

}

const getMoney = async () => {
    const res = await $api.getMoney('all');
    console.log(res);
    
}

onMounted(()=>{
    getMoney();
})

</script>

<template>
  <div class="cus-card-box">
    <Cus-Card padding="20">
        <div class="top-content">
            <img class="logo" :src="getAssetURL('assetcenter/depositico1.png')" alt="logo">
            <span class="name">USDT</span>
        </div>
        <van-divider />
        <div class="bottom-content">
            <div class="bottom-item left">
                <div class="title">可用</div>
                <p class="red-price">0</p>
            </div>
            <div class="bottom-item right">
                <div class="title">拆合(USD)</div>
                <p class="block-price">0</p>
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

    <div>
        <van-list
        v-model:loading="loading"
        :finished="Store.data.finished"
        finished-text="没有更多了"
        @load="onLoad"
        >
        <van-cell v-for="item in Store.data.list" :key="item" :title="item" />
        </van-list>
    </div>
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
    height: 215px;
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
</style>