<script lang="ts">
export default {
  name: "index",
};
</script>
<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import api from "../../https";
import { useStore } from "vuex";
import { useI18n } from 'vue-i18n'
const { locale , t } = useI18n();

const $store = useStore();
const anboutzong = reactive<any>({ data: {} });
const getlogoa = async () => {
  const res = await api.getlogoa();
  console.log(res, "11");

  if (res && res["code"] == 200) {
    anboutzong.data = res.data;
    console.log(anboutzong.value, "anboutzong.value");
  }
};
// const WebConfig = computed(()=>$store.state.webconfig.value.title);
// console.log(WebConfig,'rldw');

// anboutzong.value=WebConfig
const datas = reactive<any>({ data: {} });
const flag = ref<boolean>(false);
const postabout = async () => {
  const sbcxk = await api.postabout();
  console.log(sbcxk, "sb");

  if (sbcxk && sbcxk["code"] == 200) {
    datas.data = sbcxk;
    flag.value = true;
  }
};
onMounted(() => {
  postabout();
  getlogoa();
});
</script>

<template>
  <div v-if="flag">
    <div class="about_top">
      <h1 class="about_h1">{{$t('about_index.about_index1')  }}</h1>
      <p class="desc">{{$t('about_index.about_index2')  }}</p>
      <img class="desc_img" src="../../assets/mining/ETH-1.png" alt="" />
      <h3 class="tit">{{ anboutzong.data.h5_title }} {{$t('about_index.about_index3')  }}</h3>
      <p class="desc2 pdolor">
        {{$t('about_index.about_index4')  }}
      </p>
      <div class="content">
        <div class="circuit-top">
          <img style="width: 100%" src="../../assets/mining/362a.png" alt="" />
        </div>
        <div class="about-box">
          <div class="box">
            <p class="tit1">0.05%</p>
            <p>{{$t('about_index.about_index32')  }}</p>
          </div>
          <div class="box">
            <p class="tit1">200+</p>
            <p>{{$t('about_index.about_index5')  }}</p>
          </div>
          <div class="box">
            <p class="tit1">100+</p>
            <p>{{$t('about_index.about_index6')  }}</p>
          </div>
          <div class="box">
            <p class="tit1">24 / 7</p>
            <p>{{$t('about_index.about_index7')  }}</p>
          </div>
        </div>
        <h3 class="tit" style="margin-top: 20px">{{$t('about_index.about_index8')  }}</h3>
        <div class="tit_p">
          <p class="pdolor">
            <span
              >{{$t('about_index.about_index9')  }}</span
            ><span>
              {{$t('about_index.about_index10')  }}
            </span>
          </p>
          <!-- <p class="pdolor">
            根據每天的現貨交易量和深厚的流動性，我們一直被評為全球
            十大受監管的加密貨幣量化交易所之一。我們致力於提供出色的用戶體驗和世界一流的服務水平。
          </p>
          <p>
            我們的使命是建立一個適合所有市場參與者的安全且
            先進的加密貨幣生態系統。的核心是機構級交易所，可通過進入新市場和法
            定網關來滿足區塊鏈項目和消費者的需求。
          </p> -->
        </div>
        <div>
          <h3 class="tit" style="margin-top: 20px">
            {{$t('about_index.about_index11')  }}
          </h3>
          <div>
            <p class="pdolor">
              {{$t('about_index.about_index12')  }}
            </p>
            <p class="pdolor">
              {{$t('about_index.about_index13')  }}
            </p>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="circuit-top">
          <img style="width: 100%" src="../../assets/mining/362a.png" alt="" />
        </div>
        <h3 class="tit" style="margin-top: 20px">{{$t('about_index.about_index14')  }} DAI-TEST</h3>
        <div class="why-warp">
          <!-- <img class="desc_img" src="../../assets/mining/jie2.png" alt=""> -->
          <div>
            <img class="why_imng" src="../../assets/mining/about1.png" alt="" />
          </div>
          <div class="why_title">
            <h5 class="why-tit">{{$t('about_index.about_index15')  }}</h5>
            <p class="why_p">{{$t('about_index.about_index16')  }}</p>
          </div>
        </div>
        <div class="why-warp">
          <!-- <img class="desc_img" src="../../assets/mining/jie2.png" alt=""> -->
          <div>
            <img class="why_imng" src="../../assets/mining/about2.png" alt="" />
          </div>
          <div class="why_title">
            <h5 class="why-tit">{{$t('about_index.about_index17')  }}</h5>
            <p class="why_p">
              {{$t('about_index.about_index18')  }}
            </p>
          </div>
        </div>
        <div class="why-warp">
          <!-- <img class="desc_img" src="../../assets/mining/jie2.png" alt=""> -->
          <div>
            <img class="why_imng" src="../../assets/mining/about3.png" alt="" />
          </div>
          <div class="why_title">
            <h5 class="why-tit">{{$t('about_index.about_index19')  }}</h5>
            <p class="why_p">
              DAI-TEST{{$t('about_index.about_index20')  }}
            </p>
          </div>
        </div>
        <div class="why-warp">
          <!-- <img class="desc_img" src="../../assets/mining/jie2.png" alt=""> -->
          <div>
            <img class="why_imng" src="../../assets/mining/about4.png" alt="" />
          </div>
          <div class="why_title">
            <h5 class="why-tit">{{$t('about_index.about_index21')  }}</h5>
            <p class="why_p">
              {{$t('about_index.about_index22')  }}
            </p>
          </div>
        </div>
        <div class="why-warp">
          <!-- <img class="desc_img" src="../../assets/mining/jie2.png" alt=""> -->
          <div>
            <img class="why_imng" src="../../assets/mining/about5.png" alt="" />
          </div>
          <div class="why_title">
            <h5 class="why-tit">{{$t('about_index.about_index23')  }}</h5>
            <p class="why_p">
              {{$t('about_index.about_index24')  }}
            </p>
          </div>
        </div>
      </div>
      <div class="content">
        <h2 class="sbcxk">{{$t('about_index.about_index25')  }}</h2>
        <p>{{$t('about_index.about_index26')  }}</p>
        <div>
          <img class="desc_img2" src="../../assets/mining/phone.png" alt="" />
        </div>
        <div class="abotomm">
          <!-- <img class="desc_img" src="../../assets/mining/xiajie.png" alt="" /> -->
          <div>
            <img class="abotommimg" src="../../assets/mining/about6.png" />
          </div>
          <p class="abotomm_sui">{{$t('about_index.about_index27')  }}</p>
        </div>
        <div class="abotomm">
          <!-- <img class="desc_img" src="../../assets/mining/xiajie.png" alt="" /> -->
          <div>
            <img class="abotommimg" src="../../assets/mining/about6.png" />
          </div>
          <p class="abotomm_sui">{{$t('about_index.about_index28')  }}</p>
        </div>
        <div class="abotomm">
          <!-- <img class="desc_img" src="../../assets/mining/xiajie.png" alt="" /> -->
          <div>
            <img class="abotommimg" src="../../assets/mining/about6.png" />
          </div>
          <p class="abotomm_sui">{{$t('about_index.about_index29')  }}</p>
        </div>
        <div class="abotomm">
          <!-- <img class="desc_img" src="../../assets/mining/xiajie.png" alt="" /> -->
          <div>
            <img class="abotommimg" src="../../assets/mining/about6.png" />
          </div>
          <p class="abotomm_sui">{{$t('about_index.about_index30')  }}</p>
        </div>
        <div class="abotomm">
          <!-- <img class="desc_img" src="../../assets/mining/xiajie.png" alt="" /> -->
          <div>
            <img class="abotommimg" src="../../assets/mining/about6.png" />
          </div>
          <p class="abotomm_sui">{{$t('about_index.about_index31')  }}</p>
        </div>
      </div>
    </div>
    <div class="bbbom">
      <p class="bomp">CopyRight@2023 All Rights Reserved</p>
    </div>
    <!-- <div class="about_top"> -->
    <!-- <img class="about_img" :src=datas.data.data1.img  alt=""> -->
    <!-- <div class="shaniao" v-html="datas.data.data1.body"></div> -->

    <!-- </div> -->
    <!-- <div></div> -->
  </div>
</template>

<style scoped lang="less">
:deep(.shaniao img) {
  width: 100%;
}
.pdolor {
  color: #1e2329;
  font-size: 15px;
}
.about_top {
  padding: 0 19px;
  margin-top: -20px;
  background-color: #fff;
}
.about_img {
  width: 100%;
}
.about_h1 {
  font-size: 28px;
  margin: 19px 0;
  text-align: center;
}
.why-tit {
  font-size: 20px;
  margin: 0 0 5px;
  text-align: center;
}
.why_p {
  font-size: 17px;
  margin: 0 auto;
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
  font-size: 31px;
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
.why_imng {
  width: 55px;
  // height: 60px;
}
.why-warp {
  // display: grid;
  // grid-template-columns: 1fr;
  // gap: 40px;
  display: flex;
  text-align: center;
  margin: 27px 0;
  align-items: center;
}
.why_title {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.sbcxk {
  font-size: 27px;
  margin-top: 0px;
  text-align: center;
}
.desc_img2 {
  width: 90%;
  margin: 20px auto;
  display: block;
}
.bottoma {
  background-color: #1f242a;
  padding: 20px 20px 21px;
  .bottomp {
    font-size: 14px;
    color: rgb(255, 255, 255);
    text-align: center;
  }
}
.abotomm {
  display: flex;
  align-items: center;
}
.abotomm_sui {
  font-weight: 600;
  margin-left: 20px;
  flex: 1 1 0%;
  text-align: left;
  font-size: 16px;
  margin: 20px 0 20px 15px;
}
.abotommimg {
  width: 41px;
  height: 41px;
}
.bbbom {
  background-color: #1f242a;
  padding: 20px 20px 21px;
}
.bomp {
  font-size: 14px;
  color: rgb(255, 255, 255);
  text-align: center;
}
</style>