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
import { useI18n } from 'vue-i18n'
const { locale , t } = useI18n();
type EChartsOption = echarts.EChartsOption;
var option: EChartsOption;

//挖矿登陆数据
const state = reactive<any>({ data: {} });

// 金额
const Store: any = reactive({
  data: {
    todayProfit: 0, //当日盈亏usdt
    totalUsdt: 0, //主账户余额
    current: 0,
    profitData: [],
  },
});

const getlogin = async () => {
  const sbcxk = await api.getlogin();
  if (sbcxk && sbcxk['code'] == 200) {
    state.data = sbcxk.data1;
  }
};

// 获取金额
const getMoney = async () => {
  const res = await api.getMoney('all');
  if(res && res['code'] == 200){
    Store.data.todayProfit = res['todayProfit'];
    Store.data.totalUsdt = res['totalUsdt'];
    getLossstatistics();
  }
}

// 获取收益数据
const getLossstatistics = async (pageSize:number = 7,type:number = 2) => {
  const res = await api.getLossstatistics(pageSize,type);
  if(res && res['code'] == 200){
    let indexmoney = Store.data.totalUsdt;
    for (let i = 0; i < res.data.length; i++) {
      categoryData.value.unshift(dayjs.unix(res.data[i].time).format('MM-D'))
      values.value.unshift(res.data[i].profit);
      // 计算每日增长百分比
      if(res.data[i].profit == 0){increaseVal.value.unshift(0)}
      else{
        increaseVal.value.unshift(((res.data[i].profit / indexmoney) * 100).toFixed(10))
      }
    }
    setTimeout(() => {
      setEchartOption();
      setEchartOption('zz');
    }, 200);
  }
}

// 日期切换
const onChangeSize = async (pageSize: number, index: number) => {
  let { current } = Store.data;
  if (current == index) return;
  Store.data.current = index;
  categoryData.value = []
  getLossstatistics(pageSize);
};


// 图表日期
var myChart:any,increase:any;
const categoryData = ref<any>([]);
// 收益
const values = ref<any>([]);
// 百分比
const increaseVal = ref<any[]>([]);

// 渲染图表
const setEchartOption = (type:string = 'sy') => {
  let text = type == 'sy' ? `Total Profit: ${Store.data.todayProfit} USDT` : '';
  let data = type == 'sy' ? values.value : increaseVal.value;
  option = {
    title: [
      {
        left: "left",
        top: "5%",
        text,
        textStyle: {
          color: "#5AD0B6",
          fontSize: "14px",
        },
      },
    ],
    tooltip: {
      trigger: 'axis',
    },
    xAxis: [
      {
        type: "category",
        data: categoryData.value,
        boundaryGap: false, // 两遍留白
      },
    ],
    yAxis: [
      {
        scale: true,
        splitNumber: 5,
        min: "dataMin", //取最小值为最小刻度
        max: "dataMax", //取最大值为最大刻度
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          formatter: type == 'sy' ? "{value}\n" : "{value}%",
        },
      },
    ],
    dataZoom: [
      {
        type: "inside",
        start: 1,
        end: 100,
      },
    ],
    grid: [{
        left: '15%',
        right: '15%',
        height: 150
      },
    ],
    series: [
      {
        name: type == 'sy' ? "Profit": "Percentages",
        type: type == 'sy'? "line" : "bar",
        data,
        showSymbol: false, //取消圆点
        lineStyle: { width: 1 },
      },
    ],
  };
  if(type == 'sy'){
    myChart.setOption(option);
  }else{
    increase.setOption(option);
  }
  window.addEventListener('resize', () => { 
    myChart.resize();
    increase.resize();
  })
};

onMounted(() => {
  myChart = echarts.init(document.getElementById('Lossstatistics'))!;
  increase = echarts.init(document.getElementById('shujuboxa'))!;
  getlogin();
  getMoney();
});
</script>

<template>
  <div>
    <div class="jinusdt">
      <div class="flexa">
        <span class="moenytext">{{$t('mining_profitrecord.mining_profitrecord1')  }}(USDT)</span>
        <span class="moneyjuti">{{ state.data.money }}</span>
      </div>
      <div class="leijishouyi">
        <div class="proviteitem">
          <span>{{$t('mining_profitrecord.mining_profitrecord2')  }}</span>
          <span>{{ state.data.zeth }}</span>
        </div>
        <div class="proviteitem">
          <span>{{$t('mining_profitrecord.mining_profitrecord3')  }}</span>
          <span>{{ state.data.zeth_fan }}</span>
        </div>
        <div class="proviteitem">
          <span>{{$t('mining_profitrecord.mining_profitrecord4')  }}</span>
          <span>0</span>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="bottombox">
        <div class="meiribox">{{$t('mining_profitrecord.mining_profitrecord5')  }}(ETH)</div>

        <div class="wabox">
          <div class="waox_ico">{{$t('mining_profitrecord.mining_profitrecord6')  }}</div>
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
                  <div :class="{ current: Store.data.current == 0 }" @click="() => {onChangeSize(7, 0)}">7 days</div>
                  <div :class="{ current: Store.data.current == 1 }" @click="() => {onChangeSize(30, 1)}">30 days</div>
                </div>
                <div id="Lossstatistics"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="wabox">
          <div class="waox_ico">{{$t('mining_profitrecord.mining_profitrecord7')  }}</div>
          <div class="shujuboxa" id="shujuboxa" :style="{'height':'260px'}"></div>
        </div>

      </div>
    </div>
    <div class="bottom">
      <div class="bottombox">
        
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
  padding: 0px 15px 15px;
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
  margin-bottom: 10px;
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
  user-select: none;
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
    padding: 15px 0;
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