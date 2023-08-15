<script lang="ts">
export default {
  name: 'deposit',
}
</script>
<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import $api  from '@/https'
  import CusSwiper from '@/components/cusswiper.vue';
  const loading = ref<boolean>(false);
  const requestArr = [$api.getCzmoneySwiper(),$api.getUsermoneylist()]

  // data
  const Store:any = reactive({data:{
    banner:[],
    Usermoneylist:[]
  }})

  // 充值渠道
  onMounted(()=>{
    Promise.all(requestArr)
    .then((res:any[])=>{
      if(res.includes(undefined)){return};
      Store.data.banner = res[0].rows;
      Store.data.Usermoneylist = res[1].rows;
      loading.value = true;
    })
    .catch((err)=>{
      console.log('err',err);
    })
  })

</script>

<template>
  <div v-if="loading">
      <div class="cus-card-box" >
        <div v-if="Store.data.banner.length">
          <CusSwiper :childstore="Store.data.banner" ></CusSwiper>
        </div>
      </div>

      <div class="deposit-list">
        <div class="deposit-item" v-for="item in Store.data.Usermoneylist" :key="item.id" @click="$router.push({
          path:'/assetcenter/withdraw',
          query:{active:1,id:item.id}
        })">
          <div class="deposit-left">
            <van-image width="27" height="27" :src="item.Icon" round/>
            <div class="deposit-name"><span>{{item.ZSname}}-{{ item.Lname }}</span></div>
          </div>
          <div class="deposit-right">
            <div class="deposit-hv">{{item.Lname}}{{ $t('assetcenter_deposit.assetcenter_deposit1') }} </div>
            <div class="deposit-price">{{item.HL}}</div>
          </div>
        </div>
      </div>
  </div>
</template>

<style scoped lang="less">
@cardPadd: 0 15px 15px;
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
  padding: @cardPadd;
}

.deposit-list{
  padding: @cardPadd;
    .deposit-item{
      height: 58px;
      background: #fff;
      box-shadow: 0px 2px 18px rgba(67,101,255,.06);
      border-radius: 15px;
      font-size: 15px;
      .flexMixin(space-between);
      padding: 0 10px;
      margin-bottom: 10px;
      .deposit-left{
        position: relative;
      .flexMixin(flex-start);
        .deposit-name{
          margin-left: 10px;
        }
      }
      .deposit-right{
        line-height: 150%;
        color: #00c693;
        font-weight: bold;
        text-align: right;
        .deposit-hv{
          font-size: 12px;
          color: #111;
        }
      }
    }
  }
</style>