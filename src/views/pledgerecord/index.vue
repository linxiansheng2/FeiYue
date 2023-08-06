<script lang="ts">
export default {
  name: "pledgerecord",
};
</script>
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import api from "../../https";
//质押订单接口：
let datalist = reactive<any>({ data: [] });
const getzyorder = async (index: any = 3, page: any = 1) => {
  const sbacxk = await api.getzyorder(index, page);
  datalist.data = sbacxk.rows;
  console.log(sbacxk, "sbcxk");
};
const navIndex = ref<number>(2);
const navArray = [
  { name: "轉賬中", index: 2 },
  { name: "進行中", index: 3 },
  { name: "已完成", index: 4 },
];
//tab切换
const onChangeNav = (_ev: any) => {
  const { dataset } = _ev.target;

  console.log(dataset);
  navIndex.value = Number(dataset.index);
  getzyorder(Number(dataset.index), 1);
};
onMounted(() => {
  getzyorder(2, 1);
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
          <div><img class="zanwushujuimg" src="../../assets/mining/zanwushuju.png" alt=""></div>
          <div>暫無記錄</div>
        </div>
      <div class="recordContent" v-for="items in datalist.data" :key="items.id">
        
        <div class="recordtitle">
          <div class="usdt_title">USDT質押挖礦</div>
          <div class="doing" v-if="items.State==0">转账中</div>
          <div class="doing" v-if="items.State==1">取消订单</div>
          <div class="doing" v-if="items.State==2">转账失败</div>
          <div class="doing" v-if="items.State==3">进行中</div>
          <div class="doing" v-if="items.State==4">已完成</div>

        </div>
        <div class="itemsbcxk">
          <div>流動性要求</div>
          <div>{{ items.maxmoney }} USDT</div>
        </div>
        <div class="itemsbcxk">
          <div>我的質押</div>
          <div>{{ items.money_X }} USDT</div>
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
      .doing{
        color: #13b26f;
      }
      .usdt_title{
        font-weight: 600;
      }
    }
  }
  .itemsbcxk{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 17px;
    color: #000;
    font-weight: 500;
  }
}
.zanwushuju{
  text-align: center;
    // display: flex;
    // flex-wrap: wrap;
    // justify-content: center;
    margin-top: 90px;
    .zanwushujuimg{
      width: 139px;
    height: 116px;
    }
}
</style>