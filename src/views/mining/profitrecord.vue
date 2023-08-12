<script lang="ts">
export default {
  name: "profit-record",
};
</script>
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import api from "../../https";
import dayjs from "dayjs";
import * as echarts from "echarts";
type EChartsOption = echarts.EChartsOption;
var chartDom, myChart: any;
var option: EChartsOption;
const loading = ref<boolean>(false);

const postyl = async () => {
  const datas = await api.postyk();
  console.log(datas, "scxk");
};
//挖矿登陆数据
const state = reactive<any>({ data: {} });
const getlogin = async () => {
  const sbcxk = await api.getlogin();
  console.log(sbcxk, "sbcxk");
  if (sbcxk.code == 200) {
    state.data = sbcxk.data1;
  }
};

const Store: any = reactive({
  data: {
    todayProfit: 0, //当日盈亏usdt
    totalUsdt: 0, //主账户余额
    current: 0,
    profitData: [],
  },
});

// 日期切换
const onChangeSize = async (pageSize: number, index: number) => {
  let { current } = Store.data;
  if (current == index) return;
  Store.data.current = index;
  // const res = await api.getLossstatistics(pageSize, 2);
  // console.log(res,'sbres');
  
  // if (res["code"] == 200) {
  //   setEchartOption(res.data);
  // }
  getLossstatistics(pageSize);
};
// 图表日期
const categoryData = ref<any>([]);
const values = ref<any>([]);

var myChart:any;
// 格式化K线数据
// const splitData = (rawData: any[]) => {
//   let values = [];
//   let categoryData = [];
//   for (let i = 0; i < rawData.length; i++) {
//     categoryData.unshift(dayjs.unix(rawData[i].time).format("MM-D"));
//     values.unshift(rawData[i].profit);
//   }
//   return {
//     categoryData,
//     values,
//   };
// };

const setEchartOption = () => {
  
  // 如果存在Echart，则不进行初始化
  if (!myChart) {
    myChart = echarts.init(document.getElementById('Lossstatistics'));
  }

  option = {
    title: [
      {
        left: "left",
        top: "5%",
        text: `Total profit: ${Store.data.todayProfit} USDT`,
        textStyle: {
          color: "#5AD0B6",
          fontSize: "14px",
        },
      },
    ],
    tooltip: {
      show: true,
      trigger: "axis", // 触发类型，默认数据触发，见下图，可选为：'item' ¦ 'axis'
      showDelay: 20, // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
      hideDelay: 100, // 隐藏延迟，单位ms
      transitionDuration: 0.4, // 动画变换时间，单位s
      borderColor: "#333", // 提示边框颜色
      borderRadius: 4, // 提示边框圆角，单位px，默认为4
      borderWidth: 0, // 提示边框线宽，单位px，默认为0（无边框）
      padding: 10, // 提示内边距，单位px，默认各方向内边距为5，
    },
    xAxis: [
      {
        type: "category",
        data: categoryData.value,
        boundaryGap: false, // 两遍留白
        axisLine: { show: true }, //轴线
        axisLabel: { show: true }, // 轴刻度
        axisTick: { show: true },
      },
    ],
    yAxis: [
      {
        scale: true,
        splitNumber: 5,
        min: "dataMin", //取最小值为最小刻度
        max: "dataMax", //取最大值为最大刻度
        axisLine: { show: false },
        splitLine: { show: true },
        axisTick: { show: false },
        axisLabel: {
          formatter: "{value}\n",
          show: true,
        },
      },
    ],
    dataZoom: [
      {
        type: "inside",
        xAxisIndex: [0, 1],
        start: 1,
        end: 100,
      },
    ],
    grid: [
      {
        height: 150,
      },
    ],
    series: [
      {
        name: "Profit",
        type: "line",
        data: values.value,
        smooth: true, //变得圆滑
        showSymbol: false, //取消圆点
        lineStyle: { width: 1 },
      },
    ],
  };
  option && myChart.setOption(option);
  window.addEventListener('resize', () => { myChart.resize()})
};
// 获取金额
const getMoney = async () => {
  const res = await api.getMoney('all');
  if(res && res['code'] == 200){
    
    Store.data.todayProfit = res['todayProfit'];
    Store.data.totalUsdt = res['totalUsdt'];
  }
}
// 获取收益数据
const getLossstatistics = async (pageSize:number = 7,type:number = 2) => {
  const res = await api.getLossstatistics(pageSize,type);
  if(res && res['code'] == 200){
    for (let i = 0; i < res.data.length; i++) {
      categoryData.value.unshift(dayjs.unix(res.data[i].time).format('MM-D'))
      values.value.unshift(res.data[i].profit);
    }
    setEchartOption();
  }
}

//let requestArr = [api.getMoney("all"), api.getLossstatistics(7, 0)];
// onMounted(() => {
  
//   Promise.all(requestArr)
//     .then((res: any[]) => {
//       console.log("数据", res);
//       if (res && res.length) {
//         if (res[0].code != 200) {
//           // showToast(res[0].msg)
//           return;
//         }
//         Store.data.todayProfit = res[0]["todayProfit"];
//         Store.data.totalUsdt = res[0]["totalUsdt"];
//         setTimeout(() => {
//           setEchartOption(res[1].data);
//         }, 200);
//       }
//       loading.value = true;
//     })
//     .catch((err) => {
//       console.log(err);
//     });
    
// });

onMounted(() => {
  getlogin(), postyl() ,getMoney(),
  getLossstatistics();
});
</script>

<template>
  <div>
    <div class="jinusdt">
      <div class="flexa">
        <span class="moenytext">金額(USDT)</span>
        <span class="moneyjuti">{{ state.data.money }}</span>
      </div>
      <div class="leijishouyi">
        <div class="proviteitem">
          <span>累計收益</span>
          <span>{{ state.data.zeth }}</span>
        </div>
        <div class="proviteitem">
          <span>挖礦收益</span>
          <span>{{ state.data.zeth_fan }}</span>
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
          <div class="shujuboxa"></div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="bottombox">
        <div class="wabox">
          <div class="waox_ico">增長百分比</div>
         
          <div class="page-main">
            <div class="cus-tab-content layout">
              <div class="tabaccount-list">
                <div
                  class="tabaccount-item"
                  v-for="(item, index) in Store.data.money"
                  :key="index"
                >
                  <div class="tabaccount-box">
                    <div>
                      <img class="tabaccount-ico" :src="item.ico" alt="ico" />
                      <span class="tabaccount-name">{{ item.title }}</span>
                    </div>
                    <div>
                      <span
                        >{{ item.count }} ({{
                          item.Proportion.toFixed(5)
                        }}%)</span
                      >
                    </div>
                  </div>
                  <div class="tabaccount-progress">
                    <van-progress
                      color="#2850E7"
                      stroke-width="8"
                      :percentage="item.Proportion"
                      :show-pivot="false"
                    />
                  </div>
                </div>
              </div>
              <div class="Lossstatistics_wrap layout">
                <div class="time_tab">
                  <div
                    :class="{ current: Store.data.current == 0 }"
                    @click="
                      () => {
                        onChangeSize(7, 0);
                      }
                    "
                  >
                    7 days
                  </div>
                  <div
                    :class="{ current: Store.data.current == 1 }"
                    @click="
                      () => {
                        onChangeSize(30, 1);
                      }
                    "
                  >
                    30 days
                  </div>
                </div>
                <div id="Lossstatistics" ref="EchartDom"></div>
              </div>
            </div>
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
}
.bottombox {
  margin-bottom: 10px;
}
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
}
.waox_ico {
  min-height: 40px;
  position: relative;
  padding-left: 30px;
  display: flex;
  align-items: center;
  margin-bottom: -25px;
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
.shujuboxa {
  width: 100%;
  height: 260px;
  user-select: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  border-bottom: 1px solid #9f9a9a;
}

// 隔开
.flexMixin(@justify) {
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
.page-main {
  --van-tabs-nav-background: transparent;
  --van-padding-xs: 0;
  --van-tabs-line-height: 20px;
  // padding: 0 15px;
  // .title {
  //   margin: 10px;
  // }
  .layout {
    // margin-top: 15px;
  }
 
  .cus-tab-content {
    .tabaccount-list {
      padding: 10px;
      border-radius: 10px;
      background: #fff;
     
      .tabaccount-item {
        margin-bottom: 10px;
        font-size: 15px;
        .tabaccount-box {
          .flexMixin(space-between);
          padding-bottom: 10px;
          .tabaccount-ico {
            width: 25px;
            height: 25px;
            position: relative;
            top: 8px;
          }
          .tabaccount-name {
            padding-left: 8px;
            font-size: 14px;
          }
        }
        .tabaccount-progress {
          padding-left: 18px;
        }
      }
    }
    .tabaccount-list.zc {
      padding: 15px;
      .tabaccount-item {
        --van-divider-margin: 10px;
        margin: 0;
        .tabaccount-box {
          padding: 0;
         
        }
      }
    }
  }

  .Lossstatistics_wrap {
    padding: 15px;
    background-color: #fff;
    border-radius: 10px;
    .time_tab {
      .flexMixin(flex-start);
      background: #f0f0f0;
      border-radius: 10px;
      overflow: hidden;
      color: #666;
      height: 32px;
      line-height: 32px;
      width: 70%;
      text-align: center;
      div {
        flex-basis: 50%;
      }
      .current {
        background: #2850e7;
        border-radius: 10px;
        color: #fff;
      }
    }
    #Lossstatistics {
      height: 230px;
      width: 100%;
    }
  }
}
</style>