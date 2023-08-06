<script lang="ts">
export default {
  name: "profit-record",
};
</script>
<script setup lang="ts">
import { ref, reactive } from "vue";
</script>

<template>
  <div>
    <div class="jinusdt">
      <div class="flexa">
        <span class="moenytext">金額(USDT)</span>
        <span class="moneyjuti">0</span>
      </div>
      <div class="leijishouyi">
        <div class="proviteitem">
          <span>累計收益</span>
          <span>0</span>
        </div>
        <div class="proviteitem">
          <span>挖礦收益</span>
          <span>0</span>
        </div>
        <div class="proviteitem">
          <span>持有收益率</span>
          <span>0</span>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="bottombox">
        <div class="meiribox">每日收益(ETH)</div>
        <div class="wabox">
          <div class="waox_ico">挖礦收益</div>
          <div class="shujuboxa">
        </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="bottombox">
      
        <div class="wabox">
          <div class="waox_ico">增長百分比</div>
          <div class="shujuboxa">
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
body {
  background: #f3f6fa;
  font-size: 15px;
}
.jinusdt {
  background-image: url(../../assets/mining/beijingtua.png);
  background-size: cover;
  color: #fff;
  overflow: hidden;
  height: 197px;
}
.flexa {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.moenytext {
  margin: 30px 0 10px;
  font-size: 14px;
}
.moneyjuti {
  font-size: 24px;
  font-weight: 500;
}
.leijishouyi {
  display: flex;
  margin: 25px 0 30px;
}
.proviteitem {
  width: 33.33%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
}
.proviteitem::before {
  content: "";
  display: flex;
  position: absolute;
  right: 0;
  bottom: 10px;
  width: 1px;
  height: 25px;
  background: #ccc;
  transform: scaleX(0.5);
}
.bottom {
  background: #f3f6fb;
  padding: 0px 15px;
  .bottombox {
    margin-bottom: 10px;
    .meiribox {
      min-height: 50px;
      display: flex;
      align-items: center;
      font-size: 14px;
      font-weight: 500;
    }
    .wabox {
      min-height: 200px;
      border-radius: 5px;
      background: #fff;
      padding: 5px;
      .waox_ico {
        min-height: 40px;
        position: relative;
        padding-left: 30px;
        display: flex;
        align-items: center;
      }
      .waox_ico::after {
        content: "";
        display: flex;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: #9a9da2;
        position: absolute;
        left: 14px;
      }
    }
    .shujuboxa {
      width: 100%;
      height: 260px;
      user-select: none;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      border-bottom: 1px solid #9f9a9a;
    }
  }
}
</style>