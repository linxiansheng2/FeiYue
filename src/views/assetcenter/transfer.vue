<script lang="ts">
export default {
  name: 'transfer',
}
</script>
<script setup lang="ts">
import { ref, reactive ,onMounted,onUnmounted} from 'vue'
import { getAssetURL } from '@/common/load_asset';
import $api  from '@/https';
import { showToast } from 'vant';
import {useStore} from 'vuex'
import { useI18n } from 'vue-i18n'
const { locale , t } = useI18n();
const $store = useStore();
interface Params{
  data:{
    money:string|number;
    from_user:string;
    to_user:string
  }
}
const Store:any = reactive({data:{
  loading:false,       //是否渲染页面
  Direction:false,     //互换交易
  formSelect:false,    //发送方列表
  toSelect:false,      //接收方列表
  fromIndex:0,         //默认发送方
  toIndex:1,           //默认接收方
  transferList:[
    {id:0,name:t('assetcenter_transfer.assetcenter_transferList.assetcenter_transferList1'),type:'IndexMoney',value:'index',num:0,ico:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALASURBVHgBrVW7bhNBFL3z8GPXdiITUgC2C4SoQhqnsWgokJCiIKUJSsUXQMkX0IWSjo4OSOMiokKCJkrlghAaikiQEBdRYoGzu/buzlzuLHHiOOtHEp/Cu5rxnjNz7p0zDAYAEdnc4z2rYVkJ/68j7ATnZpx7iD5rh76T9CuFDX919Ynqx8HiBpeWPogaPMxKz0vACGC82Z5NbbpxQucEKpUdq2EzW1uMwQVgdnXkoru7UfT6CpQXfttNABuugFy97tZqc+45AbPygymegTHAPdBOZydR0YznxhYYE7LEZThPBDbbs7GeM67vgeTLcEEYrlqjnDXv0ih99XKpOHLO5FsEKIYpWO+d523YGSQi02nqQGSsQN7bPd6fkDN4yhDMs9RLgBpWUOtXg0SaVHCZLGSS4J12FhlXQi6rSuEzOmlbNFQeRMIln9Gh3oqbs/L5BE8eurJ7UAmcoT2gRvwOw5DAefr9LKR8ETcdpqa4PFdcxT4iVzNC8qoK9SI9XzLGJuMIKEpKiLDFQC+TCKgwPGNZmjlCxn5I/tJHYERIvYihWoQ+0Fp8E0JNUjNU40RY4dHOtU6I9YJGlwHFhEb1BoaAfLjPBK+G7eAOF+JP9D3Fh0xOZBQVmcevDt6RZ//F6DyYlu39D9n4PkpEwV8rrZ93yA1M4lJgekGOygVDYMgR8IwAtXBJCj5PgTNJ5CsQLegUJs6ZOQx3F/am4BLo2KJp5b3kBj/Wbh5Ks47QOgxGzf5uUAetY6in4+YaR4kWcevI++3VfNMUBMYEh7j2v0xHkX1cXKZbxcCBMYG5v1zDGb13T9ygCyd3xQvH5E+968I50571tVuuf90/uoxdxhb34KfTTW7Q595FPv1g385ngzSMgLDVCrY/3W52bBlB4FSoUNlNmcRtUyhmjnPLDbROKl95jUZQr5W96ET0wT9SOkN19EywhAAAAABJRU5ErkJggg=='},
    {id:1,name:t('assetcenter_transfer.assetcenter_transferList.assetcenter_transferList2'),type:'ZyMoney',value:'zy',num:0,ico:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAOgSURBVHgBrVVLbBNnEJ75d9frRxJsnEIaBzWUHMoBqQ+atlRQlwNSe+ilVdVDW6hK1UptVaniIeCAwgHEQ0hAhISEIIELIB4nxAUE4k0gCImHghTxip04sZ3YjuN4d//dn/3X+LFO1oDgk9b+d/6Z+eafnX8GoQbYxo0k+v6ZQD7LvDoySRSJaMkJNUARlBzmswvmB8fx6wvUyQdOJ7y17xPJT0kTSuiBVwAipue2eZLTEU0heLp3QUBzSUE0RAKvAYnpuu7Sk3N/u5NyJIh0twcVBYLwBpBlSLYs70kW30tR8sjf1DkH9/H44Id+GwHPOU8LvCUIqhBk58NWQVg/QUqCBqIt55vlTQsXt3/0g89Vll16xsAjlrPqNq2/gstd793d2ldpq6EgRPsnm8xlROTRm84bKhWOyMtDt4QvtxkjYmjZvALvSJbBuUEGH7+LEPAUSJoCADHvt2EyEft+zqPuaKUPhTEvL3Pi0tW6yo1e/Lz+mPDrYYpiqCdifpsUs+RH7xf+H8QZmLcAGmSTwLREQgKDbSsOpJoX10MV+t45EyBe5rYRbMe/VuepGqJaDvhz6t4E9ESYWW4IfjeaaUEYNk/TPAMgRwvPJIitt+et2VBNUC+jRwRZl8EQS8LRJ1fzcb3MOWQ+i2Z/Cv981lKWTQJcjNudNVCaWVpFQIFJpPpCrZ95tlMC3ZbPx7FRm2FCsTsSGI1+93Tnnir/oDOQptzWcN2jzJL6yNpKWSSZtumkNbvN0uGuX+ZPXBqHaUAoNab0jx2NJ242S5lSRJFEGhhjpf0xtawbUIf2hEfsFVQEbx/EJwnqdJunW/Z3ulG/w9c5RYPB0WwhelPbeMHFU7Oq78dOcIBCRIWMK2zSSWHljBv/EzCso/dFR+zRM2OcpwZqQBSVLPng72/GnBR+D1yPtrpSVqoG4oUmOfqCYJY6sNspNUW0tvqzBLHDkBFzTkonQl3dXqQ3+ocKlZQxP7BPT5387+HPh2o55zOCzwerimIGHbamlAP+aOxdm8xMpNJ5DbIqjS6KH++s5Zz74gOIry2ChX/2akGhIeFksKLuytASX/+/9wfTMCvbv+tlqREEI1GcbraBM7D/i5mqoTc6GR6Zva79p+EtPVADLiIk5qy8VrqZU0bm2MGwP6lnGl93ZPK08MhrjswieAu3ZoRkb+NOMNt9rq3NE3uloV9NxNu5R/L6EDV38VQCgqYBF5Bcy8CyFHZ0OBbIc+VnhuIIx9wfAAAAAElFTkSuQmCC'},
    {id:2,name:t('assetcenter_transfer.assetcenter_transferList.assetcenter_transferList3'),type:'JyMoney',value:'jy',num:0,ico:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKjSURBVHgBrVW7bhNBFD13Znaz3jwsiyooiZQOiQ4qlCYSVSQoI/wFcUUZKqQoEh0lVfgBIuUDaNMEJKRUOJREchANEsExWT92dy53Ng+c2Jus5ZxivZ69c86dO/dBuAHMTKg9LwEdD+mphp5Q2YeOZgR/Ehz7PWCuRzs7aR4HDSVeXdWoHE8BiYciSOIuWvejYUI0SP6khFIYIkgJo8Cdqh2JyOd2rgCvPQuBvyHGQiui9/vRxT91Se48H5vcYTo84+oTyGLuwnJXEK6MU2DORH+GMF7hmKcxlsBqpkvxQejpxoCBu7/guyQJmipTMt5EUfI4pjcg4pTsiYG3EseoDrec9phBEqIffkFuIVdVqHTLMi0QqXW22GaihW5XlYduqD0uKVQmCwsQeN7T6ih7ZzTdr0/6g1J2JWeLZ9BhgwAFwSfZU8ilxslofpjahBSR3AMPmuuSUiMVlMZeL1Y1X6u6EH5NUjqwUC+04U9D7VOjDUaAUahL9jQTm1aVO43iqoF+feMepF172cTOEffUOyLMiJd1OXhZgWYYfB57Wzc+v+1zM59d2oc4MCkWibr+jYnL8njl3m22Qufrrg7oyPf4EW6DdFwJURBLiyjWNcFb7lRKo+5SU5OdF90ly6rh+/bjgLm0c3LFgNryvf51l+8EWxbP65LnS4ppPU9SQtm0Fi+HCszu/jZiwLxm4v7e73l2u8/rPanehkRmRe5hISMFNaycRBP2cjNICoA2YbPA8oY0vcOnlZFnQB46EWPxy7ETyC7XvWAxPcVdoa2jjBN984A2dzvAVISx0boy1QZH5sZygEM9OfrIlLA4z28amf9F5GS/lkMkRbtUK8bsfusiLLcKXBH6NjeBygMfHWn/QXhmn1V/z5VwjK39tsvEPI5/SuYYDSZVtTAAAAAASUVORK5CYII='},
  ],
  swapList:[],      //转账记录
  pageNum:1,        //转账页数
  pageSize:2,       //转账单页数量
  count:0,          //转账总页数
}})

const subParams = reactive<Params>({data:{
  money:'',
  from_user:'index',
  to_user:'zy'
}})

// 切换交易方
const onChangeName = (event:any) => {
  const {dataset} = event.target;
  let index = Number(dataset['index']);
  switch(dataset['type']){
    case 'from':
      Store.data.formSelect = false;
      Store.data.fromIndex = index;
      subParams.data.from_user = Store.data.transferList[index].value;
      subParams.data.money = ''
      break;
    case 'to':
      Store.data.toSelect = false;
      Store.data.toIndex = index;
      subParams.data.to_user = Store.data.transferList[index].value;
      break;
    default:
      return;
  }
}

// 转换
const onSubmit = async () => {
  $store.commit('setUseLoading',true);
  if(!subParams.data.money){
    showToast(t('assetcenter_transfer.assetcenter_transfer16'));
    return
  }else{
    const res = await $api.getUsermoney(subParams.data);
    if(res){
      showToast(res['msg']);
      if(res['code'] == 200){
        getMoney();
        onChangePage(1);
      }
    }
  }
}

// 查询金额
const getMoney = async () => {
  const res = await $api.getMoney('all');
  if(res && res['code'] == 200){

    console.log(res);
    
    Store.data.transferList.forEach((item:any)=>{
      if(res[item.type]){
        item.num = res[item.type]
      }
    })
  }
  Store.data.loading = true;
}

// 翻页
const onChangePage = async (_ev:any) => {
  $store.commit('setUseLoading',false);
  const res = await $api.getUserTransferlist(_ev,Store.data.pageSize);
  console.log(res);
  
  Store.data.count = parseInt(String((res['total'] + Store.data.pageSize -1 ) / Store.data.pageSize));
  Store.data.swapList = res['rows'];
}

onMounted(()=>{
  getMoney();
  onChangePage(1);
})

onUnmounted(()=>{
  $store.commit('setUseLoading',true);
})
</script>

<template>
  <div class="page-main" v-if="Store.data.loading">
    <Cus-Card padding="10" marginTop="15">
      <div class="paratebox" :class="{'flexreverse':Store.data.defDirection}" >
        <div class="transfer-wrap">
            <div class="transfer-col" >
              <div class="transfer-mask" @click="Store.data.formSelect = !Store.data.formSelect"></div>
              <img class="transfer-img" :src="Store.data.transferList[Store.data.fromIndex].ico" :alt="`depositico`">
              <div>{{Store.data.transferList[Store.data.fromIndex].name}}</div>
              <van-icon name="arrow-down" />
              <div class="transfer-select" v-show="Store.data.formSelect">
                <div class="transfer-col transfer-item" v-for="item in Store.data.transferList" :key="item.name" @click="onChangeName">
                  <div class="transfer-mask" :data-index="item.id" data-type="from"></div>
                  <img class="transfer-img" :src="item.ico" :alt="`${item.value}-ico`">
                  <div>{{item.name}}</div>
                </div>
              </div>
            </div>
            <div class="transfer-right"><span>{{$t('assetcenter_transfer.assetcenter_transfer1')  }}:{{ Store.data.transferList[Store.data.fromIndex].num }}</span></div>
        </div>

        <div class="transfer-center">
          <van-cell-group inset>
            <van-field
              v-model="subParams.data.money"
              :placeholder="$t('assetcenter_transfer.assetcenter_transfer2')"
              type="number"
              :maxlength="String(Store.data.transferList[Store.data.fromIndex].num).length"
            >
              <template #button>
                <div class="max-btn" @click="subParams.data.money = Store.data.transferList[Store.data.fromIndex].num;">MAX</div>
              </template>
            </van-field>
          </van-cell-group>
          <img 
          class="transfer-ico"
          :src="getAssetURL('assetcenter/transferbtn.png')" 
          alt="transfer"
          >
          <!-- @click="Store.data.defDirection = !Store.data.defDirection" -->
        </div>

        <div class="transfer-wrap">
            <div class="transfer-col" >
              <div class="transfer-mask" @click="Store.data.toSelect = !Store.data.toSelect"></div>
              <img class="transfer-img" :src="Store.data.transferList[Store.data.toIndex].ico" alt="toico">
              <div>{{Store.data.transferList[Store.data.toIndex].name}}</div>
              <van-icon name="arrow-down" />
              <div class="transfer-select" v-show="Store.data.toSelect">
                <div class="transfer-col transfer-item" v-for="item in Store.data.transferList" :key="item.name" @click="onChangeName">
                  <div class="transfer-mask" :data-index="item.id" data-type="to"></div>
                  <img class="transfer-img" :src="item.ico" :alt="`${item.value}-ico`">
                  <div>{{item.name}}</div>
                </div>
              </div>
            </div>
        </div>

        <!-- <div class="transfer-wrap">
          <div class="transfer-col">
            <img class="transfer-img" :src="getAssetURL('assetcenter/kyye.png')" alt="depositico1">
            <div>可用餘額</div>
          </div>

          <div class="transfer-right"><span>餘額:0</span></div>
        </div> -->

      </div>
      
      <div class="transfer-submit"><van-button type="primary" color="#2850E7" block @click="onSubmit">{{$t('assetcenter_transfer.assetcenter_transfer18')  }}</van-button></div>
    </Cus-Card>

    <Cus-Card padding="10">
      <div class="desc-card">
        <div class="desc-title"><span>{{$t('assetcenter_transfer.assetcenter_transfer3')  }}</span></div>
        <van-steps 
        direction="vertical" 
        active-icon="success" 
        active="2" 
        active-color="#2850E7" 
        >
          <van-step><span class="desc-span">{{$t('assetcenter_transfer.assetcenter_transfer4')  }}</span></van-step>
          <van-step><span class="desc-span">{{$t('assetcenter_transfer.assetcenter_transfer5')  }}</span></van-step>
          <van-step><span class="desc-span">{{$t('assetcenter_transfer.assetcenter_transfer6')  }}</span></van-step>
        </van-steps>
      </div>

      <div class="desc-card history">
        <div class="desc-title"><span>{{$t('assetcenter_transfer.assetcenter_transfer7')  }}</span></div>
        <div class="history-content">

          <div class="order-list" v-if="Store.data.swapList.length">
            <div class="order-item" v-for="item in Store.data.swapList" :key="item.id">
              <div class="order-info"><span>{{$t('assetcenter_transfer.assetcenter_transfer8')  }}</span><span>USDT</span></div>
              <div class="order-info"><span>{{$t('assetcenter_transfer.assetcenter_transfer9')  }}</span><span>{{ item.money }}</span></div>
              <div class="order-info"><span>{{$t('assetcenter_transfer.assetcenter_transfer10')  }}</span><span>{{ item.Froma == 'index'? `${$t('assetcenter_transfer.assetcenter_transfer17')  }` : (item.Froma == 'zy'? `${$t('assetcenter_transfer.assetcenter_transfer11')  }` : `${$t('assetcenter_transfer.assetcenter_transfer12')  }`) }}</span></div>
              <div class="order-info"><span>{{$t('assetcenter_transfer.assetcenter_transfer13')  }}</span><span>{{ item.Toa == 'index'? `${$t('assetcenter_transfer.assetcenter_transfer17')  }` : (item.Toa == 'zy'? `${$t('assetcenter_transfer.assetcenter_transfer11')  }` : `${$t('assetcenter_transfer.assetcenter_transfer12')  }`) }}</span></div>
              <div class="order-info"><span>{{$t('assetcenter_transfer.assetcenter_transfer14')  }}</span><span>{{ item.create_time }}</span></div>
            </div>
            <van-pagination v-model="Store.data.pageNum" :page-count="Store.data.count" mode="simple" @change="onChangePage" >
              <template #prev-text><van-icon name="arrow-left" /></template>
              <template #next-text><van-icon name="arrow" /></template>
            </van-pagination>
          </div>
          <van-empty v-else :description="$t('assetcenter_transfer.assetcenter_transfer10')  " />
        </div>
      </div>
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
.paratebox{
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  align-items: stretch;
  flex-direction: column;
}
.paratebox.flexreverse{
  flex-direction: column-reverse;
}
.transfer-wrap{
  .flexMixin(space-between);
  .transfer-col{
    position: relative;
    .flexMixin(flex-start);
    gap: 5px;
    flex-basis: 65%;
    .transfer-mask{
      position: absolute;
      left: 0;
      top: 0;
      background-color: transparent;
      width: 100%;
      height: 100%;
    }
  }
  .transfer-select{
    line-height: 25px;
    position: absolute;
    left: 0;
    top: 30px;
    color: #333;
    background: #fff;
    box-shadow: 0 3px 10px rgba(67,101,255,.24);
    border-radius: 10px;
    z-index: 99;
    padding: 0 12px 10px;
    font-size: 12px;
    .transfer-item{
      padding-top: 10px;
    }
  }
}
.transfer-center{
  text-align: center;
  --van-cell-group-inset-padding:0;
  --van-cell-background:#F0F0F0;
  padding: 15px 0;
  .max-btn{
    color: #2850e7;
  }
  .transfer-ico{
    width: 42px;
    height: 42px;
    margin-top: 10px;
  }
}

.transfer-submit{
  margin-top: 25px;
}
.desc-card{
  --van-step-icon-size:15px;
  --van-step-circle-size:10px;
  .desc-title{
    font-weight: 500;
    font-size: 16px;
    color: #4d4d4d;
    margin-bottom: 13px;
  }
  .desc-span{
    font-size: 12px;
  }
  .history-content{
    min-height: 200px;
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
        }
      }
    }
  }
}
.desc-card.history{
  margin-top: 35px;
}
</style>