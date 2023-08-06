<script lang="ts">
export default {
  name: "index",
};
</script>
<script setup lang="ts">
import { ref, reactive } from "vue";
const time = ref(1800  * 60 * 60 * 1000);
</script>

<template>
  <div>
    <div class="bw-page-header">
      <div class="blog-inner">
        <img
          class="blog_img"
          src="../../assets/mining/guanfanglog.png"
          alt=""
        />
      </div>
      <div class="margin_top_20">
        <span>庆祝NFTPENDST 会员总数突破50万</span>
      </div>
      <div class="blog_title">
        <p>
          庆祝NFTPENDST 会员总数突破50万
          <br />
          <br />
          特别举行亿万补贴活动,每位会员参与质押即可获得不同金额USDT奖励
          <br />
          <br />
          质押金额10000USDT 奖励500USDT
        </p>
        <p>
          <br />
          质押金额30000USDT 奖励1000USDT
        </p>
        <p>
          <br />
          质押金额50000USDT 奖励3000USDT
        </p>
        <p>
          <br />
          质押金额100000USDT 奖励5000USDT
        </p>
        <p>
          <br />
          质押金额200000USDT以上 奖励10000USDT
        </p>
        <p>
          <br />
          辛勤劳动硕果累累，乐于分享成就梦想！
          <br />
          活动期间，老用户邀请新用户验证并完成首次质押，老用户可获得$100的活动奖励,
          新用户可获得$20的活动奖励,奖励可叠加。
        </p>
        <p>
          <br />
          2022-08-11 -2022-09-13(限时)
        </p>
        <p>
          <br />
          *具体详情请咨询客服。
        </p>
      </div>
      <div class="time">
        <span>結束時間：</span>
        <!-- <van-count-down :time="time" format="DD 天 HH 时 mm 分 ss 秒" /> -->
        <van-count-down :time="time">
  <template #default="timeData">
    <span class="block">{{ timeData.days }}</span>
    <span class="tian">天</span>
    <span class="colon">:</span>
    <span class="block">{{ timeData.hours }}</span>
    <span class="colon">:</span>
    <span class="block">{{ timeData.minutes }}</span>
  </template>
</van-count-down>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
body {
  width: 100%;
  height: 100%;
  font-family: MyWebFont;
  background: #f4f6f8;
  font-size: 12px;
  font-weight: 500;
  color: #000;
}
.bw-page-header {
  margin-top: 20px;
}
.blog-inner {
  padding: 0 11px;
}
.blog_img {
  width: 100%;
  height: 147px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
.margin_top_20 {
  color: #4d4d4d;
  font-weight: 500;
  font-size: 20px;
  line-height: 150%;
  margin: 16px 0 21px 10px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 21px;
}
.blog_title {
  font-size: 14px;
  font-weight: 400;
  color: #4d4d4d;
  line-height: 150%;
  margin-left: 10px;
}
.time{
    height: 48px;
    background: #2850e7;
    border-radius: 14px;
    color: #fff;
    font-weight: 500;
    font-size: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 52px;
    margin-bottom: 76px;
}
.colon {
    display: inline-block;
    margin: 0 3px;
    color: #fff;
  }
  .block {
    display: inline-block;
    width: 22px;
    color: #fff;
    font-size: 15px;
    text-align: center;
  }
  .tian{
    color: #fff;
  }
</style>