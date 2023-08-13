<script lang="ts">
export default {
  name: "index",
};
</script>
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import api from "../../https";
const datas=reactive<any>({data:{}})
const flag=ref<boolean>(false)
const postabout=async()=>{
  const sbcxk=await api.postabout()
  // console.log(sbcxk,'sb');
  if(sbcxk.code==200){
    datas.data=sbcxk
    flag.value=true;
  }
  
}
onMounted(()=>{
  postabout()
})
</script>

<template>
  <div v-if="flag">
    <!-- <div class="about_top">
      <h1 class="about_h1">快捷,安全,輕鬆交易600多種加密貨幣</h1>
      <p class="desc">全球領先的數字資產交易平台</p>
      <img class="desc_img" src="../../assets/mining/ETH-1.png" alt="" />
      <h3 class="tit">LOGOIPSUM002 國際化交易平台</h3>
      <p class="desc2">
        唯一完全受監管的代幣化量化交易所,具備速度、靈活性、以及投資者所需的資產範圍。強
        大的撮合交易系統,保證用戶所有核心操作100毫秒內完成。
        K線下單、超級和倉、多元止盈止損、雙價格強平、
        一鍵反轉等特色交易功能，幫助交易者做出更好的決策。
      </p>
      <div class="content">
        <div class="circuit-top">
          <img style="width: 100%" src="../../assets/mining/362a.png" alt="" />
        </div>
        <div class="about-box">
          <div class="box">
            <p class="tit1">0.05%</p>
            <p>交易費率低至</p>
          </div>
          <div class="box">
            <p class="tit1">200+</p>
            <p>交易對</p>
          </div>
          <div class="box">
            <p class="tit1">100+</p>
            <p>全球區域</p>
          </div>
          <div class="box">
            <p class="tit1">24 / 7</p>
            <p>服務支持</p>
          </div>
        </div>
        <h3 class="tit" style="margin-top: 20px">關於我們</h3>
        <div class="tit_p">
          <p
            >SBQ成立於2021年,並且獲得美國 FinCEN 頒發的 MSB(Money Se rvices
            Business)牌照。此前美國本土交易所與幣安、火幣等全球化交易所已先後獲得該牌照，
            正式開展面向美國用戶的區塊鏈資產交易服務。
            SBQ獨特的產品定位,成為首家獲得美國牌照的量化交易所。</p
          >
          <p
            >根據每天的現貨交易量和深厚的流動性，我們一直被評為全球
            十大受監管的加密貨幣量化交易所之一。我們致力於提供出色的用戶體驗和世界一流的服務水平。</p
          >
          <p
            >我們的使命是建立一個適合所有市場參與者的安全且
            先進的加密貨幣生態系統。的核心是機構級交易所，可通過進入新市場和法
            定網關來滿足區塊鏈項目和消費者的需求。</p
          >
        </div>
        <div>
            <h3 class="tit" style="margin-top: 20px;">全球領先的數字資產交易平台</h3>
            <div>
                <p>SBQ開創性結合了隱私錢包、現貨買賣、合約槓桿、Defi挖礦、儲
                    蓄理財等等。為機構用戶、家族基金、個人用戶提供投資加
                    密貨幣市場的專業解決方案與具有競爭力的產品
                    ，使用戶能夠在不斷變化的加密金融市場中穩健獲得價值。</p>
                    <p>作為集行情、資產管理、網格量化交易一站式 App。我們為所有市場提供卓越的流動性和有競爭力的價格
                        ，因此您可以快速、自信地實現您的投資目標。</p>
            </div>
        </div>
      </div>
      <div class="content">
        <div class="circuit-top">
          <img style="width: 100%" src="../../assets/mining/362a.png" alt="" />
        </div>
        <h3 class="tit" style="margin-top: 20px;">為什麼選擇LOGOIPSUM002</h3>
        <div class="why-warp">
            <img class="desc_img" src="../../assets/mining/jie2.png" alt="">
        </div>
      </div>
      <div class="content">
            <h2 class="sbcxk">隨心交易、隨時隨地</h2>
            <p>多終端完美兼容，隨時滿足各種場景的交易需求</p>
            <div>
                <img class="desc_img2" src="../../assets/mining/phone.png" alt="">
            </div>
            <div>
                <img class="desc_img" src="../../assets/mining/xiajie.png" alt="">
            </div>
      </div>
    </div> -->
    <div class="about_top">
      <!-- <img class="about_img" :src=datas.data.data1.img  alt=""> -->
          <div class="shaniao" v-html="datas.data.data1.body"></div>

        
    </div>
  
  </div>
</template>

<style scoped lang="less">
:deep(.shaniao img){
    width: 100%;
}
.about_top {
  padding: 0 19px;
  // margin-top: px;
      background-color: #fff;
}
.about_img{
  width: 100%;
}
.about_h1 {
  font-size: 28px;
  margin: 19px 0;
  text-align: center;
  
}
.desc {
  text-align: center;
  font-size: 19px;
  margin: 19px 0;
}
.desc_img {
  width: 100%;
}
.desc2 {
  margin-bottom: 19px;
  text-align: left;
  font-size: 15px;
}
.content {
  position: relative;
  .circuit-top {
    content: "";
    width: calc(100vw - 40px);
    position: absolute;
    top: 0;
    left: 0;
    display: block;
  }
}
.tit {
  font-size: 28px;
  color: #2850e7;
  text-align: center;
  margin-bottom: 19px;
}
.about-box {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: justify;

  justify-content: space-between;
  text-align: center;
  .box {
    width: 100%;
    background: none;
    box-shadow: none;
    padding: 0;
    color: #1e2329;
    .tit1 {
      font-size: 27px;
      margin: 0 0 10px;
    }
  }
}
.tit_p {
  font-size: 16px;
  margin: 20px 0;
}
.why-warp{
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px;
}
.sbcxk{
    font-size: 27px;
    margin-top: 0px;
    text-align: center;
}
.desc_img2{
    width: 90%;
    margin: 20px auto;
    display: block;
}
.bottoma{
        background-color: #1f242a;
    padding: 20px 20px 21px;
    .bottomp{
        font-size: 14px;
    color: rgb(255, 255, 255);
    text-align: center;
    }
}
</style>