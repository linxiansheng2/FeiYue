<script lang="ts">
export default {
  name: "faq",
};
</script>
<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";

</script>

<template>
  <div class="tantantan">
      <p>1.我需要如何加入？</p>
      <br/>
      <p>您需要向礦池授權您的錢包,授權後選擇質押挖礦與非質押挖礦,開始產量農業您需要支付少量ETH的礦工費用,支付後即可開始挖礦。</p>
      <br/>
    <p>2.什麼是非質押和質押挖礦</p>
    <br/>
    <p>非質押DeFi流動性採礦只需要您將加密貨幣存入您的錢包中即可進行挖礦。質押DeFi流動性採礦則是將加密貨幣質押到礦池通過智能合約獲得更高的收益。 </p>
    <br/>
      <p>3.如何提現？</p>
      <br/>
      <p>您需要將每天開采的ETH轉換為USDT,然後開始提款,
        請注意,為了提取USDT,您應該有一些ETH作為礦工費,
        您提款的USDT將自動到達您所授權的錢包。</p>
        <br/>
        <p>4.收入如何計算？</p>
        <br/>
        <p>加入成功後,系統將開始通過智能合約計算您持有的USDT數量,非質押挖礦日收益百分比為:</p>
        <p>1~1999 USDT, 24.00%</p>
        <p>2000~4999 USDT, 31.20%</p>
        <p>5000~9999 USDT, 38.40%</p>
        <p>10000~19999 USDT, 48.00%</p>
        <p>20000~49999 USDT, 55.20%</p>
        <p>50000~200000 USDT, 60.00%</p>
        <p>注:以上提供的條款視您錢包內資產在12小時內未提取的事實而定,12小時後,開采的ETH可以每12小時提取一次。</p>
        <br/>
        <p>5. 如何獲得分享獎金？</p>
        <br/>
        <p>通過您的邀請鏈接加入的每個人,你可以獲得以下三級分成,例如:A分享B,A可獲得B每日收益的20%,B分享C,A可以獲得C每日收益的10%,C分享D,A可獲得D每日收益的5%，以此類推。</p>
    </div>
</template>

<style scoped lang="less">
.tantantan{
  padding: 0 15px;
    height: 100%;
    font-size: 15px;
    color: #000;
}
</style>