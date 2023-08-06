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

const loading = ref<boolean>(false);
const userInfo = computed(()=>$store.state.userinfo);
const Store:any = reactive({data:{
  userInfo:'',    //登录信息
  txmoneyList:[], //提现列表
  czmoneyItem:{}  //充值渠道详情
}})
// 默认选择提现 tab
const active = ref<number>(3);
// 币种媒介名称
const tabData = [
  {title:'充值',value:1},
  {title:'法幣',value:2},
  {title:'提现',value:3},
  {title:'银行卡提现',value:4},
]

// 提现 Store
const price = ref('');
const newprice = ref('');
const taggleSelect = ref<boolean>(false);
const activeIndex = ref(0);//默认选中

// 银行卡Store
const bankCardName = ref<string>('');
const bankNumber = ref<any>('');
const bankName = ref<string>('');
const bankCNY = ref();
const bankNewCNY = ref();
const bankActive = ref(0);
const bankShow = ref(false);
const bankSelect = [
  {id:1,value:'法币收款2',bank:'222222222222222222222'},
  {id:2,value:'法币收款3',bank:'333333333333333333333'},
  {id:3,value:'小额收款',bank:'123456789987456123'},
  {id:4,value:'法币收款4',bank:'4444444444444444444444'},
]

// 法币 store
const amountValue = ref('');
const amountNewValue = ref('');

// 提现下拉
const onChangeName = (event:any,key:string) => {
  const {dataset} = event.target;
  if(dataset['index']){
    switch (key){
      case 'tx': 
        activeIndex.value = dataset['index']*1-1;
        taggleSelect.value = false; 
        break;
      case 'yhk':
        bankActive.value = dataset['index']*1-1;
        bankShow.value = false;
    }
  }
}

// 充值 store
const recharge = ref();
const rechargeNew = ref();

// tab切换
const onChange = (_ev:any) => {
  active.value = _ev.target.dataset['index']*1
}

// 金额格式科学计数法
const onUpdateBank = (value:string,key:string) => {
  let newValue = Number(value) - Number(value)*Store.data.txmoneyList[activeIndex.value].TXFL*0.01;
  switch (key){
    case 'tx':
      newprice.value = NumberToScientfic(newValue.toFixed(4),22);
      break;
    case 'yhk':
      bankNewCNY.value = NumberToScientfic(newValue.toFixed(4),22);
      break;
    case 'crje':
      amountNewValue.value = NumberToScientfic(newValue.toFixed(4),22);
      break;
    case 'czsl':
      rechargeNew.value = NumberToScientfic(newValue.toFixed(4),22);
      break;
  }
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


  const afterRead = (file:any) => {
    // 此时可以自行将文件上传至服务器
    console.log(file);
  };

  const onSubmit = async () => {
    let res;
    $store.commit('setLoading',true);
    if(active.value == 1){
      if(!recharge.value){
        showToast('请输入充值金额');
        $store.commit('setLoading',false);
        return 
      }
      res = await $api.getRecharge(recharge.value,Store.data.czmoneyItem['MJname']);
    }else if(active.value == 2){

    }else if(active.value == 3){
      res = await $api.getUserSubmitTX(Number(price.value),Store.data.txmoneyList[activeIndex.value].MJname);
    }else {

    }
    if(res){
      $store.commit('setLoading',false);
      // showToast(res['msg']);
    }
    
  }

  let reqList:any[] = [$api.getUserTXmoneylist()];

  onMounted(()=>{
    // 获取路由参数
    let queryData = route.query;
    if(JSON.stringify(queryData) != "{}"){
      active.value = Number(queryData.active);
      if(queryData['id']){
        reqList.push($api.getUsermoneyItem(Number(queryData['id'])));
      }
    }

    // 获取后端数据
    Promise.all(reqList)
    .then(res=>{      
      if(res.includes('undefined')) return
      if(res[0]['code'] != 200){
        // showToast(res[0]['msg']);
        setTimeout(()=>{
          router.push('/');
        },1000)
        return;
      }
      Store.data.txmoneyList = res[0].rows;
      console.log(res);

      if(res[1]){
        Store.data.czmoneyItem = res[1].data;
      }
      loading.value = true;
    })

    .catch(err=>{
      console.log(err);
      
    })
  })

</script>

<template>
  <div class="page-main" v-if="loading">
    <!-- tab -->
    <div class="page-tab-list" @click="onChange">
      <div class="page-tab-item" v-for="item in tabData" :key="item.value" :class="{'active':item.value == active}" :data-index="item.value">{{ item.title }}</div>
    </div>
    <!-- content -->
    <div class="page-content">
      <div class="page-box" :class="{'active':active == 1}">

        <div class="wallet-info">

          <div class="wallet-box">
            <img class="wallet-qr" :src="getAssetURL('assetcenter/ewm.png')">
            <div class="wallet-txt">存入錢包</div>
            <div class="wallet-tip">複製您的唯一地址或使用二維碼存款</div>
          </div>

        <div class="deit-list">
          <div class="name">錢包地址</div>
          <div class="network grey">
            <div class="money-address">{{ $route.query['id']?Store.data.czmoneyItem?.address: Store.data.userInfo?.address }}</div>
            <div class="clone-btn" @click="onCopy($route.query['id']?Store.data.czmoneyItem?.address: Store.data.userInfo?.address)">Copy</div>
          </div>
        </div>


        <div class="deit-list">
          <div class="name">充值數量</div>
          <div class="network grey">
            <van-cell-group inset>
              <van-field 
              v-model="recharge" 
              placeholder="請輸入充值金額" 
              @update:model-value="(value)=>{onUpdateBank(value,'czsl')}"
              :maxlength="Store.data.czmoneyItem['ZDCZ']?String(Store.data.czmoneyItem['ZDCZ']).length:10"
               />
            </van-cell-group>
          </div>
          <div class="order">我會得到{{ recharge? rechargeNew : '0.00' }} USDT</div>
          <div class="recharge-btn"><van-button type="primary" size="normal" color="#2850E7">当前钱包充值</van-button></div>
        </div>

      </div>
        <!-- file up -->
        <div class="file-box">
          <div class="file-tit">充值憑證</div>
          <div class="file-cont">
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAApCAYAAACsldDLAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAS0SURBVHgB7VjdViJHEK6uQXQvsgvRmJOrhSdY9nLV9cgTRFxNTq4Wn0B8Atkn0DyBk6ucrBrYJ0CNZC9hn8C523OMComJmwDTnar5ExGYGUCSnOx3DkxPT3fzUV1d9dUIGCFqlUKsed1MoAkpu0fVlcD6Z8/XDmEEEDAC/PLT3pKmiS1QIqVAxbr+kIJDoaEef7byHQyIoci6JJWCpaBzhBCGEJiOP8sYEBIDk704OciRubbde8WWU1A0UTuanc9U3f6zciEFZjOlabhBtylvAaleTT9fy0MIDET2oryXp6lbzq3RMs3Nzxe/LvrNOzt+nSXSPC9hdYQkHJrsefkgK0Dt2neq2mi0Ml+kvzGCzn9f+j4xGZ0oKMfKiJgN6se+ZN0TLqSICSVjGIlsK6US9MhoNJrpMES9NUuFmIqaJYdwHRtXyXh6ve43T/QjKT/ILfLDbLcTTkSTgxB1wRaORqMVsNYW+en5F6/85mC3ztrbQkJ9kBU6NbkeoUgfhijDmo+wY9+pXK20G/Obg12JKllythr4X+ODB4np+VVhgvYUydK/Na42YQTAP/FbpxkzJz750m/8HTe4KB/Q4VFZbithZmbm/E/5MLgs71ds3xU6ucJ6v7Hd3GDZuer3TZShQDgxWWUvfz44rb398WWvsbfI1jiAOz6KAnUYA5Sp3nhtcj0ppW6TLiQ6x94i25KtGyefmjRgDJhZXC3SGYgjIO+ozn02abNyfvzDcvtY7LVI64/rJIwJSYqx8fmVN3SI101Tst8a9IkJTds9K7/2UrRHls1OosTL9QLhEQwA1gyXJ/ulbtsYBLOLX+mcbFzCEaEV3LBmkeUEYIcrR2gItXPV+P0IQsLSDCRulIAlXm9QwhyDpVRWZLBcIvpwwyMrr818e1ydnlvbTAZIf3eI3ogb60eGIewIdt1ZLWcx48XImU+dMTr7DYREJ9F2DKNfWS8jihK3ydJplEpuuA/JV3zzsw9Rg9rWjlC2seLnMBa2rWuvh5p4giT3Us7ixbD5vpOofTCUtTgF+yJ91oclTPwMq0ElEyr6sttwCCHQjWjnn52Zf6EPTViAd3bQzVhKQuADxXrUj2hPwtLchgGBno8h+Eo0F/F0pi4EFLnuCiLA2whXb7RAMLg7TyGxGhH0ZVWnbmdAfDq3mgkzngmDF4qC4fx4f9nTKoBVVEIc2o/UchABPE6gBp6rxedWjrBdAMuJh1vwLwGnbbeopJ3P8xXZ/yhy2+WFoPKij54cF7iCbnsnYcwsrFrVr5Vu8S/kZGBwm/XkxcleDv4hcEi8KfXd2G0jwl9sXao209HoBKe2BFl6m8qNlwJxpylb70yc6BnWpqagHn+a8Q177/vE10irlUCEJQG40Vag3gmJEbfBne2E2V8UWVkj42vS7PU7JILYv/Y2pxfWdnqNYeVP8TXRcxG0S0Eial8pJDabzfXOkBhpv3EeJp3XPLffTfUDwuN+jykZgC8U1GlUVUPMkxDvKk8j3TpZANNFP6VQFpt89AT6oKnEr7Nzmb6BnrdzanLycd81FjK+ySLS76GjaUOL8E44O2bAkED4D+Ej2fvCR7L3hdGTFcJ6P9YyW+/g/4y/Acwifh9OyjR6AAAAAElFTkSuQmCC" alt="">
            <van-uploader :after-read="afterRead" >
              <div class="file-btn">选择文件</div>
            </van-uploader>
          </div>
        </div>

      </div>
      <div class="page-box" :class="{'active':active == 2}">

        <div class="deit-list">
          <div class="network">
            <div>
              <div class="network-col">
              <div class="network-mask" @click="bankShow = !bankShow"></div>
              <div>{{bankSelect[bankActive].value}}</div>
              <van-icon name="arrow-down" />
            </div>
            </div>
          </div>

          <div class="network-select" v-show="bankShow">
              <div class="network-col network-item" v-for="index in bankSelect" :key="index.id" @click="(event)=>onChangeName(event,'yhk')">
                <div class="network-mask" :data-index="index.id"></div>
                <div>{{index.value}}</div>
              </div>
            </div>
        </div>

        <div class="deit-list">
          <div class="name">銀行卡號</div>
          <div class="network">
            <!-- <van-cell-group inset>
              <van-field v-model="bankNumber" placeholder="銀行卡號" />
            </van-cell-group> -->
            <div>{{ bankSelect[bankActive].bank }}</div>
            <div class="clone-btn" @click="onCopy(bankSelect[bankActive].bank)">Copy</div>
          </div>
        </div>

        <div class="deit-list">
          <div class="name">收款人</div>
          <div class="network">
            <div>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</div>
          </div>
        </div>

        <div class="deit-list">
          <div class="name">存入金額 CNY</div>
          <div class="network">
            <van-cell-group inset>
              <van-field v-model="amountValue" placeholder="請輸入充值金額" @update:model-value="(value)=>{onUpdateBank(value,'crje')}" />
            </van-cell-group>
          </div>
          <div class="order">我會得到{{ amountValue? amountNewValue : '0.0000' }} USDT</div>
        </div>


        <!-- file up -->
        <div class="file-box">
          <div class="file-tit">充值憑證</div>
          <div class="file-cont">
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAApCAYAAACsldDLAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAS0SURBVHgB7VjdViJHEK6uQXQvsgvRmJOrhSdY9nLV9cgTRFxNTq4Wn0B8Atkn0DyBk6ucrBrYJ0CNZC9hn8C523OMComJmwDTnar5ExGYGUCSnOx3DkxPT3fzUV1d9dUIGCFqlUKsed1MoAkpu0fVlcD6Z8/XDmEEEDAC/PLT3pKmiS1QIqVAxbr+kIJDoaEef7byHQyIoci6JJWCpaBzhBCGEJiOP8sYEBIDk704OciRubbde8WWU1A0UTuanc9U3f6zciEFZjOlabhBtylvAaleTT9fy0MIDET2oryXp6lbzq3RMs3Nzxe/LvrNOzt+nSXSPC9hdYQkHJrsefkgK0Dt2neq2mi0Ml+kvzGCzn9f+j4xGZ0oKMfKiJgN6se+ZN0TLqSICSVjGIlsK6US9MhoNJrpMES9NUuFmIqaJYdwHRtXyXh6ve43T/QjKT/ILfLDbLcTTkSTgxB1wRaORqMVsNYW+en5F6/85mC3ztrbQkJ9kBU6NbkeoUgfhijDmo+wY9+pXK20G/Obg12JKllythr4X+ODB4np+VVhgvYUydK/Na42YQTAP/FbpxkzJz750m/8HTe4KB/Q4VFZbithZmbm/E/5MLgs71ds3xU6ucJ6v7Hd3GDZuer3TZShQDgxWWUvfz44rb398WWvsbfI1jiAOz6KAnUYA5Sp3nhtcj0ppW6TLiQ6x94i25KtGyefmjRgDJhZXC3SGYgjIO+ozn02abNyfvzDcvtY7LVI64/rJIwJSYqx8fmVN3SI101Tst8a9IkJTds9K7/2UrRHls1OosTL9QLhEQwA1gyXJ/ulbtsYBLOLX+mcbFzCEaEV3LBmkeUEYIcrR2gItXPV+P0IQsLSDCRulIAlXm9QwhyDpVRWZLBcIvpwwyMrr818e1ydnlvbTAZIf3eI3ogb60eGIewIdt1ZLWcx48XImU+dMTr7DYREJ9F2DKNfWS8jihK3ydJplEpuuA/JV3zzsw9Rg9rWjlC2seLnMBa2rWuvh5p4giT3Us7ixbD5vpOofTCUtTgF+yJ91oclTPwMq0ElEyr6sttwCCHQjWjnn52Zf6EPTViAd3bQzVhKQuADxXrUj2hPwtLchgGBno8h+Eo0F/F0pi4EFLnuCiLA2whXb7RAMLg7TyGxGhH0ZVWnbmdAfDq3mgkzngmDF4qC4fx4f9nTKoBVVEIc2o/UchABPE6gBp6rxedWjrBdAMuJh1vwLwGnbbeopJ3P8xXZ/yhy2+WFoPKij54cF7iCbnsnYcwsrFrVr5Vu8S/kZGBwm/XkxcleDv4hcEi8KfXd2G0jwl9sXao209HoBKe2BFl6m8qNlwJxpylb70yc6BnWpqagHn+a8Q177/vE10irlUCEJQG40Vag3gmJEbfBne2E2V8UWVkj42vS7PU7JILYv/Y2pxfWdnqNYeVP8TXRcxG0S0Eial8pJDabzfXOkBhpv3EeJp3XPLffTfUDwuN+jykZgC8U1GlUVUPMkxDvKk8j3TpZANNFP6VQFpt89AT6oKnEr7Nzmb6BnrdzanLycd81FjK+ySLS76GjaUOL8E44O2bAkED4D+Ej2fvCR7L3hdGTFcJ6P9YyW+/g/4y/Acwifh9OyjR6AAAAAElFTkSuQmCC" alt="">
            <van-uploader :after-read="afterRead" >
              <div class="file-btn">选择文件</div>
            </van-uploader>
          </div>
        </div>

      </div>
      <div class="page-box" :class="{'active':active == 3}">
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
      <div class="page-box" :class="{'active':active == 4}">
        <div class="deit-list">
          <div class="network">
            <div>
              <div class="network-col">
              <div class="network-mask" @click="bankShow = !bankShow"></div>
              <div>{{bankSelect[bankActive].value}}</div>
              <van-icon name="arrow-down" />
            </div>
            </div>
            <div>可取款數量： 0.0000</div>
          </div>

          <div class="network-select" v-show="bankShow">
              <div class="network-col network-item" v-for="index in bankSelect" :key="index.id" @click="(event)=>onChangeName(event,'yhk')">
                <div class="network-mask" :data-index="index.id"></div>
                <div>{{index.value}}</div>
              </div>
            </div>
        </div>

        <div class="deit-list">
          <div class="name">銀行名稱</div>
          <div class="network">
            <van-cell-group inset>
              <van-field v-model="bankCardName" placeholder="請輸入銀行名稱" />
            </van-cell-group>
          </div>
          <div class="tip">注：請謹慎綁定，如需修改請聯繫客服。</div>
        </div>

        <div class="deit-list">
          <div class="name">銀行卡號</div>
          <div class="network">
            <van-cell-group inset>
              <van-field v-model="bankNumber" placeholder="銀行卡號" />
            </van-cell-group>
          </div>
          <div class="tip">注：請謹慎綁定，如需修改請聯繫客服。</div>
        </div>

        <div class="deit-list">
          <div class="name">姓名</div>
          <div class="network">
            <van-cell-group inset>
              <van-field v-model="bankName" placeholder="持有" />
            </van-cell-group>
          </div>
          <div class="tip">注：請謹慎綁定，如需修改請聯繫客服。</div>
        </div>

        <div class="deit-list">
          <div class="name">提款金額 CNY</div>
          <div class="network">
            <van-cell-group inset>
              <van-field v-model="bankCNY" placeholder="請輸入提款金額" @update:model-value="(value)=>{onUpdateBank(value,'yhk')}" />
            </van-cell-group>
          </div>
        </div>

        <div class="deit-list">
          <div class="name">
            <span>提現費用：1%</span>
            <span>實際到賬：{{bankCNY?bankNewCNY:'0.000'}}</span>
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
      flex-basis: 25%;
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