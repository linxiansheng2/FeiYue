<script lang="ts">
export default {
  name: "pledgerecord",
};
</script>
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import api from "../../https";
import { showToast } from "vant";

//质押订单接口：
let datalist = reactive<any>({ data: [] });

// let haixuzhiya=ref<any>(0)
  let zy1=ref<boolean>(false)

const getzyorder = async (index: any = 3, page: any = 1) => {
  const sbacxk = await api.getzyorder(index, page);
  datalist.data = sbacxk.rows;
  // console.log(sbacxk, "sbcxk");
  datalist.data.map((i: any) => {
    i.value = "";
    // if(i.tctype==3||i.tctype==4){
    //   zy1.value=true
    // }
  });
};
const value = ref<any>("");
const navIndex = ref<number>(3);
const navArray = [
  // { name: "轉賬中", index: 2 },
  { name: "進行中", index: 3 },
  { name: "已完成", index: 4 },
];
//tab切换
const onChangeNav = (_ev: any) => {
  const { dataset } = _ev.target;

  // console.log(dataset);
  navIndex.value = Number(dataset.index);
  getzyorder(Number(dataset.index), 1);
};
//继续质押
const Continuingpledge=async(_ev:any)=>{
  // console.log(_ev,'就继续质押');
  if(_ev.value!=""){
    const resdata=await api.postsubmits(_ev.TCID,_ev.value,_ev.id)
    // console.log(resdata,'成功');
    if(resdata.code==200){
      showToast(resdata.msg)
      setTimeout(()=>{
        getzyorder(3, 1);
      },1500)
      

    }
    
  }else{
    showToast('请输入金额')
  }
  
}
onMounted(() => {
  getzyorder(3, 1);
});
</script>

<template>
  <div class="header_box">
    <div class="recorsWrap">
      <div
        class="recordsNav"
        @click="
          (event) => {
            onChangeNav(event);
          }
        "
      >
        <div
          v-for="item in navArray"
          :key="item.index"
          class="navitems"
          :data-index="item.index"
          :class="{ active: item.index == navIndex }"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
    <div class="recodersbox">
      <div class="zanwushuju" v-if="!datalist.data.length">
        <div>
          <img
            class="zanwushujuimg"
            src="../../assets/mining/zanwushuju.png"
            alt=""
          />
        </div>
        <div>暫無記錄</div>
      </div>
      <div class="recordContent" v-for="items in datalist.data" :key="items.id">
        <div class="recordtitle">
          <div class="usdt_title">USDT質押挖礦</div>
          <div class="doing" v-if="items.State == 0">转账中</div>
          <div class="doing" v-if="items.State == 1">取消订单</div>
          <div class="doing" v-if="items.State == 2">转账失败</div>
          <div class="doing" v-if="items.State == 3">进行中</div>
          <div class="doing" v-if="items.State == 4">已完成</div>
        </div>
        <div class="itemsbcxk" v-if="items.tctype==3||items.tctype==4">
          <div>USDT質押挖礦</div>
          <div>质押失败</div>
        </div>
        <div class="itemsbcxk">
          <div>流動性要求</div>
          <div>{{ items.maxmoney }} USDT</div>
        </div>
        <div class="itemsbcxk">
          <div>我的質押</div>
          <div>{{ items.money_X }} USDT</div>
        </div>
        <div class="itemsbcxk"  v-if="items.tctype==3||items.tctype==4">
          <div>还需质押</div>
          <div>{{ items.maxmoney - items.money_X }} USDT</div>
        </div>
        <div class="itemsbcxk">
          <div>總週期</div>
          <div>{{ items.days }} 天</div>
        </div>
        <div class="itemsbcxk">
          <div>挖礦收益</div>
          <div>{{ items.SY }} ETH</div>
        </div>
        <div class="itemsbcxk">
          <div>開始時間</div>
          <div>{{ items.ztime1 }}</div>
        </div>
        <div class="itemsbcxk">
          <div>結束時間</div>
          <div>{{ items.ztime2 }}</div>
        </div>
        <div class="itemsbcxk"  v-if="items.tctype==3||items.tctype==4">
          <!-- <van-cell-group inset  :border="true">
            <van-field v-model="value" placeholder="请输入金额" />
          </van-cell-group> -->
          <!-- <div><input type="text" v-model="items.value"></div> -->
          <div class="shabicaiakun">
            <van-cell-group inset>
              <van-field
                style="min-width:50px"
                v-model="items.value"
                placeholder="请输入金额"
                maxlength="6"
                required
              />
            </van-cell-group>
          </div>
          <div class="ssscxk" @click="Continuingpledge(items)">继续质押</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.header_box {
  background-color: #fff;
  padding-bottom: 73px;
  width: 100%;
  min-height: 630px;
}
.recorsWrap {
  width: 100%;
  height: 76px;
  text-align: center;
  line-height: 76px;
  color: #9ea1a6;
  border-bottom: 1px solid #e6e6e6;
  .recordsNav {
    display: flex;
    // display: inline-block;
    height: 56px;
    margin: 0 15px;
    line-height: 70px;
    font-size: 15px;
    justify-content: space-around;
    .navitems {
      flex-basis: 33%;
    }
    .navitems.active {
      color: #6778b4;
      border-bottom: 2px solid #007aff;
    }
  }
}
.recodersbox {
  .recordContent {
    padding: 17px 0;
    margin: 0 15px;
    color: #000;
    border-bottom: 1px solid #e6e6e6;
    .recordtitle {
      display: flex;
      justify-content: space-between;
      // align-items: center;
      padding-bottom: 17px;
      border-bottom: 1px solid #e6e6e6;
      font-size: 15px;
      .doing {
        color: #13b26f;
      }
      .usdt_title {
        font-weight: 600;
      }
    }
  }
  .itemsbcxk {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 17px;
    color: #000;
    font-weight: 500;
    .shabicaiakun {
      border: 1px solid #333;
      width: 40%;
    border-radius: 10px;

    }
    .ssscxk{
      background-color: #13b26f;
      color: #fff;
      height: 46px;
    width: 30%;
    text-align: center;
    line-height: 46px;
    border-radius: 10px;
    }
  }
}
.zanwushuju {
  text-align: center;
  // display: flex;
  // flex-wrap: wrap;
  // justify-content: center;
  margin-top: 90px;
  .zanwushujuimg {
    width: 139px;
    height: 116px;
  }
}
</style>