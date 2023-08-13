<script lang="ts">
export default {
  name: 'withdraw',
}
</script>
<script setup lang="ts">
import { ref ,reactive,onMounted, computed} from 'vue'
import { getAssetURL ,NumberToScientfic} from '@/common/load_asset';
import { showToast } from 'vant';
import {useRouter, useRoute} from  'vue-router';
import $api  from '@/https';
import {useStore} from 'vuex'
import router from '@/router';
const $store = useStore();
const route = useRoute() // this.$route

const userInfo = computed(()=>$store.state.userinfo);

const Store:any = reactive({data:{
  loading:false,  //加载页面
  userInfo:'',    //登录信息
  txmoneyList:[], //提现列表
  czmoneyItem:{}, //充值渠道详情
  active:2,       //TAb默认索引
  tabStore:[
    {title:'充值',value:1},
    {title:'提现',value:2},
  ],
  recharge:'',
  rechargeNew:''
}})

const currentCZ = ref<boolean>(false);

// 提现 Store
const price = ref('');
const newprice = ref('');
const taggleSelect = ref<boolean>(false);
const activeIndex = ref(0);//默认选中

// 提现下拉
const onChangeName = (event:any,key:string) => {
  const {dataset} = event.target;
  if(dataset['index']){
    switch (key){
      case 'tx': 
        activeIndex.value = dataset['index']*1-1;
        taggleSelect.value = false; 
        break;
    }
  }
}

// Tab切换
const onChange = (_ev:any) => {
  Store.data.active = _ev.target.dataset['index']*1
}

// 金额格式科学计数法
const onUpdateBank = (value:string,key:string) => {
  let newValue = Number(value) - Number(value)*Store.data.txmoneyList[activeIndex.value].TXFL*0.01;
  switch (key){
    case 'tx':
      newprice.value = NumberToScientfic(newValue.toFixed(4),22);
      break;
    case 'czsl':
      Store.data.rechargeNew = NumberToScientfic(newValue.toFixed(4),22);
      break;
  }
}

// 当前钱包充值
const onSubmitCZ = () => {
  showToast('当前钱包充值')
}

// 复制
const onCopy = (val:string) => {
  navigator.clipboard.writeText(val)
  .then(() => {
    showToast('复制成功');
  })
  .catch(() => {
    showToast('复制失败');
  })
  }

  // 提交数据
  const onSubmit = async () => {
    let res;
    $store.commit('setLoading',true);
    if(Store.data.active == 1){
      if(!Store.data.recharge){
        showToast('请输入充值金额');
        $store.commit('setLoading',false);
        return 
      }
      res = await $api.getRecharge(Store.data.recharge,Store.data.czmoneyItem['MJname']);
    }else if(Store.data.active == 2){
      res = await $api.getUserSubmitTX(Number(price.value),Store.data.txmoneyList[activeIndex.value].MJname);
    }
    if(res){
      $store.commit('setLoading',false);
    }
    
  }

  let reqList:any[] = [$api.getUserTXmoneylist()];

  onMounted(()=>{
    // 获取路由参数
    let queryData = route.query;
    if(JSON.stringify(queryData) != "{}"){
      Store.data.active = Number(queryData.active);
      if(queryData['id']){
        reqList.push($api.getUsermoneyItem(Number(queryData['id'])));
      }
    }

    Promise.all(reqList)
    .then(res=>{
      console.log(res);
      if(res.includes(undefined)){return};
      
      Store.data.txmoneyList = res[0].rows;
      if(res[1]){
        currentCZ.value = String(res[1].data.Lname).toLocaleLowerCase().includes('erc20') ? true : false
        Store.data.czmoneyItem = res[1].data;
      }
      Store.data.loading = true;
    })

    .catch(err=>{
      console.log(err);
      
    })
  })

</script>

<template>
  <div class="page-main" v-if="Store.data.loading">
    <!-- tab -->
    <div class="page-tab-list" @click="onChange">
      <div class="page-tab-item" v-for="item in Store.data.tabStore" :key="item.value" :class="{'active':item.value == Store.data.active}" :data-index="item.value">{{ item.title }}</div>
    </div>
    <!-- content -->
    <div class="page-content">
      <div class="page-box" :class="{'active':Store.data.active == 1}">

        <div class="wallet-info">

          <div class="wallet-box">
            <img class="wallet-qr" :src="getAssetURL('assetcenter/ewm.png')">
            <div class="wallet-txt">存入錢包</div>
            <div class="wallet-tip">複製您的唯一地址或使用二維碼存款</div>
          </div>

        <div class="deit-list">
          <div class="name">錢包地址</div>
          <div class="network grey">
            <div class="money-address">{{ $route.query['id']?Store.data.czmoneyItem.address: userInfo?.address }}</div>
            <div class="clone-btn" @click="onCopy($route.query['id']?Store.data.czmoneyItem.address: userInfo?.address)">Copy</div>
          </div>
        </div>


        <div class="deit-list">
          <div class="name">充值數量</div>
          <div class="network grey">
            <van-cell-group inset>
              <van-field 
              v-model="Store.data.recharge" 
              placeholder="請輸入充值金額" 
              @update:model-value="(value)=>{onUpdateBank(value,'czsl')}"
              :maxlength="Store.data.czmoneyItem['ZDCZ']?String(Store.data.czmoneyItem['ZDCZ']).length:10"
               />
            </van-cell-group>
          </div>
          <div class="order">我會得到{{ Store.data.recharge? Store.data.rechargeNew : '0.00' }} USDT</div>
          <div class="recharge-btn" v-if="currentCZ"><van-button type="primary" size="normal" color="#2850E7" @click="onSubmitCZ">当前钱包充值</van-button></div>
        </div>

      </div>

      </div>
      <div class="page-box" :class="{'active':Store.data.active == 2}">
        <div class="deit-list">
          <div class="name">鏈類型</div>
          <div class="network">ETHereum Main NetWork</div>
        </div>
        <div class="deit-list">
          <div class="name">帳戶</div>
          <div class="network">
            <div>
              <div class="network-col">
              <div class="network-mask" @click="taggleSelect = !taggleSelect"></div>
              <img class="network-img" :src="Store.data.txmoneyList[activeIndex].Icon" >
              <div>{{Store.data.txmoneyList[activeIndex].ZSname}}</div>
              <van-icon name="arrow-down" />
            </div>
            </div>
            <!-- <div>可取款數量：<span>{{ userInfo?.money }}</span></div> -->
          </div>

          <div class="network-select" v-show="taggleSelect">
            <div class="network-col network-item" v-for="item in Store.data.txmoneyList" :key="item.id" @click="(event)=>{onChangeName(event,'tx')}">
              <div class="network-mask" :data-index="item.id"></div>
              <img class="network-img" :src="item.Icon">
              <div>{{item.ZSname}}</div>
            </div>
          </div>

        </div>
        <div class="deit-list">
          <div class="name">錢包地址</div>
          <div class="network line">{{ userInfo?.address }}</div>
        </div>
        <div class="deit-list">
          <div class="name">提款金額</div>
          <div class="network amount">
            <van-cell-group inset>
              <van-field 
              v-model="price" 
              type="number" 
              :maxlength="String(Store.data.txmoneyList[activeIndex].ZDTX).length"
              :placeholder="`請輸入提款金額 <=${Store.data.txmoneyList[activeIndex].ZDTX}`" 
              @update:model-value="(value)=>{onUpdateBank(value,'tx')}
              "/>
            </van-cell-group>
          </div>
        </div>
        <div class="deit-list">
          <div class="name">
            <span>提現費用：{{ `${Store.data.txmoneyList[activeIndex].TXFL}%` }}</span>
            <span>實際到賬：{{price?newprice:'0.000'}}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="submit-Box"><van-button type="primary" block color="#2850E7" @click="onSubmit">提交</van-button></div>
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

/*多行文本溢出...*/
.multiEllipsis(@line:2) {
    overflow : hidden;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: @line;
    -webkit-box-orient: vertical;
  }
.page-main{
  padding: 15px 15px 85px;
  color: #4D4D4D;
  .page-tab-list{
    .flexMixin(space-between);
    background: #fff;
    box-shadow: 0 2px 18px rgba(67,101,255,.06);
    border-radius: 10px;
    color: #4d4d4d;
    font-size: 16px;
    font-weight: 400;
    overflow: hidden;
    text-align: center;
    .page-tab-item{
      flex-basis: 50%;
      color: #4D4D4D;
      height: 47px;
      line-height: 47px;
    }
    .page-tab-item.active{
      background-color: #2850E7;
      color: #fff;
    }
  }
  .page-content{
    margin-top: 20px;
    .page-box{
      display: none;
      margin-top: 30px;
      .wallet-info{
        background: #fff;
        border-radius: 10px;
        padding: 15px;
        margin-bottom: 15px;
        .wallet-box{
          text-align: center;
          margin-bottom: 30px;
          .wallet-qr{
            width: 102px;
            height: 102px;
          }
          .wallet-txt{
            font-size: 16px;
            font-weight: bold;
            padding: 16px;
            color: black;
          }
        }
      }
      .deit-list{
        color: #4d4d4d;
        font-weight: 400;
        font-size: 14px;
        line-height: 150%;
        margin-bottom: 14px;
        position: relative;
        .money-address{
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-all;
          text-overflow: ellipsis;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          display: block;
        }
        .recharge-btn{
          width: 100%;
          text-align: center
        }
        .name{
          .flexMixin(space-between);
          margin-bottom: 5px;
          font-weight: bold;
        }
        .network{
          .flexMixin(space-between);
          background: #fff;
          box-shadow: 0 2px 18px rgba(67,101,255,.06);
          border-radius: 10px;
          padding: 0 10px;
          font-size: 14px;
          line-height: 42px;
          --van-cell-group-background:#fff;
          --van-cell-group-inset-padding:0;
          --van-cell-background:#fff;
          --van-cell-horizontal-padding:0;
        }
        .network.line{
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-all;
          text-overflow: ellipsis;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          display: block;
        }
        .network.grey{
          --van-cell-group-background:#F0F0F0;
          --van-cell-background:#F0F0F0;
          background: #F0F0F0;
          border: 1px solid #dfdfdf;
        }
        .clone-btn{
          width: 50px;
          height: 25px;
          background: -webkit-linear-gradient(359.84deg,#00c693 .14%,#00c693 102.99%);
          background: linear-gradient(90.16deg,#00c693 .14%,#00c693 102.99%);
          border-radius: 7px;
          color: #fff;
          font-weight: 400;
          font-size: 14px;
          text-align: center;
          line-height: 25px;
        }
        .tip{
          font-size: 13px;
          padding: 5px 0 0 10px;
          font-weight: bold;
        }
        .order{
          text-align: center;
          margin: 18px;
          color: #a3a3a3;
          font-size: 16px;
        }
        .network-col{
          position: relative;
          .flexMixin(flex-start);
          gap: 5px;
          flex-basis: 65%;
          .network-mask{
            position: absolute;
            left: 0;
            top: 0;
            background-color: transparent;
            width: 100%;
            height: 100%;
          }
          .network-img{
            width: 27px;
            height: 27px;
          }
        }
      }

      .file-box{
        padding: 15px;
        background: #fff;
        border-radius: 5px;
        .file-tit{
          margin-bottom: 15px;
        }
        .file-cont{
          border: 1px dashed #e0e0e0;
          border-radius: 10px;
          padding: 15px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .file-btn{
          height: 25px;
          background: #f0f0f0;
          border-radius: 6px;
          padding: 0 25px;
          font-weight: 600;
          font-size: 14px;
          line-height: 25px;
          margin-top: 5px;
        }
      }
    }
    .page-box.active{
      display: block;
    }
  }
}

// 下拉css
.network-select{
  position: absolute;
  left: 0;
  top: 105%;
  color: #333;
  background: #fff;
  border-radius: 10px;
  z-index: 99;
  padding: 0 12px 10px;
  font-size: 12px;
  width: 100%;
  box-shadow: 0 3px 25px rgba(0,0,0,.08);

    .network-item{
      padding-top: 10px;
    }
  }
  .submit-Box{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 15px;
  }
</style>