<script lang="ts">
export default {
  // components: { gundong },
  name: "mining",
};
</script>
<script setup lang="ts">
import { ref, reactive, inject, onMounted } from "vue";
import api from "../../https";
import { showToast } from "vant";
import { number } from "echarts";
import { useRouter, useRoute } from "vue-router";
// import gundong from "@/components/gundong.vue";
const router = useRouter();
// import { showToast } from "vant";
// const api:any = inject('api');
const active = ref<any>(0); //tab切换
const qiehuan = ref<any>(0);
const value = ref<any>("");
const valuetie = ref<any>(""); //总提额
const bian = ref<boolean>(true); //一代
const erdai = ref<boolean>(true); //二代
const sandai = ref<boolean>(true); //三代
const list = ref<any>(["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"]);

const Store: any = reactive({
  data: {
    active: "",
    flog: false,
    teamData: [
      {
        title: "團隊人數",
        count: 0,
        useDown: false,
        value: "TDZRS",
      },
      {
        title: "團隊收益",
        count: "0ETH",
        useDown: false,
        value: "TDZSY",
      },
      {
        title: "一代收益",
        useDown: true,
        count: 0,
        key: 1,
        data: {},
        value: "TDZSY1",
      },
      {
        title: "二代收益",
        useDown: true,
        count: 0,
        key: 2,
        data: {},
        value: "TDZSY2",
      },
      {
        title: "三代收益",
        useDown: true,
        count: 0,
        key: 3,
        data: {},
        value: "TDZSY3",
      },
    ],
    imgUrl: require("../../assets/mining/zanwu.png"),
  },
});
const xiaji = reactive<any>({ data: {} });
const xiajiflag = ref<any>(false);
const onChangeMoney = async (key: number) => {
  // Store.data.flog = Store.data.active == key + 2 ? !Store.data.flog : true;
  // console.log(key, "key");

  if (Store.data.active == key) {
    Store.data.flog = !Store.data.flog;
    Store.data.active = "";
    return;
  }
  Store.data.flog = true;
  Store.data.active = key;
  // console.log(Store.data);

  // if(Store.data.flog==true){

  // }
  const rescxk = await api.postsubordinate(key, 0);
  // console.log(rescxk, "下级收益");
  if (rescxk.code == 200) {
    xiaji.data = rescxk.rows;
    // console.log(xiaji, "xiaji");
    xiajiflag.value = true;
  }
};

const jiajian = async (ev: any) => {
  // console.log("sbcxn");

  bian.value = false;
  // console.log(ev, "11");
  const cdaer = await api.postsubordinate(ev, 0);
  // console.log(cdaer, "第一收益");
};

// 质押
const value1 = ref<any>(""); //1日
const value2 = ref<any>(""); //2日

// const txshuliang=ref<any>(0)
//质押非质押显示
const flagxianshi = ref<boolean>(true);
//获取质押挖矿账户信息
let datacxk = reactive<any>({});
const flags = ref<boolean>(false);
const getlogin = async () => {
  const ress: any = await api.getlogin();
  // console.log(ress.code);
  // txshuliang.value=ress.data1.zeth_KJH
  if (ress.code == 200) {
    datacxk = ress;
    flags.value = true;
  }
  // console.log(datacxk, "账户信息");
};

const navIndex = ref<number>(0);
const navArray = [
  { name: "交换", index: 0 },
  { name: "提款", index: 1 },
  { name: "矿业", index: 2 },
  { name: "回款", index: 3 },
];

const onChangeNav = (_ev: any) => {
  const { dataset } = _ev.target;
  // console.log(dataset);

  navIndex.value = Number(dataset.index);
  postrecorded(Number(dataset.index), (currentPage.value = 1));
};

// 矿池数据接口
// let stata=reactive<any>({})
let stata = reactive<any>({});
const flagss = ref<boolean>(false);
const getHomeStatistical = async () => {
  const datas: any = await api.getHomeStatistical();
  // console.log(datas, "sbcxk");
  if (datas.code == 200) {
    stata = datas;
    flagss.value = true;
    // console.log(stata, "stata");
  }
};

////质押挖矿——兑换体现
const duixiana = async () => {
  // value.value=datacxk.data1.zeth_KJH
  // console.log(datacxk.data1.zeth_KJH,'sbcxka');
  const cxk: any = await api.postexchange(value.value);
  // console.log("cxk", cxk);
  if (cxk.code != 400) {
    showToast(cxk.msg);
  }
};
const duihuan = async () => {
  if (value.value != null) {
    duixiana(), getkcshuju();
  }
};
//确认数量
const querena = async () => {
  const sbcxk: any = await api.postreflect(valuetie.value);
  // console.log("sbcxk", sbcxk);

  // if(sbcxk.code!=400){
  //   showToast(sbcxk.msg);
  // }
  showToast(sbcxk.msg);
};
const querensl = () => {
  if (value2.value != null) {
    querena(), getkcshuju();
  }
};

//矿池数据
let kcshuju = reactive<any>({ data: {} });
const getkcshuju = async () => {
  const ress: any = await api.getkcshuju();
  // console.log(ress, "矿池数据");
  // kcshuju.data=ress
  if (ress.code == 200) {
    for (let key in ress) {
      Store.data.teamData.forEach((item: any) => {
        if (key == "TDZSY" && item.value == key) {
          item.count = ress[key] + "ETH";
        } else if (item.value == key) {
          item.count = ress[key];
        }
      });
    }
  }
};

//记录数据接口
// let xiabiaoname = ref<any>(0);
let datalist = reactive<any>({ data: [] });
const currentPage = ref<number>(1); //页数双向绑定的值
const zongshu = ref<number>(0);

const flagsss = ref<boolean>(false);
const change = (ev: any) => {
  // console.log(ev, "翻页", currentPage.value);
  // currentPage.value=ev
  // dongasb.value=ev
  postrecorded(navIndex.value, ev);
};
const postrecorded = async (index: number, page: any) => {
  // page=currentPage.value
  const sbaa: any = await api.postrecorded(index, page);
  // console.log(sbaa, "shuju1");
  if (sbaa.code == 200) {
    zongshu.value = sbaa.total;
    datalist.data = sbaa.rows;
    console.log(datalist, "shuju2");
    flagsss.value = true;
  }
};

const onClickTabs = (active: any) => {
  // console.log(active,'上面的')
  if (active.name == 2) {
    postrecorded(0, 1);
  }
};
//质押套餐列表接口：
let zytaocan = reactive<any>({ data: {} });
const nozhiya=ref<any>(0)
const getzycombo = async () => {
  const cxkdata: any = await api.getzycombo();
  // console.log(cxkdata,'质押套餐列表1');
  nozhiya.value=cxkdata.total
  // console.log(nozhiya.value,'sbnozhiya');
  
  zytaocan.data = cxkdata.rows;
  // console.log(zytaocan.data, "质押套餐列表");
  zytaocan.data.map((i: any) => {
    i.value1 = "";
    
  });
};
//购买套餐
// const postgobuy=async()=>{

//     const buy=await api.postgobuy()
// }
const gobuy = async (ev: any) => {
  // if(ev.value1=0){
  //   showToast("请输入");
  //   return
  // }
  // const ceshia={
  //   comboInfoId:Number(ev.value1),
  //   amount:ev.id
  // }
  // const requestPayload = JSON.stringify(ceshia).slice(1, -1)
  // console.log(ev, "传上来的");
  // console.log(ev.value1, ev.id, "sss");
  const buy: any = await api.postgobuy(ev.id, Number(ev.value1));
  if (buy.code != 400) {
    showToast(buy.msg);
  }
};
//质押订单接口：
const shuaxinmoney = async () => {
  if (datacxk.data1.Utype == 2 || datacxk.data1.Utype == 3) {
    return;
  } else {
    const res = await api.getlxmoney();
    // console.log(res, "是否为2 3");
    datacxk.data1.usdt_LX = res.Money;
  }
};
const zhiyajilu = () => {
  router.push("/pledgerecord");
};

//质押挖矿-滚动收益接口
let gundong = reactive<any>({ data: {} });
const gundonga = async () => {
  const scxs: any = await api.getshouyia();
  // console.log(scxs, "滚动收益");
  gundong.data = scxs.data;
};

const getzysubmit=async()=>{
  const submitzy=await api.getzysubmit()
  console.log(submitzy,'ssss');
  
}

//获取链上usdt余额

onMounted(() => {
  getlogin(); getHomeStatistical(); getkcshuju(); getzycombo();gundonga();
});
</script>

<template>
  <div v-if="flags">
    <div class="caixukun sbcxk">
      <div class="cxk_tit">
        <span class="cxktit_da">Popular mining</span>
        <span class="cxktiti_xiao">Start earning millions</span>
      </div>
      <div class="cxk_img">
        <img src="../../assets/mining/indexLogo.85e942bd.png" alt="" />
      </div>
    </div>
    <div class="middle">
      <div class="middlecxk">
        <div class="middle_img">
          <div class="middle_cen">
            <img src="../../assets/mining/shaniao.png" alt="" />
          </div>
          <div class="middle_cen"><span>總流動性挖礦資金</span></div>
        </div>
        <div class="middle_etf" v-if="flagss">
          <span>{{ stata.data1.ethMoney }}</span>
          <span class="erf_css">ETH</span>
        </div>
      </div>
      <div class="middle_shuju">
        <div class="middle_qiehuana" v-if="nozhiya.value!=0">
          <span
            class="middle_feizhiya"
            :class="{ middle_zhiya: flagxianshi }"
            @click="flagxianshi = true"
            >非質押</span
          >
          <span
            class="middle_feizhiya"
            :class="{ middle_zhiya: !flagxianshi }"
            @click="flagxianshi = false"
            >質押</span
          >
        </div>
        <div class="middlexlist">
          <div class="middlexlistone">
            <div class="middle_content1">
              <div class="middle_con_img">
                <img src="../../assets/mining/huobi1.png" alt="" />
                <span class="middle_con_img_cxk"> 總產出 </span>
              </div>
              <div class="middle_con_tit">
                <span>{{ datacxk.data1.zeth }}</span>
                ETH
              </div>
            </div>
            <div class="middle_content1">
              <div class="middle_con_img">
                <img src="../../assets/mining/huobi2.png" alt="" />
                <span class="middle_con_img_cxk"> 可交换 </span>
              </div>
              <div class="middle_con_tit">
                <span>{{ datacxk.data1.zeth_KJH }}</span>
                ETH
              </div>
            </div>
            <div class="middle_content1">
              <div class="middle_con_img" v-if="flagxianshi">
                <img src="../../assets/mining/huobi3.png" alt="" />
                <span class="middle_con_img_cxk"> 錢包餘額 </span>
              </div>
              <div class="middle_con_img" v-else>
                <img src="../../assets/mining/huobi3.png" alt="" />
                <span class="middle_con_img_cxk"> 當前質押 </span>
              </div>
              <div class="middle_con_tit">
                <span v-if="flagxianshi">{{ datacxk.data1.usdt_LX }}</span>
                <span
                  v-if="datacxk.data1.Utype == 2 || datacxk.data1.Utype == 3"
                  >{{ datacxk.data1.usdt_LXJ }}</span
                >
                <span v-if="!flagxianshi">{{ datacxk.data1.usdt_ZY }}</span>
                USDT
                <span v-if="flagxianshi" @click="shuaxinmoney"
                  ><van-icon name="replay" color="#1989fa"
                /></span>
              </div>
            </div>
            <div class="middle_content1">
              <div class="middle_con_img">
                <img src="../../assets/mining/huobi4.png" alt="" />
                <span class="middle_con_img_cxk"> 賬戶餘額 </span>
              </div>
              <div class="middle_con_tit">
                <span>{{ datacxk.data1.money }}</span>
                USDT
              </div>
            </div>
            <div class="middle_teshu">
              <img src="../../assets/mining/huobi5.png" alt="" />
              <span>compound</span>
            </div>
          </div>
        </div>
        <div class="middleshou">
          <img
            class="middle_imgs"
            src="../../assets/mining/huobi6.png"
            alt=""
          />
          <span class="middleshou_cxk">即将收益</span>
          <span class="middleshou_cxk">00:00:00</span>
        </div>
        <div class="contetnetf" @click="getzysubmit()">
          <span> 參與挖礦 </span>
        </div>
      </div>
    </div>
    <!-- 非质押 -->
    <div v-show="!flagxianshi">
      <div
        class="zhiya_bianhua"
        v-for="itemad in zytaocan.data"
        :key="itemad.id"
      >
        <div class="zhiya_bianhua_ong">
          <div class="setMenuTop">
            <span class="setmenu_usd">USDT質押挖礦</span>
            <span @click="zhiyajilu">質押記錄></span>
          </div>
          <div class="setMenuBottom">
            <div class="setMenuMiddle">
              <div class="midLeft">
                <span class="percent">{{ itemad.ratio }}%</span>
                <span class="dayNum">{{ itemad.days }} 日</span>
              </div>
              <div class="midRight">
                <span class="yield">日收益率(%)</span>
                <span class="yield"
                  >{{ itemad.minmoney }} - {{ itemad.maxmoney }}USDT</span
                >
              </div>
            </div>
            <div class="inpBox">
              <div class="contentWarp">
                <div class="contentNum">
                  <van-cell-group inset>
                    <van-field
                      style="min-width: 76px"
                      v-model="itemad.value1"
                      placeholder="0"
                      maxlength="3"
                    />
                  </van-cell-group>
                </div>
                <span class="bottomText">全部</span>
              </div>
              <div class="buy" @click="gobuy(itemad)">購買</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="sweper">
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item
          ><img
            class="sweper_lunbo"
            src="../../assets/mining/huobitab1.jpeg"
            alt=""
        /></van-swipe-item>
        <van-swipe-item
          ><img
            class="sweper_lunbo"
            src="../../assets/mining/huobitab1.jpeg"
            alt=""
        /></van-swipe-item>
      </van-swipe>
    </div>
    <!-- 账户中心 -->
    <div class="account">賬戶中心</div>
    <div class="account_u">
      <van-tabs v-model:active="active" @click-tab="onClickTabs">
        <van-tab title="交换">
          <div class="navtitle">
            <div class="navttileone">
              <div class="navttileone_tont">
                <div class="navttileone_tontone">
                  <van-cell-group inset>
                    <van-field
                      v-model="value"
                      placeholder="0"
                      input-align="center"
                    />
                  </van-cell-group>
                </div>
                <div class="navttileone_tontbot"><span>全部</span></div>
              </div>
              <div class="navtitleimge">
                <img
                  class="zhuanhuan"
                  src="../../assets/mining/zhuanhuan.png"
                  alt=""
                />
              </div>
              <div class="monerImg">
                <img
                  class="moneyimg"
                  src="../../assets/mining/moneyImg.png"
                  alt=""
                />
                <span class="moneyusdt">USDT</span>
              </div>
            </div>
          </div>
          <div class="bottombbtn" @click="duihuan">兑换</div>
        </van-tab>
        <van-tab title="提款">
          <div class="navtitle">
            <div class="navttileone">
              <div class="navttileone_tont">
                <div class="navttileone_tontone">
                  <van-cell-group inset>
                    <van-field
                      v-model="valuetie"
                      placeholder="0"
                      input-align="center"
                    />
                  </van-cell-group>
                </div>
                <div class="navttileone_tontbot"><span>总提额</span></div>
              </div>
              <div class="navtitleimge">
                <img
                  class="zhuanhuan"
                  src="../../assets/mining/zhuanhuan.png"
                  alt=""
                />
              </div>
              <div class="monerImg">
                <img
                  class="moneyimg"
                  src="../../assets/mining/moneyImg.png"
                  alt=""
                />
                <span class="moneyusdt">USDT</span>
              </div>
            </div>
          </div>
          <div class="bottombbtn" @click="querensl">确认</div>
        </van-tab>
        <van-tab title="記錄" type="card">
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
                class="navItem"
                :class="{ active: item.index == navIndex }"
                v-for="item in navArray"
                :data-index="item.index"
                :key="item.index"
              >
                {{ item.name }}
              </div>
            </div>
            <div class="prompts">
              <span class="prompts_day">时间</span>
              <span v-if="navIndex == 1">状态</span>
              <span v-if="navIndex == 2">类型</span>
              <span>数量</span>
            </div>
            <div class="zanwu" style="min-height: 160px; padding: 6px 6px 9px">
              <div class="zanwu_img" v-if="!datalist.data.length">
                <img src="../../assets/mining/zanwu.png" alt="" />
                <div>暂无数据</div>
              </div>
              <div
                v-for="items in datalist.data"
                :key="items.id"
                class="zanwu_imgs"
              >
                <div class="shujucolor">{{ items.create_time }}</div>
                <div class="shujucolor">{{ items.money }}</div>
              </div>
              <van-pagination
                v-model="currentPage"
                :page-count="zongshu"
                mode="simple"
                @change="change"
              />
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <div class="account">團隊數據</div>
    <div class="account_u">
      <div
        class="guoji"
        v-for="(itemsa, index) in Store.data.teamData"
        :key="index"
      >
        <div class="guojione">
          <div class="itemcenter">{{ itemsa.title }}</div>
          <div class="shaniaocxka">
            <div class="itemcolo">
              {{ itemsa.count }}
            </div>
            <div v-if="itemsa.useDown" @click="onChangeMoney(itemsa.key)">
              <van-icon
                :name="
                  Store.data.flog && Store.data.active == itemsa.key
                    ? 'minus'
                    : 'plus'
                "
                size="15px"
                color="#5b74ff"
              />
            </div>
          </div>
        </div>
        <div class="zanwu" v-if="itemsa.useDown">
          <div
            class="border_bottom"
            v-show="Store.data.flog && Store.data.active == itemsa.key"
          >
            <div class="zanwu_img" v-if="!xiaji.data.length">
              <img src="../../assets/mining/zanwu.png" alt="" />
              <div>暂无数据</div>
            </div>
           <div v-else>
            <div class="timer">
              <div class="timertitle">时间</div>
              <div class="timertitle">收益</div>
            </div>
            <div
              class="timer"
              v-for="itemxiaji in xiaji.data"
              :key="itemxiaji.id"
            >
              <div class="timertitle">{{ itemxiaji.create_time }}</div>
              <div class="timertitle">{{ itemxiaji.money }}</div>
            </div>
           </div>
          </div>
        </div>
      </div>
    </div>
    <div class="accounta">礦池數據</div>
    <div class="account_ua" v-if="flagss">
      <div class="guojia">
        <div class="guojionea">
          <div class="itemcentera">總產量</div>
          <div class="itemcoloa">{{ stata.data1.ethMoney }}</div>
        </div>
      </div>
      <div class="guojia">
        <div class="guojionea">
          <div class="itemcentera">有效節點</div>
          <div class="itemcoloa">{{ stata.data1.nodeNumber }}</div>
        </div>
      </div>
      <div class="guojia">
        <div class="guojionea">
          <div class="itemcentera">參與者</div>
          <div class="itemcoloa">{{ stata.data1.participateNumber }}</div>
        </div>
      </div>
      <div class="guojia">
        <div class="guojionea">
          <div class="itemcentera">用戶收入</div>
          <div class="itemcoloa">{{ stata.data1.usdtMoney }}</div>
        </div>
      </div>
    </div>
    <!-- 流动性产出 -->
    <div class="liudong">
      <div class="liuodngone">
        <img class="liudong_img" src="../../assets/mining/liudong.png" alt="" />
        <span class="liudongspan">流動性挖礦產出</span>
      </div>
      <div class="liudongtwo">
        <div>地址</div>
        <div>数量</div>
      </div>
      <div class="sbacxk">
        <div class="Scrollbox">
          <div class="Scrollcont">
            <div
              v-for="(itemss, index) in gundong.data"
              :key="index"
              class="dsbcxk"
            >
              <div class="gundongse">{{ itemss.address }}</div>
              <div class="lsbcxka">{{ itemss.money }}ETH</div>
            </div>
          </div>
        </div>
        <!-- <ListScroll /> -->
        <!-- <gundong/> -->

        <!-- <div class="scroll-list">
          <ul>
            <li>列表项一</li>
            <li>列表项二</li>
            <li>列表项三</li>
            <li>列表项四</li>
            <li>列表项五</li>
          </ul>
        </div> -->
        <!-- <div class="container">
          <van-swipe :autoplay="3000" :loop="true" :show-indicators="false">
            <van-swipe-item v-for="(item, index) in list" :key="index"> -->
        <!-- 这里放置要循环滚动的列表项内容 -->
        <!-- <van-cell>{{ item }}</van-cell>
            </van-swipe-item>
          </van-swipe>
        </div>  -->
      </div>
    </div>
    <!-- 我们的优势 -->
    <div class="accounta">我们的优势</div>
    <div class="youshi">
      <div class="youshilist">
        <div class="youshi_img">
          <img
            class="youshi_img_img"
            src="../../assets/mining/xuanzhuan.png"
            alt=""
          />
        </div>
        <div class="youshitext">
          <span>智能调度</span>
          <span class="youshitext_tit"
            >我们将通过智能合约调度资金进行投资并实现收益</span
          >
        </div>
      </div>
      <div class="youshilist">
        <div class="youshi_img">
          <img
            class="youshi_img_img"
            src="../../assets/mining/cenue.png"
            alt=""
          />
        </div>
        <div class="youshitext">
          <span>策略多样</span>
          <span class="youshitext_tit"
            >矿池将通过多样化策略来高速有效的提高收益</span
          >
        </div>
      </div>
      <div class="youshilist">
        <div class="youshi_img">
          <img
            class="youshi_img_img"
            src="../../assets/mining/shouyi.png"
            alt=""
          />
        </div>
        <div class="youshitext">
          <span>超级收益</span>
          <span class="youshitext_tit"
            >赞押挖矿或非赞押挖矿中存入资金来获得超级收益</span
          >
        </div>
      </div>
      <div class="youshilist">
        <div class="youshi_img">
          <img
            class="youshi_img_img"
            src="../../assets/mining/ziyou.png"
            alt=""
          />
        </div>
        <div class="youshitext">
          <span>自由存取</span>
          <span class="youshitext_tit">赞押挖矿与非赞押挖矿,资金更加灵活</span>
        </div>
      </div>
    </div>
    <div class="accounta">DEX審計機構</div>
    <div class="dex_img">
      <img class="dex_img_i" src="../../assets/mining/dex1.png" alt="" />
      <img class="dex_img_i" src="../../assets/mining/dex2.png" alt="" />
      <img class="dex_img_i" src="../../assets/mining/dex3.png" alt="" />
    </div>
    <!-- 合作伙伴 -->
    <div class="accounta">合作夥伴</div>
    <div class="hezuobox">
      <img class="hezuobox_img" src="../../assets/mining/wan.jpg" alt="" />
    </div>
    <div class="kefua">客服:11:00-23:00 PST 紐約時間</div>
  </div>
</template>

<style scoped lang="less">
body {
  background: #f3f6fa;
  font-size: 15px;
}
.caixukun {
  width: 100%;
  height: 240px;
  border-bottom-right-radius: 24px;
  border-bottom-left-radius: 24px;
  background: #424eff;
}
.sbcxk {
  display: flex;
  justify-content: space-between;
  .cxk_img img {
    width: 179px;
    height: 122px;
  }
  .cxk_tit {
    display: flex;
    flex-direction: column;
    color: #fff;
    height: 20px;
    margin: 24px 15px;
    .cxktit_da {
      font-weight: 600;
      font-size: 22px;
    }
    .cxktiti_xiao {
      font-size: 15px;
    }
  }
}
.middle {
  // width: 349px;
  width: 90%;
  margin: -194px auto 19px;
  border-radius: 9px;
  background: #fff;
  .middlecxk {
    margin: 73px auto 0;
    padding-top: 14px;

    .middle_img {
      display: flex;
      text-align: center;
      align-items: center;
      justify-content: center;
      .middle_cen img {
        width: 17px;
        height: 15px;
      }
      .middle_cen span {
        font-size: 11px;
        color: #000;
        vertical-align: 1px;
        margin-left: 2px;
      }
    }
    .middle_etf {
      height: 20px;
      font-size: 21px;
      text-align: center;
      font-family: DINPro;
      font-weight: 500;
      margin-top: 9px;
      color: #000;
    }
    .erf_css {
      margin-left: 9px;
    }
  }
  .middle_shuju {
    width: 289px;
    background: #fff;
    border-radius: 9px;
    margin: 12px auto;
    padding: 18px 15px 6px;
    .middle_qiehuana {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #999;
    }
    .middlexlist {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 4px;
      .middlexlistone {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 4px;
        flex-wrap: wrap;
        position: relative;
        .middle_content1 {
          width: 129px;
          height: 72px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .middle_con_img {
            display: flex;
            .middle_con_img_cxk {
              font-size: 10px;
              font-family: PingFang SC;
              font-weight: 500;
              color: #999;
              margin-left: 4px;
            }
          }
          .middle_con_tit {
            font-size: 15px;
            font-weight: bold;
            color: rgb(0, 0, 0);
          }
        }
        .middle_content1::before {
          content: "";
          position: absolute;
          width: 1px;
          right: 125px;
          height: 29px;
          background: #e2e2e2;
        }
        .middle_teshu {
          position: absolute;
          right: 31px;
          bottom: 1px;
          font-size: 8px;
          font-family: Adobe Heiti Std;
          font-weight: 400;
          text-decoration: underline;
          color: #f98446;
          display: flex;
        }
      }
    }
    .middleshou {
      margin-top: 13px;
      height: 34px;
      width: 190px;
      background: #f2f2f4;
      border-radius: 22px;
      padding: 0 13px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 11px;
      color: #999ba9;
      margin-left: 34px;
      .middle_imgs {
        width: 13px;
        height: 13px;
      }
      .middleshou_cxk {
        color: #000;
        font-weight: 800;
      }
    }
    .contetnetf {
      width: 125px;
      height: 31px;
      margin: 11px auto 9px;
      text-align: center;
      line-height: 31px;
      background: linear-gradient(90deg, #424eff, #6783ff);
      box-shadow: 0 9px 18px 0 rgba(66, 78, 255, 0.5);
      border-radius: 15px;
      color: #fff;
      font-weight: 700;
      font-size: 15px;
    }
  }
}
.sweper {
  width: 336px;
  height: 92px;
  margin: 0 auto 14px;
  // background-color: #981616;
  border-radius: 4px;
}
.my-swipe .van-swipe-item {
  color: #fff;
  // font-size: 20px;
  // line-height: 150px;
  // text-align: center;
  // background-color: #39a9ed;
}
.sweper_lunbo {
  width: 100%;
  height: 100%;
}
.account {
  font-size: 14px;
  color: #000;
  font-weight: 700;
  // margin: 6px 0 0 13px;
  text-align: center;
}
.account_u {
  // width: 349px;
  width: 90%;
  font-size: 15px;

  margin: 18px auto;
  min-height: 210px;
  border-radius: 9px;
  background: #fff;
  // height: 80px;
}
.navtitle {
  color: #999;
  padding: 9px 32px 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .navttileone {
    // width: 100%;
    padding: 0 11px 0 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 265px;
    height: 80px;
    color: #000;
    font-weight: 600;
    border: 2px solid #e6e6e6;
    .navttileone_tont {
      width: 77px;
      font-size: 13px;
      text-align: center;
      color: #999ba9;

      .navttileone_tontone {
        border-bottom: 1px solid #e2e2e2;
        --van-cell-vertical-padding: 0;
        --van-cell-horizontal-padding: 0;
      }
      .navttileone_tontbot {
        font-size: 13px;
        margin-top: 4px;
      }
    }
    .zhuanhuan {
      width: 18px;
      height: 17px;
      display: inline-block;
      overflow: hidden;
      position: relative;
    }
    .monerImg {
      width: 82px;
      .moneyimg {
        width: 25px;
        height: 25px;
        vertical-align: middle;
      }
      .moneyusdt {
        font-size: 13px;
        padding-left: 4px;
      }
    }
  }
}
.bottombbtn {
  width: 126px;
  height: 32px;
  margin: 23px auto;
  text-align: center;
  line-height: 32px;
  background: #13b26f;
  box-shadow: 0 10px 20px 0 rgba(19, 178, 111, 0.5);
  border-radius: 16px;
  color: #fff;
}
.prompts {
  padding: 9px 13px;
  font-size: 14px;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // .prompts_day{
  //   width: 33%;
  // }
}
.zanwu {
  position: relative;
  // padding: 6px 6px 9px;
  // min-height: 161px;
  flex-direction: column;
  display: flex;
  justify-content: space-between;
  text-align: center;
  .zanwu_imgs {
    display: flex;
    justify-content: space-between;
    overflow: hidden;
    // margin-top: 14px;
  }
  .timer {
    display: flex;
    justify-content: space-between;
    text-align: center;
    margin-top: 8px;
    .timertitle{
      font-weight: 500;
    color: #999ba9;
    font-size: 13px;
    }
  }
  .border_bottom {
    border-top: 1px solid #ccc;
    margin-top: 14px;
    // min-height: 121px;
  }
}
.guoji {
  margin: 0 18px 0;
  padding: 12px 0;
  flex-direction: column;
  display: flex;
  justify-content: space-between;
  .guojione {
    height: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .itemcenter {
      font-weight: 500;
      color: #999ba9;
      font-size: 13px;
    }
    .shaniaocxka {
      display: flex;
    }
    .itemcolo {
      color: #000;
      font-weight: 700;
      font-size: 13px;
    }
  }
}
.xiahuaxian {
  border-bottom: 1px solid #e6e6e6;
  margin-top: 8px;
}
.accounta {
  font-size: 14px;
  color: #000;
  font-weight: 700;
  // margin: 6px 0 0 13px;
  text-align: center;
}
.account_ua {
  width: 90%;
  margin: 18px auto;
  min-height: 130px;
  border-radius: 9px;
  background: #fff;
  // height: 80px;
}
.guojia {
  margin: 0 18px 0;
  padding: 8px 0;
  flex-direction: column;
  display: flex;
  justify-content: space-between;
  .guojionea {
    height: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .itemcentera {
      font-weight: 500;
      color: #999ba9;
      font-size: 13px;
    }
    .itemcoloa {
      color: #000;
      font-weight: 700;
      font-size: 13px;
    }
  }
}
.liudong {
  // width: 349px;
  width: 90%;

  height: 277px;
  overflow: hidden;
  background: #fff;
  border-radius: 9px;
  margin: 19px auto 19px;
  padding-bottom: 9px;
  .liuodngone {
    height: 42px;
    background: linear-gradient(90deg, #424eff, #6682ff);
    padding: 5px 18px;
    border-radius: 9px 9px 0 0;
    font-size: 14px;
    font-weight: 600;
    .liudong_img {
      width: 50px;
      height: 25px;
      padding-right: 7px;
      vertical-align: bottom;
      display: inline-block;
      overflow: hidden;
      position: relative;
    }
    .liudongspan {
      font-size: 14px;
      font-weight: 600;
      color: #fff;
    }
  }
  .liudongtwo {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e6e6e6;
    color: #999ba9;
    padding: 14px 0;
    margin: 0 14px;
  }
  // .sbacxk {
  //   overflow: hidden;
  // }
}
.youshi {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin: 15px 14px 9px;
  .youshilist {
    width: 155px;
    .youshi_img {
      width: 100%;
      height: 90px;
      .youshi_img_img {
        width: 100%;
        height: 90px;
      }
    }
    .youshitext {
      display: flex;
      align-items: center;
      flex-direction: column;
      font-size: 13px;
      color: #000;
      font-weight: 600;
      padding: 9px 9px;
      .youshitext_tit {
        padding-top: 7px;
        color: #999;
        font-size: 10px;
        width: 136px;
      }
    }
  }
}
.dex_img {
  display: flex;
  justify-content: space-between;
  margin: 12px 10px 21px 10px;
  align-items: center;
  .dex_img_i {
    width: 101px;
    height: 46px;
  }
}
.hezuobox {
  // width: 349px;
  width: 90%;

  padding: 8px;
  background: #fff;
  margin: 20px auto;
  border-radius: 10px;
  color: #000;
  font-size: 18px;
  display: flex;
  align-items: center;
  flex-direction: column;
  font-weight: 700;
  .hezuobox_img {
    width: 100%;
    height: 100%;
  }
}
.kefua {
  color: #babcc8;
  font-size: 13px;
  margin: 0 12px;
  text-align: center;
}
// 质押非质押变色
.middle_feizhiya {
  width: 132px;
  height: 33px;
  font-size: 14px;
  text-align: center;
  line-height: 33px;
  background: #f3f6fa;
  border-radius: 16px;
  color: #999ba9;
}
.middle_zhiya {
  background: linear-gradient(90deg, #4570fe, #607cff);
  color: #fff;
}
// 质押变化
.zhiya_bianhua {
  margin: 0 auto 14px;
  width: 328px;
  border-radius: 9px;
  .zhiya_bianhua_ong {
    height: 216px;
    margin-bottom: 14px;
    border-radius: 9px;
    background: #fff;
    .setMenuTop {
      padding: 14px;
      font-size: 13px;
      align-items: center;
      color: #999;
      display: flex;
      justify-content: space-between;
      .setmenu_usd {
        font-size: 13px;
        color: #000;
      }
    }
    .setMenuBottom {
      padding: 14px;
      .setMenuMiddle {
        color: #000;
        .midLeft {
          align-items: center;
          display: flex;
          justify-content: space-between;
          .percent {
            color: #24aa71;
            font-size: 24px;
            font-weight: 700;
          }
          .dayNum {
            color: #000;
            font-size: 15px;
            font-weight: 700;
          }
        }
        .midRight {
          align-items: center;
          display: flex;
          justify-content: space-between;
          .yield {
            color: #9ea1a6;
            font-size: 10px;
          }
        }
      }
      .inpBox {
        width: 290px;
        height: 65px;
        border: 1px solid #edf0f5;
        border-radius: 5px;
        margin: 13px auto 0;
        padding: 0 20px 0 15px;
        align-items: center;
        display: flex;
        justify-content: space-between;
        .contentWarp {
          width: 77px;
          font-size: 14px;
          text-align: center;
          color: #999ba9;
          .contentNum {
            border-bottom: 1px solid #e2e2e2;
          }
          .bottomText {
            font-size: 9px;
          }
        }
        .buy {
          background: linear-gradient(90deg, #424eff, #6783ff);
          box-shadow: 0 4px 9px 0 rgba(66, 78, 255, 0.5);
          border-radius: 13px;
          font-size: 11px;
          text-align: center;
          line-height: 26px;
          width: 67px;
          height: 26px;

          color: #fff;
        }
      }
    }
  }
}
// .van-field__body{
//   width: 100px;
// }
// .van-field__control--center {
//   display: flex;
//   justify-content: center;

// }
.container {
  height: 200px;
  overflow: hidden;
}
.shujucolor {
  color: #000;
  font-weight: 500;
}
.flexMinix(@justify) {
  display: flex;
  justify-content: @justify;
  align-items: center;
}
.recorsWrap {
  .recordsNav {
    .flexMinix(center);
    text-align: center;
    line-height: 25px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 2px;
    width: 98%;
    margin: auto;
    .navItem {
      flex-basis: 25%;
      border-right: 1px solid #ccc;
      padding: 5px 0;
    }
    .navItem.active {
      background-color: #5f78ff;
      color: #fff;
    }
  }
}
.Scrollbox {
  // border: 1px solid red;
  width: 100%;
  // height: 100px;
  overflow: hidden;
  position: relative;
  .Scrollcont {
    margin-top: 100px;
    -webkit-animation: Scroll 15s linear infinite;
    -moz-animation: Scroll 10s linear infinite;

    .dsbcxk {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}

@keyframes Scroll {
  // 0% {
  //   margin-top: 100px;
  // }
  // 100% {
  //   margin-top: -200px;
  // }
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-100%);
  }
}
.gundongse {
  // text-overflow: ellipsis;
  width: 50%;
  white-space: nowrap; /* 禁止换行 */
  overflow: hidden; /* 超出部分隐藏 */
  text-overflow: ellipsis; /* 溢出时显示省略号 */
  // margin-left: 13px;
  margin: 8px 0 8px 13px;
  color: #000;
  font-size: 15px;
  font-weight: 500;
}
.lsbcxka {
  margin-right: 8px;
  color: #000;
  font-size: 15px;
  font-weight: 500;
}
</style>