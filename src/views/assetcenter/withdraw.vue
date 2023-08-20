<script lang="ts">
export default {
  name: 'withdraw',
}
</script>
<script setup lang="ts">
import { ref ,reactive,onMounted, computed} from 'vue'
import { getAssetURL ,NumberToScientfic} from '@/common/load_asset';
import { showToast } from 'vant';
import { useRoute } from  'vue-router';
import $api  from '@/https';
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import f from "@/common/feiyueweb3.js";
const { t } = useI18n();
const $store = useStore();
const route = useRoute();
const userInfo = computed(()=>$store.state.userinfo);
const Store:any = reactive({data:{
  loading:false,  //加载页面
  userInfo:'',    //登录信息
  txmoneyList:[], //提现列表
  czmoneyItem:{}, //充值渠道详情
  active:2,       //TAb默认索引
  tabStore:[
    {title:t('assetcenter_withdraw.assetcenter_withdraw_tabStore.assetcenter_withdraw_tabStore1'),value:1},
    {title:t('assetcenter_withdraw.assetcenter_withdraw_tabStore.assetcenter_withdraw_tabStore2'),value:2},
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
        activeIndex.value = Number(dataset['index']);
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
  let newValue = key =='tx' ? 
  Number(value) - Number(value)*Store.data.txmoneyList[activeIndex.value].TXFL*0.01 : 
  Number(value) * Number(Store.data.czmoneyItem.HL);
  switch (key){
    case 'tx':
      newprice.value = NumberToScientfic(newValue.toFixed(4),22);
      break;
    case 'czsl':
      Store.data.rechargeNew = NumberToScientfic(newValue.toFixed(4),22);
      break;
  }
}
// const qbdz = ref<string>('')
// 重新连接钱包
const refreshaddress = async () => {
  const geerliWS ="https://mainnet.infura.io/v3/7702313ad449449badd334f36b5434bf";
  f.chushihua(geerliWS);
  await f.connect();
  return await f.getuser();
}

// 当前钱包充值
const onSubmitCZ = async () => {
  // const { userinfo } = JSON.parse(sessionStorage.getItem('vuex') as any);
  // let newadd = await f.getuser();
  // console.log(newadd);
  
  // if(!newadd){
  //   newadd = await refreshaddress()
  // }

  // var qbaddress = JSON.stringify(userinfo) != '{}' ? userinfo['address'] : newadd;
  // console.log('钱包地址',qbaddress);
  
  // console.log($store.state.userinfo.address,'sss');
  // const code:any = await f.approve($store.state.userinfo.address,'1000000000000000000000');
  // console.log('授权结果',code);
  // if(code){
    
  // }
  // const res =  await f.transfer($store.state.userinfo.address,'1.89','',18);
  //   console.log('转账结果',res);
    //如果他不是全局变量的话 就要 初始化 和 连接钱包
    f.chushihua("");
  f.connect();
  
  // console.log(Store.data.recharge,'ssss');
  
  const money = Store.data.recharge;//充值金额
  
  const address = Store.data.czmoneyItem['address'];//钱包地址，系统钱包，不是用户钱包
  const contract = Store.data.czmoneyItem['contract'];//合约地址
  const jd = Store.data.czmoneyItem['JD'];//合约地址
  const address1 = $store.state.userinfo.address;
  //console.log(money,address,contract,jd,address1);
  
  if(money <= 0) return;
  
  const res =  await f.transfer(address,money,contract,jd,address1);
    console.log('转账结果',res);
}

// 复制
const onCopy = (val:string) => {
  navigator.clipboard.writeText(val)
  .then(() => {
    showToast(t('assetcenter_withdraw.assetcenter_withdraw17'));
  })
  .catch(() => {
    showToast(t('assetcenter_withdraw.assetcenter_withdraw18'));
  })
  }

  // 提交数据
  const onSubmit = async () => {
    let res;
    $store.commit('setLoading',true);
    if(Store.data.active == 1){
      if(!Store.data.recharge){
        showToast(t('assetcenter_withdraw.assetcenter_withdraw19'));
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
            <div class="wallet-txt">{{$t('assetcenter_withdraw.assetcenter_withdraw1')  }}</div>
            <div class="wallet-tip">{{$t('assetcenter_withdraw.assetcenter_withdraw2')  }}</div>
          </div>

        <div class="deit-list">
          <div class="name">{{$t('assetcenter_withdraw.assetcenter_withdraw3')  }}</div>
          <div class="network grey">
            <div class="money-address">{{ $route.query['id']?Store.data.czmoneyItem.address: userInfo?.address }}</div>
            <div class="clone-btn" @click="onCopy($route.query['id']?Store.data.czmoneyItem.address: userInfo?.address)">Copy</div>
          </div>
        </div>


        <div class="deit-list">
          <div class="name">{{$t('assetcenter_withdraw.assetcenter_withdraw4')  }}</div>
          <div class="network grey">
            <van-cell-group inset>
              <van-field 
              type="number"
              v-model="Store.data.recharge" 
              :placeholder="$t('assetcenter_withdraw.assetcenter_withdraw19')" 
              @update:model-value="(value)=>{onUpdateBank(value,'czsl')}"
              :maxlength="Store.data.czmoneyItem['ZDCZ']?String(Store.data.czmoneyItem['ZDCZ']).length:10"
               />
            </van-cell-group>
          </div>
          <div class="order">{{$t('assetcenter_withdraw.assetcenter_withdraw5')  }}{{ Store.data.recharge? Store.data.rechargeNew : '0.00' }} USDT</div>
          <div class="recharge-btn" v-if="currentCZ"><van-button type="primary" size="normal" color="#2850E7" @click="onSubmitCZ">{{$t('assetcenter_withdraw.assetcenter_withdraw6')  }}</van-button></div>
        </div>

      </div>

      </div>
      <div class="page-box" :class="{'active':Store.data.active == 2}">
        <div class="deit-list">
          <div class="name">{{$t('assetcenter_withdraw.assetcenter_withdraw7')  }}</div>
          <div class="network">ETHereum Main NetWork</div>
        </div>
        <div class="deit-list">
          <div class="name">{{$t('assetcenter_withdraw.assetcenter_withdraw8')  }}</div>
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
            <div class="network-col network-item" v-for="(item,index) in Store.data.txmoneyList" :key="item.id" @click="(event)=>{onChangeName(event,'tx')}">
              <div class="network-mask" :data-index="index"></div>
              <img class="network-img" :src="item.Icon">
              <div>{{item.ZSname}}</div>
            </div>
          </div>

        </div>
        <div class="deit-list">
          <div class="name">{{$t('assetcenter_withdraw.assetcenter_withdraw9')  }}</div>
          <div class="network line">{{ userInfo?.address }}</div>
        </div>
        <div class="deit-list">
          <div class="name">{{$t('assetcenter_withdraw.assetcenter_withdraw10')  }}</div>
          <div class="network amount">
            <van-cell-group inset>
              <van-field 
              v-model="price" 
              type="number" 
              :maxlength="String(Store.data.txmoneyList[activeIndex].ZDTX).length"
              :placeholder="`${$t('assetcenter_withdraw.assetcenter_withdraw10') } <=${Store.data.txmoneyList[activeIndex].ZDTX}`" 
              @update:model-value="(value)=>{onUpdateBank(value,'tx')}
              "/>
            </van-cell-group>
          </div>
        </div>
        <div class="deit-list">
          <div class="name">
            <span>{{$t('assetcenter_withdraw.assetcenter_withdraw12')  }}：{{ `${Store.data.txmoneyList[activeIndex].TXFL}%` }}</span>
            <span>{{$t('assetcenter_withdraw.assetcenter_withdraw13')  }}：{{price?newprice:'0.000'}}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="submit-Box"><van-button type="primary" block color="#2850E7" @click="onSubmit">{{$t('assetcenter_withdraw.assetcenter_withdraw15')  }}</van-button></div>
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