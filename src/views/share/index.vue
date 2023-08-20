<script lang="ts">
export default {
  name: "index",
};
</script>
<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import useClipboard from "vue-clipboard3";
import { showToast } from "vant";
import "vant/es/toast/style";
import api from "../../https";
import { Popup } from "vant";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import QRCode from "qrcode";
import html2canvas from "html2canvas";
import { useI18n } from "vue-i18n";
const { locale, t } = useI18n();
const $store = useStore();
const userStore = computed(() => $store.state.userinfo);
console.log(userStore, "sbcxk", userStore.value.address);

const router = useRouter();
const { toClipboard } = useClipboard();

//获取当前域名
const link = ref<string>('')
const gethref = () => {
  var regex = /^(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*)/i;
  var newsLink:any= '';
  let newHref = location.href;
  if(newHref.includes('#')){
    newsLink = newHref.split('#')[0]
  }else{
    let isinclude = newHref.match(regex)
    newsLink = isinclude ? isinclude[0]: window.location.hostname ;
  }
  link.value = newsLink + '#/';
}
const copy1 = async (val: any) => {
  console.log(val, "dianji");
  // let cocxk
  // postyaoqing(userStore.value.address,userStore.value.id)
  try {
    await toClipboard(val);
    showToast(t("share_index.share_index31"));
    // console.log("chenggl");
  } catch (e) {
    // Toast.fail(e)
    showToast(t("share_index.share_index32"));
    // console.log("shibai");
  }
};
const copy2 = async (val: any) => {
  console.log(val, "fuzhi2");

  try {
    await toClipboard(val);
    showToast(t("share_index.share_index31"));
    // console.log("chenggl");
  } catch (e) {
    // Toast.fail(e)
    showToast(t("share_index.share_index32"));
    // console.log("shibai");
  }
};
//邀请接口
// const postyaoqing = async (address: any, ycode: any) => {
//   const res = await api.postyaoqing(address, ycode);
//   console.log(res, "yaoqingchenggong");
// };
//跳详情
const toxiangqing = () => {
  router.push("/guidance");
};
//二维码弹出
const show = ref<boolean>(false);
const erweimatanchu = () => {
  // console.log("saaa");
  show.value = true;
};
// 分享弹出
const shows = ref<boolean>(false);
const fenxianghaibao = () => {
  shows.value = true;
};
//返回
const fanhuia = () => history.back();
const flags = ref<boolean>(false);
let data = reactive<any>({ data: {} });
const getamout = async () => {
  const datas = await api.getamout();
  console.log(datas, "邀请数据");
  if (datas && datas.code == 200) {
    data.data = datas.data;
    flags.value = true;
  }
};
//邀请返佣比例
let sbdata = reactive<any>({ data: {} });
const getrebeta = async () => {
  const sbcxk = await api.getrebeta();
  // console.log(sbcxk, "返佣比例");
  if (sbcxk && sbcxk.code == 200) {
    sbdata.data = sbcxk.rebate;
    flags.value = true;
  }
};
//弹出
const showa = ref<boolean>(false);
const showPopup = () => {
  // console.log('aaaa');

  showa.value = true;
};
//问号
const datasa = reactive<any>({ data: {} });
const getauxii = async () => {
  const ress = await api.getauxii();
  // console.log(ress,'sb');
  if (ress && ress.code == 200) {
    datasa.data = ress.data1;
  }
};

//生成图片
const convertToImage = async () => {
  const element: any = document.getElementById("poster");

  try {
    // 使用html2canvas将HTML元素转换为canvas
    const canvas = await html2canvas(element);

    // 创建一个临时链接
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    // 设置下载的文件名
    link.download = "screenshot.png";
    link.click();
  } catch (error) {
    // 处理错误
    console.error("转换为图片时发生错误:", error);
  }
};

const Config = JSON.parse(sessionStorage.getItem('vuex') as string);
const qrcodeImg = 'data:image/png;base64,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'

//log
const logotu=reactive<any>({data:{}})
 const getlogoa=async()=>{
  const res=await api.getlogoa()
  console.log(res,'logoa')
  if(res&&res.code==200){
    logotu.data=res.data
  }
 }
onMounted(() => {
  getamout();
  getrebeta();
  getauxii();
  gethref();
  getlogoa();
});
</script>

<template>
  <div class="aaaaaa" v-if="flags">
    <div class="yao_top">
      <div class="share_heade">
        <div @click="fanhuia">
          <img class="share_img1" src="../../assets/share/backa.png" alt="" />
        </div>
        <div @click="showPopup">
          <img class="share_img2" src="../../assets/share/wenhao.png" alt="" />
        </div>
      </div>
      <div class="share-top-tip">{{ $t("share_index.share_index1") }}</div>
      <div class="share-top-tip2">
        {{ $t("share_index.share_index2") }} 5 %APR
        {{ $t("share_index.share_index3") }}
      </div>
      <div class="share-step">
        <div class="share_cxk">
          <img class="share_img1" src="../../assets/share/tuijian.png" alt="" />
          <div>
            <span>{{ $t("share_index.share_index4") }}</span>
          </div>
        </div>
        <div class="line"></div>
        <div class="share_cxk">
          <img class="share_img1" src="../../assets/share/pengyou.png" alt="" />
          <div>
            <span>{{ $t("share_index.share_index5") }}</span>
          </div>
        </div>
        <div class="line"></div>
        <div class="share_cxk">
          <img class="share_img1" src="../../assets/share/duihuan.png" alt="" />
          <div>
            <span>{{ $t("share_index.share_index6") }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="yao_bottom">
      <div class="share-code-box">
        <div class="share-code-top">{{ $t("share_index.share_index7") }}</div>
        <div class="share-code-bottom">
          <div class="share_list">
            <div class="sbcode">{{ $t("share_index.share_index8") }}</div>
            <div class="code">
              <div>{{ data.data.Invitationcode }}</div>
              <div @click="copy1(data.data.Invitationcode)">
                <img
                  class="code_copy"
                  src="../../assets/share/cope.png"
                  alt=""
                />
              </div>
            </div>
          </div>
          <div class="share_list">
            <div>{{ $t("share_index.share_index9") }}</div>
            <div class="code" @click="copy2(link + data.data.Invitationcode)">
              <div class="code_yao">
                {{ link + data.data.Invitationcode }}
              </div>
              <div>
                <img
                  class="code_copy"
                  src="../../assets/share/cope.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
        <div class="share-generation">
          <div class="lists">
            <div class="lists_shu">{{ sbdata.data.rebate1 }}%</div>
            <div class="lists_yi">{{ $t("share_index.share_index10") }}</div>
          </div>
          <div class="lists">
            <div class="lists_shu">{{ sbdata.data.rebate2 }}%</div>
            <div class="lists_yi">{{ $t("share_index.share_index11") }}</div>
          </div>
          <div class="lists">
            <div class="lists_shu">{{ sbdata.data.rebate3 }}%</div>
            <div class="lists_yi">{{ $t("share_index.share_index12") }}</div>
          </div>
        </div>
        <div class="post-qr">
          <div class="share-qr" @click="erweimatanchu">
            <img
              class="post_img1"
              src="../../assets/share/erweima.png"
              alt=""
            />
          </div>
          <div class="post_haibao" @click="fenxianghaibao">
            {{ $t("share_index.share_index13") }}
          </div>
        </div>
      </div>
      <div class="share-wrap">
        <van-swipe
          style="height: 50px"
          vertical
          :autoplay="3000"
          :show-indicators="false"
        >
          <van-swipe-item>
            <div class="ssabcxk">
              <img
                class="swipe"
                src="../../assets/share/swipe.png"
                alt=""
              /><span class="swipe_span"
                >❤️{{ $t("share_index.share_index14") }} ❤️0x7AD0***SsK2
                {{ $t("share_index.share_index15") }} $6000
              </span>
            </div>
          </van-swipe-item>
          <van-swipe-item
            ><div class="ssabcxk">
              <img
                class="swipe"
                src="../../assets/share/swipe.png"
                alt=""
              /><span class="swipe_span"
                >❤️{{ $t("share_index.share_index14") }} ❤️0x1Ad0***SsK2
                {{ $t("share_index.share_index15") }} $3000
              </span>
            </div></van-swipe-item
          >
          <van-swipe-item
            ><div class="ssabcxk">
              <img
                class="swipe"
                src="../../assets/share/swipe.png"
                alt=""
              /><span class="swipe_span"
                >❤️{{ $t("share_index.share_index14") }} ❤️0a3AD0***SsK2
                {{ $t("share_index.share_index15") }} $61000
              </span>
            </div></van-swipe-item
          >
          <van-swipe-item
            ><div class="ssabcxk">
              <img
                class="swipe"
                src="../../assets/share/swipe.png"
                alt=""
              /><span class="swipe_span"
                >❤️{{ $t("share_index.share_index14") }} ❤️0l9Ad0***SsK2
                {{ $t("share_index.share_index15") }} $15000
              </span>
            </div></van-swipe-item
          >
        </van-swipe>
      </div>
      <div class="share-rebateBox">
        <div class="titlea">
          <div class="title_shouyi">{{ $t("share_index.share_index16") }}</div>
          <div class="title_xiangqing" @click="toxiangqing">
            {{ $t("share_index.share_index17") }}<van-icon name="arrow" />
          </div>
        </div>
        <div class="contents">
          <div class="two_list">
            <div class="listary">
              <div class="fanfan">
                <span>{{ data.data.RebateAmount }}</span>
              </div>
              <div class="wodea">
                <span>{{ $t("share_index.share_index18") }}</span>
              </div>
            </div>
            <div class="listary">
              <div class="fanfan">
                <span>{{ data.data.TotalPeople }}</span>
              </div>
              <div class="wodea">
                <span>{{ $t("share_index.share_index19") }}</span>
              </div>
            </div>
          </div>
          <div class="items">
            <div>{{ $t("share_index.share_index20") }} (USDT)</div>
            <div>{{ data.data.Rebateamountoftheday }}</div>
          </div>
          <div class="items">
            <div>{{ $t("share_index.share_index21") }}</div>
            <div>{{ data.data.Numberofpeopletradedontheday }}</div>
          </div>
          <div class="items">
            <div>{{ $t("share_index.share_index22") }}</div>
            <div>{{ data.data.Transactionamountoftheday }}</div>
          </div>
          <div class="items">
            <div>{{ $t("share_index.share_index23") }}</div>
            <div>{{ data.data.TotalPeopleday }}</div>
          </div>
        </div>
      </div>
      <div class="rebateBox">
        <!-- <img class="imgbottom" src="../../assets/share/fenpei.png" alt="" /> -->
        <div class="rebateBoxtitle">{{ $t("share_index.share_index33") }}</div>
        <div class="rebateBoxxiang">{{ $t("share_index.share_index34") }}</div>
        <div class="rebateBoxfen">{{ $t("share_index.share_index35") }}</div>
        <!-- <div class="po2">{{ $t("share_index.share_index36") }}</div> -->
        <div class="po3">5%</div>
        <div class="po4">3%</div>
        <div class="po5">1%</div>
      </div>
    </div>
    <!-- 二维码弹出 -->
    <div class="tanchu" v-if="show == true">
      <div class="ssbbcxk">
        <div class="shareqr">
          <img
            class="shareqrimg"
            src="../../assets/share/saoerweima.png"
            alt=""
          />
        </div>
        <div class="titless">{{ $t("share_index.share_index24") }}</div>
        <div class="contenssss">
         
          <erweima />
        </div>
        <div class="guantua">
          <img
            class="guantuaimg"
            :src=logotu.data.h5_logo
            alt=""
          />
        </div>
      </div>
  

      <div class="chachaa" @click="show = false">
        <van-icon name="cross" />
      </div>
    </div>
    <!-- 海报 -->
    <!-- <div v-if="shows == true" id="haibaobao"> -->
      <!-- <div class="haibaoaa">
        
        <p class="xinsheng">{{ $t("share_index.share_index25") }}</p>
        <div class="dinga">
          <div class="tanse">
            <p class="tuijian">
              {{ $t("share_index.share_index26") }}
              {{ data.data.Invitationcode }}
            </p>
          </div>
          <div class="erweim">
            <div class="erweileft">
              <div>
                <img  class="erweilog" :src=logotu.data.h5_logo alt="">
              </div>
              <div class="erweirigth">
                <div class="dai">{{ logotu.data.h5_title }}</div>
                <div class="shouge">{{ $t("share_index.share_index27") }}</div>
              </div>
            </div>

            <div class="erwaiaa"></div>
          </div>
        </div>
      </div> -->
      <van-overlay :show="shows" @click="shows = false">
        <div class="poster-content" id="poster">
          <div class="poster-box">
            <div class="poster-tit">{{ $t("share_index.share_index25") }}</div>
            <div class="poster-img"  :style="{'zIndex':-1}"><img src="../../assets/share/haibao2.png" alt="posterImg" /></div>
            <div class="poster-info">
              <div class="custit">{{ `${$t("share_index.share_index26")}${data.data.Invitationcode}` }}</div>
              <div class="cusinfo">
                <div class="cuslogo">
                  <img :src="Config?Config.webconfig.h5_logo:'#'" alt="logo">
                </div>
                <div class="custxt">
                  <div>{{ logotu.data.h5_title }}</div>
                  <div>{{ $t("share_index.share_index27") }}</div>
                </div>
                <div class="cusimg">
                  <img :src="qrcodeImg" alt="code">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="poster-list">
          <div class="cancel" @click="shows = false">
            {{ $t("share_index.share_index28") }}
          </div>
          <div class="save" @click="convertToImage">
            {{ $t("share_index.share_index29") }}
          </div>
        </div>
    </van-overlay>
    <!-- </div> -->
    <!-- <div class="bottom_box" v-if="shows == true">
      <div class="bottom_quxiao" @click="shows = false">
        {{ $t("share_index.share_index28") }}
      </div>
      <div class="bottom_baocun" @click="convertToImage()">
        {{ $t("share_index.share_index29") }}
      </div>
    </div> -->
   
    <div class="wenhao_box" v-if="showa">
      <div class="wenhao_zong">
        <div class="wenhao_title">{{ datasa.data.title }}</div>
        <!-- <div><img class="wenhaoimg" :src="datasa.data.img" alt="" /></div> -->
        <div v-html="datasa.data.body"></div>
        <div class="wenhaoqueding" @click="showa = false">
          {{ $t("share_index.share_index30") }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.MixinFlex(@justify:center,@direction:initial){
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: justify;
    -webkit-justify-content: @justify;
    justify-content: @justify;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    flex-direction: @direction;
}
bady {
  background: #f6f5f8;
}
.aaaaaa {
  position: relative;
}
.yao_top {
  position: relative;
  width: 100%;
  height: 321px;
  padding: 15px 14px 0;
  color: #fff;
  background: rgba(40, 80, 231, 0.93);
}
.share_heade {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.share_img1 {
  width: 34px;
  height: 34px;
}
.share_img2 {
  width: 24px;
  height: 24px;
}
.share-top-tip {
  margin-bottom: 4px;
  font-size: 16px;
}
.share-top-tip2 {
  font-size: 20px;
  margin-bottom: 10px;
  font-weight: 700;
}
.share-step {
  align-items: center;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #fff;
  display: flex;
  margin-left: 13px;
}
.share_cxk {
  text-align: center;
}
.share_img1 {
  width: 50px;
  height: 50px;
  margin-bottom: -10px;
}
.line {
  width: 90px;
  height: 0;
  border: 1px solid hsla(0, 0%, 94.1%, 0.5);
  margin: -15px 0 0;
}
.yao_bottom {
  width: 100%;
  padding: 0 15px;
  position: relative;
  margin-top: -48px;
}
.share-code-box {
  background: #fff;
  box-shadow: 0 2px 6px rgba(113, 39, 242, 0.06);
  border-radius: 10px;
  padding: 14px 12px 0;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 16px;
  font-size: 14px;
}
.share-code-top {
  padding-bottom: 15px;
  font-size: 20px;
  color: #333;
  text-align: center;
  font-weight: 500;
}
.share-code-bottom {
  font-size: 14px;
  color: #333;
  padding: 15px 0;
  -webkit-box-flex: 1;
  flex: 1;
}
.share_list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  color: #333;
  font-weight: 500;
}
.sbcode{
  width:50%;
}
.code {
  width: 60%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.code_copy {
  width: 24px;
  height: 24px;
  margin-left: 10px;
}
.code_yao {
  width: 85%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  text-align: right;
}
.share-generation {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 20px;
  margin-top: 14px;
}
.lists {
  width: 100px;
  height: 76px;
  background: #ecf0fd;
  border-radius: 7px;
  color: #333;
  font-size: 12px;
  text-align: center;
  padding: 12px 0 6px;
}
.lists_shu {
  font-weight: 500;
  font-size: 20px;
  line-height: 150%;
}
.lists_yi {
  font-size: 12px;
}
.post-qr {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 38px;
}
.share-qr {
  width: 55px;
  height: 49px;
  background: #2850e7;
  border-radius: 7px;
  margin-right: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.post_img1 {
  widows: 32px;
  height: 32px;
}
.post_haibao {
  display: flex;
  justify-content: center;
  width: 251px;
  height: 49px;
  background: #2850e7;
  border-radius: 7px;
  align-items: center;
  font-weight: 500;
  font-size: 20px;
  line-height: 150%;
  color: #fff;
}
.share-wrap {
  background: #fff;
  box-shadow: 0 2px 6px rgba(113, 39, 242, 0.06);
  border-radius: 10px;
  //   padding: 0 8px 0;
  //   color: #000;
  font-size: 12px;
  margin-bottom: 16px;
  //   overflow: hidden;
}
.ssabcxk {
  display: flex;
  justify-content: center;
  // align-items: center;
  // text-align: center;
  height: 100%;
}
.swipe {
  width: 39px;
  height: 39px;
  margin-right: 14px;
}
.swipe_span {
  margin-top: 12px;
}
.share-rebateBox {
  background: #fff;
  box-shadow: 0 2px 6px rgba(113, 39, 242, 0.06);
  border-radius: 10px;
  margin-bottom: 16px;
}
.titlea {
  display: flex;

  justify-content: space-between;
  align-items: center;
  height: 45px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 13px;
  font-weight: 500;
}
.title_shouyi {
  font-weight: 500;
  font-size: 16px;
  line-height: 150%;
  color: #333;
  margin-left: 10px;
}
.title_xiangqing {
  font-weight: 500;
  font-size: 16px;
  line-height: 150%;
  margin-right: 10px;
  color: #2850e7;
}
.contents {
  padding: 20px 12px 10px;
}
.two_list {
  display: flex;
  justify-content: space-between;
  width: 60%;
  margin: 10px auto 30px;
}
.listary {
  background: hsla(0, 0%, 94.1%, 0.35);
  border-radius: 10px;
  width: 85px;
  height: 70px;
  color: #4d4d4d;
  text-align: center;
  padding-top: 10px;
}
.fanfan {
  font-weight: 500;
  font-size: 20px;
  line-height: 150%;
  color: #333;
}
.wodea {
  font-size: 12px;
  font-weight: 500;
}
.items {
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #333;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.rebateBox {
  background: #fff;
  box-shadow: 0 2px 6px rgba(113, 39, 242, 0.06);
  border-radius: 10px;
  margin-bottom: 16px;
  background: url('../../assets/share/dixia.png') no-repeat;
  background-size: 100%;
    text-align: center;
    position: relative;
    color: #fff;
    height: 317px;
    padding: 0;
}
.rebateBoxtitle{
  font-weight: 700;
    font-size: 20px;
    line-height: 150%;
    color: #1e3074;
    padding: 17px 0 5px 0;
}
.rebateBoxxiang{
  font-weight: 400;
    font-size: 14px;
    line-height: 16px;
    color: #4d4d4d;
}
.rebateBoxfen{
  position: absolute;
    bottom: 15px;
    text-align: center;
    margin: auto;
    color: #666;
    width: 100%;
}
.po2{
      position: absolute;
    bottom: 119px;
    left: -92px;
    text-align: center;
    color: #666;
    // -webkit-transform: rotate(-90deg);
    transform: rotate(-90deg);
}
.po3{
  position: absolute;
    bottom: 114px;
    left: 130px;
    text-align: center;
}
.po4{
      position: absolute;
    bottom: 88px;
    right: 124px;
    text-align: center;
}
.po5{
  position: absolute;
    bottom: 59px;
    right: 72px;
    text-align: center;
}
.imgbottom {
  width: 100%;
  height: 100%;
}
.tanchu {
  background-color: #fff;
  position: absolute;
  border-radius: 10px;
  top: 148px;
  left: 21px;
}
.ssbbcxk {
  text-align: center;
  padding: 35px 75px;
}
.shareqr {
  width: 53px;
  height: 49px;
  border-radius: 7px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
}
.shareqrimg {
  width: 42px;
  height: 42px;
}
.titless {
  font-weight: 500;
  font-size: 20px;
  line-height: 150%;
  color: #000;
  padding: 50px 0 30px;
}
.contenssss {
  margin: 0 0 9px 0;
}
.contenssssimg {
  display: inline-block;
}
.guantua {
  max-width: 115px;
  height: 24px;
  text-align: center;
  margin: auto;
}
.guantuaimg {
  width: 56px;
  height: 50px;
}
.chachaa {
  position: absolute;
  top: 15px;
  right: 15px;
}
#haibaobao {
  height: 540px;
  width: 100%;
}
.haibaoaa {
  height: 540px;
  position: absolute;
  border-radius: 10px;
  top: 148px;
  left: 14px;
  width: 93%;
  background: url(../../assets/share/haibao2.png) no-repeat;
  background-size: cover;
}
// .haibaoaaimg {
//   height: 100%;
//   // height: 500px;

// }
.bottom_box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  text-align: center;
  height: 100px;
  position: fixed;
  bottom: 0;
  background: #fff;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  width: 100%;
  z-index: 1000;
  padding: 22px 19px;
}
.bottom_quxiao {
  padding: 10px 30px;
  border: 1px solid #f55f5c;
  font-size: 16px;
  font-weight: 700;
  border-radius: 5px;
  color: #f55f5c;
  width: 150px;
}
.bottom_baocun {
  color: #fff;
  padding: 10px 10px;
  background: #2850e7;
  font-size: 16px;
  width: 150px;
  font-weight: 700;
  border-radius: 5px;
}
.wenhao_box {
  background: #fff;
  height: 80%;
  position: fixed;
  bottom: 0px;
  left: 0px;
  right: 0px;
  transition-duration: 300ms;
  transition-timing-function: ease-out;
  z-index: 10075;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  
}
.wenhao_zong {
  width: 90%;
  margin: 0 auto;
}
.wenhao_title {
  height: 49px;
  text-align: center;
  line-height: 49px;
  border-bottom: 1px solid #f0f0f0;
  font-weight: 500;
  font-size: 16px;
  color: #333;
}
.wenhaoimg {
  width: 163px;
  height: 80px;
}
.wenhaoqueding {
  position: fixed;
  bottom: 0px;
  left: 0px;
  right: 0px;
  background: #f0f0f0;
  border-radius: 15px;
  height: 57px;
  align-items: center;
  font-weight: 500;
  display: flex;
  justify-content: center;
  font-size: 20px;
  color: #4d4d4d;
  margin-top: 23px;
}
.xinsheng {
  font-weight: 400;
  font-size: 24px;
  line-height: 120%;
  color: #fff;
  padding: 31px 45px 31px;
}
.dinga {
  position: absolute;
  bottom: 0;
  height: 81px;
  width: 100%;
  color: #fff;
}
.tuijian {
  font-weight: 400;
  font-size: 15px;
  line-height: 16px;
  margin-top: 10px;
}
.erweim {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  margin-top: 14px;
}
.erweileft {
  width: 70%;
  display: flex;
  align-items: center;
}
.tanse {
  display: flex;
  align-items: center;
  justify-content: center;
}
.erweilog {
  // background-image: url(../../assets/share/log.png);
  // background-position: 0% 0%;
  // background-size: 100% 100%;
  // background-repeat: no-repeat;
  width: 30px;
  height: 30px;
  margin-right: 15px;
}
.erweirigth {
  font-size: 12px;
  color: #fff;
  line-height: 150%;
  text-align: left;
  width: 197px;
}
.dai {
  font-size: 16px;
  font-weight: 500;
}
.shouge {
  font-size: 12px;
}
.erwaiaa {
  background-image: url(../../assets/share/erweiaaa.png);
  // background-position: 0% 0%;
  // background-size: 100% 100%;
  background-repeat: no-repeat;
  height: 35px;
  width: 35px;
}
canvas {
  width: 200px;
  height: 200px;
}
.poster-content{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    height: 70vh;
    width: 90%;
    .poster-box{
      .MixinFlex(space-between,column);
      height: 100%;
    .poster-tit{
      font-weight: 400;
      font-size: 24px;
      line-height: 120%;
      color: #fff;
      padding: 30px 16px 30px;
      z-index: 1;
    }
    .poster-img{
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 15px;
      overflow: hidden;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .poster-info{
      z-index: 1;
      width: 100%;
      color: #fff;
      .custit{
        font-size: 14px;
        line-height: 40px;
        position: relative;
        top: 0;
        height: 40px;
        background: #293478;
        text-align: center;
      }
      .cusinfo{
        .MixinFlex(space-between);
        gap: 5px;
        height: 50px;
        padding: 10px;
        .cuslogo{
          width: 30px;
          height: 30px;
          overflow: hidden;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .custxt{
          flex-grow: 2;
        }
      }
    }
    }
}
.poster-list{
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background: #fff;
  border-radius: 5px 5px 0 0;
  padding: 20px;
  .MixinFlex(space-between);
  text-align: center;
  div{
    flex-basis: 40%;
    overflow: hidden;
    max-width: 150px;
  }
  .cancel {
    padding: 10px 30px;
    border: 1px solid #f55f5c;
    font-size: 16px;
    font-weight: 700;
    border-radius: 5px;
    color: #f55f5c;
  }
  .save {
    color: #fff;
    padding: 10px 10px;
    background: #2850e7;
    font-size: 16px;
    font-weight: 700;
    border-radius: 5px;
  }
}
</style>