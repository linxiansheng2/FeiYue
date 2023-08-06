<script lang="ts">
export default {
  name: 'options',
}
</script>
<script setup lang="ts">
import { ref, reactive, onMounted ,onUnmounted} from 'vue'
import * as echarts from 'echarts'
import $api  from '@/https'
import dayjs from "dayjs"
import { showToast } from 'vant'
import {useStore} from 'vuex'
import router from '@/router'
const $store = useStore();
type EChartsOption = echarts.EChartsOption;

const loading = ref<boolean>(false);

const Store:any = reactive({data:{
  sildershow:false,     //显示币种动态列表窗口
  show:false,           //显示主面板
  showTip:false,        //显示说明,
  useOrder:true,        //允许下单
  tabindex:0,           //Tab 索引
  timelist:['1Min','30Min','60Min','1Day','1Week','1Mon'],
  upColor:'#24AA71',    //K线收益颜色
  downColor:'#E65D44',  //K线收益颜色
  options_trading:{},   //期权交易玩法
  recommendIndex:0,     //产品索引
  recommendList:[],     //列表产品
}})

// K线走势数据
const KxStore = reactive<any>({data:{
  list:[],
  quotes:{}
}})
// 买卖数据
const TotalTrades = reactive<any>({data:{}});
const showTimeCard = ref(false);
const showRangeCard = ref(false);

const comboInfo = ref<string>('');    //下单选项文字
const comboActions = ref<any[]>([]);  //下单选项属性
const placeholder = ref<string>('');  //下单金额限制
const ratio = ref<string|number>('0.00');        //下单收益率
const comboIndex = ref<number>(0);

const formData = reactive({data:{
  comboInfoId:0,
  amount:'',
  Bid:1,
  ZD:0
}})

var time:any = null;

// 下单重置
const formDataClone = {...formData.data}

const actionsRange = [
  { name: '|>0.001%。'},
];

// 选择时间事件
const onSelect = (action: any, index: number) => {
    showTimeCard.value = false;
    comboInfo.value = action.name;
    console.log(action);
    placeholder.value = action.maxmoney;
    formData.data.comboInfoId = action.id;
    comboIndex.value = index;
    onUpdatemount(formData.data.amount);
};

const onUpdatemount = (value: string) => {
  ratio.value = (Number(value) * comboActions.value[comboIndex.value].ratio).toFixed(2);
}


const onSelectRange = (item:any) => {
  showRangeCard.value = false;
  // actionsRange
  console.log(actionsRange[item]);
};

// 立即下单
const onSubmit = async () => {
  if(!formData.data.amount){
    showToast('请输入金额')
    return 
  }
  const res = await $api.getSubmitOrder(formData.data);
  if(res){
    showToast(res['msg']);
  }
  formData.data = formDataClone;
  Store.data.show.value = false;
}

// Echarts 标题样式
const textStyle:any = {
  color:'#666',
  fontStyle:'normal',
  fontWeight:'normal',
  fontFamily:'sans-serif',
  fontSize:12
}

// 切换K线时间
const onChangeTime = (_ev:any) => {
  const index = _ev.target.dataset['index'];
  if(index){
    Store.data.tabindex = index*1;
  }
  getQQJYKX(Store.data.timelist[Number(index)]);
}

// 格式化K线数据
const splitData = (rawData: number[][]) => {
  let values = [];
  let volumes = [];
  let categoryData = [];
  for (let i = 0; i < rawData.length; i++) {
    categoryData.unshift(dayjs.unix(rawData[i][5]).format('HH:mm'))
    values.unshift(rawData[i]);
    volumes.push([i, rawData[i][4], rawData[i][0] > rawData[i][1] ? 1 : -1]);
  }
  return {
    categoryData,
    values,
    volumes
  };
}

const calculateMA = (dayCount: number, data: { values: number[][] }) => {
  var result = [];
  for (var i = 0, len = data.values.length; i < len; i++) {
    if (i < dayCount) {
      result.push('-');
      continue;
    }
    var sum = 0;
    for (var j = 0; j < dayCount; j++) {
      sum += data.values[i - j][1];
    }
    result.push(+(sum / dayCount).toFixed(2));
  }
  return result;
}

// 曲线颜色
const ncolorList = ['#FFBD09','#16C6FF','#AE23A1']; 
var chartDom,myChart:any;
var option: EChartsOption;

const setEchartOption = (list:any[][]) => {
  chartDom = document.getElementById('echartsBox')!;
  // 如果存在Echart，则不进行初始化
  if(!myChart){
    myChart = echarts.init(chartDom);
  }
  var data = splitData(list);
  const dataMA5 = calculateMA(5, data);
  const dataMA10 = calculateMA(10, data);
  const dataMA20 = calculateMA(20, data);
  option = {
    title: [
      {
        left: 'left',
        text: 'MA(5,10,20)',
        textStyle
      },
      {
        top: '60%',
        left: 'left',
        text: 'VOL',
        textStyle
      }
    ],
    animation: false,
    color: ncolorList,
    axisPointer: {
      link: [
        {
          xAxisIndex: [0, 1]
        }
      ]
    },
    tooltip: {                              // 全局提示窗样式设置
      confine: true,
      show:true,
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      showContent: true,
    },
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: [0, 1],
        start: 70,
        end: 100,
      }
    ],
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        axisLine: { show: false },
        axisLabel: { show: false},
        axisTick: { show:false },
        data:data.categoryData,
      },
      {
        type: 'category',
        gridIndex: 1,
        data:data.categoryData,
        boundaryGap: false,
        axisLine: { show: false },//轴线
        axisLabel: { show: true}, // 轴刻度
        axisTick: { show:false },
        min: 'dataMin',
        max: 'dataMax',
      }
    ],
    yAxis: [
      {
        scale: true,
        splitNumber:4,
        min:'dataMin',
        max: 'dataMax', 
        axisLine: { show:false},
        splitLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          formatter: '{value}\n',
          show:true,
        },
        position: 'right'
      },
      {
        scale: true,
        gridIndex: 1,
        splitNumber: 2,
        axisLabel: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        min:'dataMin',  
        max: 'dataMax', 
      }
    ],
    visualMap: {
      show: false,
      seriesIndex: 0,
      dimension: 2,
      pieces: [
        {
          value: 1,
          color: Store.data.downColor
        },
        {
          value: -1,
          color: Store.data.upColor
        }
      ]
    },
    grid: [
        {
          left: '5%',
          right: '15%',
          height: 200
        },
        {
          left: '5%',
          right: '15%',
          top: '63%',
          height: 100
        }
      ],
    series: [
      {
        name: 'volume',
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: data.volumes,
        barWidth:'50%'
      },
      {
        type: 'candlestick',
        name: 'Day K',
        data: data.values,
        itemStyle: {
          color: Store.data.upColor,
          color0: Store.data.downColor,
          borderColor: undefined,
          borderColor0: undefined,
        },
        markLine: {
          symbol:['none','none'],
          lineStyle: {
            color:'red',
            type:'solid',
          },
          data:[{
              name: 'value',
              yAxis: data.values.length?data.values[data.values.length-1][1]:''

          }],
        }
      },
      {
        name: 'MA5',
        type: 'line',
        data: dataMA5,
        smooth: true,
        showSymbol: false, 
        lineStyle: {width: 1}
      },
      {
        name: 'MA10',
        type: 'line',
        data: dataMA10,
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 1
        }
      },
      {
        name: 'MA20',
        type: 'line',
        data:dataMA20,
        smooth: true,
        showSymbol:false,
        lineStyle: {
          width: 1
        }
      },
    ]
  };

  myChart.hideLoading();
  option && myChart.setOption(option);
}

// K线走势
const getQQJYKX = async (period:string = '1min') => {
  const res = await $api.getQQJYKX(Store.data.recommendList[Store.data.recommendIndex].MJname,period);
  myChart.showLoading();
  if(res && res.code == 200){
    let list:any = []
    res.list.forEach((item:any) => {
      list.push(Object.values(item).map(Number));
    });
    KxStore.data = {
      list,
      quotes:res.quotes
    }
    setEchartOption(list);
  }
}

// 期权登录验证
const handleLogin = async () => {
  const res = await $api.getQQJYlogin();
  if(res && res['code'] == 5001){
    showToast(res['msg']);
    setTimeout(()=>{
      router.push('/');
    },1500)
  }
}

// 遮罩层
const handlemouseClick = (event:MouseEvent) => {
      let setX = document.documentElement.clientWidth*0.8;
      if(event.pageX > setX){
          Store.data.sildershow = false
      }
}

const onChangeList = async (_ev:any) => {
  const { dataset } = _ev.target;
  Store.data.recommendIndex = Number(dataset['index']);
  Store.data.sildershow = false;
  getQQJYKX('1min');
  const res2 = await $api.getTotalTrades(dataset['value']);
  res2.list.forEach((item:any,index:number)=>{
    item.date = dayjs(item.date*1000).format("HH:mm:ss");
    item.width = 200 * ++index/10 * (Number(item.amount)/10)
  });

  TotalTrades.data = res2.list;
  Store.data.tabindex = 0;
}

// 获取产品列表
const getList = async () => {
  const res = await $api.getList();
  // const res = await $api.getQQJYproduct(1);
  // const res2 = await $api.getQQJYproduct(2);
  // const res3 = await $api.getQQJYproduct(3);

  if(res && res['code'] == 200){
    Store.data.recommendList = res.data;
  }
  console.log('产品列表',res);
  // console.log('产品列表',res2);
  // console.log('产品列表',res2);

}
// 生命周期
onMounted(()=>{
  getList();
  handleLogin();
  Promise.all([
    $api.getQQJYKX(Store.data.recommendList.length?Store.data.recommendList[Store.data.recommendIndex].MJname:'eth_usdt','1min'),
    $api.getTotalTrades(Store.data.recommendList.length?Store.data.recommendList[Store.data.recommendIndex].MJname:'eth_usdt'),
    $api.getSubmitOptions(),
    $api.getAuxiliary('options_trading_Xck')
  ])
  .then((res:any[])=>{
    let list:any = []
    res[0].list.forEach((item:any) => {
      list.push(Object.values(item).map(Number));
    });
    KxStore.data = {
      list,
      quotes:res[0].quotes
    }

    // 买卖数据格式化
    res[1].list.forEach((item:any,index:number)=>{
      item.date = dayjs(item.date*1000).format("HH:mm:ss");
      item.width = 200 * ++index/10 * (Number(item.amount)/10)
    });

    if(res[2].data.length){
      res[2].data.forEach(((item:any)=>{item.ratio = (item.ratio/100).toFixed(3)}));
    }else{
      Store.data.useOrder = false;
    }

    comboActions.value = res[2].data;
    comboInfo.value = res[2].data.length ? res[2].data[0].name : '';
    placeholder.value = res[2].data.length ? res[2].data[0].maxmoney : '0'
    TotalTrades.data = res[1].list;
    Store.data.options_trading = res[3].data1;
    loading.value = true;

    setTimeout(()=>{setEchartOption(list)},500);
    // console.log('数据',res);
  })
  .catch((err)=>{
    console.log(err);
  })

  // 买卖数据轮询
  time = setInterval(() => {
    setTimeout(async () => {
      const res = await $api.getTotalTrades(Store.data.recommendList.length?Store.data.recommendList[Store.data.recommendIndex].MJname:'eth_usdt');
      if(res && res.code == '200'){
        res.list.forEach((item:any,index:number)=>{
          item.date = dayjs(item.date*1000).format("HH:mm:ss");
          item.width = 200 * ++index/10 * (Number(item.amount)/10);
        });
        TotalTrades.data = res.list;
        $store.commit('setUseLoading',false);
      }
    }, 200)
  }, 5000)


})

onUnmounted(()=>{
  clearInterval(time);
  $store.commit('setUseLoading',true);
})
</script>

<template>
  <div class="page-main" v-if="loading">

    <section class="candlesticks-wrap">
      <div class="candlesticks-top">
        <div class="candlesticks-topPrice">
          <div class="variety">
            <div class="variety-title" @click="Store.data.sildershow = !Store.data.sildershow">
              {{Store.data.recommendList.length?Store.data.recommendList[Store.data.recommendIndex].ZSname:''}} 
              <van-icon name="arrow-down" />
            </div>
            <div class="variety-price" :class="{'red':Number(KxStore.data.quotes.riseRate)<0?true:false}">
              <span>{{KxStore.data.quotes.close}}</span><span class="riseRate">{{KxStore.data.quotes.riseRate}}%</span></div>
          </div>
          <div class="price">
            <div>24H High:{{ Number(KxStore.data.quotes.high).toFixed(5) }}</div>
            <div>24H Low:{{ Number(KxStore.data.quotes.low).toFixed(5) }}</div>
          </div>
        </div>

        <div class="candlesticks-bottom tablist" @click="onChangeTime">
          <div class="tabitem" :class="{'current':index == Store.data.tabindex}" v-for="(item,index) in Store.data.timelist" :key="index" :data-index="index">{{ item }}</div>
        </div>

      </div>

      <div class="candlesticks-echarts" id="echartsBox">

      </div>
    </section>

    <section class="history-wrap">
        <div class="history-box">
          <div class="history-tit">BuySell/Volume</div>
          <div class="history-ico"><van-icon name="clock-o" /> History</div>
        </div>
        <div class="history-title">
          <p>Time</p><p>Direction</p><p>Price</p><p>Quantity</p>
        </div>
        <div class="history-info" v-if="loading">
          <!-- left -->
          <div class="history-data">
            <div class="data-item" v-for="(item,index) in TotalTrades.data" :key="index">
              <div class="data-mask-green" :style="{'min-width':`${item.width}px`}"></div>
              <div class="data-txt">{{item.date}}</div>
              <div class="data-direc" :class="{'red':item.type == 'sell' ,'green':item.type == 'buy'}">{{item.type}}</div>
            </div>
          </div>
          <!-- right -->
          <div class="history-data">
            <div class="data-item" v-for="(item,index) in TotalTrades.data" :key="index">
              <div class="data-mask-red" :style="{'min-width':`${item.width}px`}"></div>
              <div class="data-txt">{{ item.price }}</div>
              <div class="data-quantity">{{item.amount}}</div>
            </div>
          </div>
        </div>
    </section>
    <section class="buy-wrap">
      <div class="buy-btn" @click="Store.data.show = true">Delegate now</div>
    </section>

    <div class="cus-sheet">
      <!-- buy Control  -->
      <van-action-sheet v-model:show="Store.data.show" title="確認訂單" v-if="loading">
        <!-- 说明按钮 -->
        <div class="buy-tip" @click="Store.data.showTip = true"><van-icon name="warning" size="25" color="#F7931A" /></div>
        <div class="buy-content">
          <div v-if="Store.data.useOrder">
            <!-- QQJYoptions 没有的情况禁止使用此模块 -->
            <div v-show="!Store.data.showTip">

            <div class="buy-select">
              <div class="buy-name">
                <img src="../../assets/silder/btc.png" alt="">
                <div class="buy-info">
                  <p class="buy-name">BTC</p>
                  <p class="buy-flog">buy <van-tag color="#00c6931a" :text-color="!formData.data.ZD?'#00C693':'red'">{{!formData.data.ZD?'涨':'跌'}}</van-tag></p>
                </div>
              </div>
              <div class="buy-time"><van-icon name="clock-o" color="#333333" />  {{ comboInfo }}</div>
            </div>
            <van-divider />

            <div class="buy-card">
              <p class="buy-card-tit">選擇時間</p>
              <div class="buy-card-item">
                <div class="buy-card-select low3" @click="showTimeCard = true" >
                  <van-icon name="clock-o" color="#333333"  />{{ comboInfo }}<van-icon name="arrow-down" color="#333333" />
                </div>
                <div class="buy-card-state" :class="{'active':!formData.data.ZD}" @click="formData.data.ZD = 0">涨</div>
                <div class="buy-card-state" :class="{'active':formData.data.ZD }" @click="formData.data.ZD = 1">跌</div>
              </div>
            </div>

            <div class="buy-card">
              <p class="buy-card-tit">價格範圍</p>
              <div class="buy-card-item">
                <div class="buy-card-select low1" @click="showRangeCard = true">
                  <p class="buy-card-flag" :class="{'Dsy':formData.data.ZD}"><van-icon :name="!formData.data.ZD?'plus':'minus'" :color="!formData.data.ZD?'#00C693':'red'" /> {{!formData.data.ZD?'涨':'跌'}} | >0.001%</p>
                  <p class="buy-card-txt">(*{{!comboActions.length?'xxx':comboActions[comboIndex].ratio}})</p>
                  <van-icon name="arrow-down" color="#333333" />
                </div>
              </div>
            </div>

            <div class="buy-card">
              <p class="buy-card-tit">購買金額</p>
              <div class="buy-card-item">
                <div class="buy-card-select price-left">
                  <p class="buy-card-logo"><img src="../../assets/silder/btc.png" alt=""></p>
                  <p>USDT</p>
                </div>
                <div class="buy-card-select price-right">
                  <div class="buy-card-field">
                    <van-field 
                      v-model="formData.data.amount" 
                      type="number" 
                      :placeholder="`>=${placeholder}USDT`" 
                      @update:model-value="onUpdatemount"
                      /></div>
                  <p @click="formData.data.amount = !comboActions.length?'':comboActions[comboIndex].maxmoney">Max</p>
                </div>
              </div>
            </div>
            <div class="earnings">預期收益：<span>{{ratio}}</span></div>
            <van-button type="primary" color="#3C5FE7" block @click="onSubmit">確認下單</van-button>
            </div>
          </div>

          <div v-else>
            <van-empty v-show="!Store.data.showTip" description="Under Maintenance" />
          </div>

          <div class="buytip-wrap" v-show="Store.data.showTip">
            <h2 class="buytip-title">{{Store.data.options_trading.title}}</h2>
            <div class="buytip-desc" v-html="Store.data.options_trading.body"></div>
            <div class="buytip-btn" @click="Store.data.showTip = !Store.data.showTip">OK</div>
          </div>

        </div>
      </van-action-sheet>

      <van-action-sheet v-model:show="showTimeCard" :actions="comboActions" @select="onSelect" close-on-click-action/>
      <!-- range -->
      <van-action-sheet v-model:show="showRangeCard" @select="onSelectRange" close-on-click-action>
        <div class="buy-Range-list">
          <!-- <div class="buy-Range-item" v-for="(item,index) in actionsRange" :key="index" @click="()=>{ onSelectRange(index) }">
            <span class="buy-Range-flog" :class="{'Dsy':formData.data.ZD}">{{ item.name }}</span>
            <span class="buy-Range-info">回报率 {{ comboActions[comboIndex].ratio }}</span>
          </div> -->
          <div class="buy-Range-item" @click="showRangeCard = false">
            <span class="buy-Range-flog" :class="{'Dsy':formData.data.ZD}">{{ !formData.data.ZD?'涨':'跌' }} |>0.001%。</span>
            <span class="buy-Range-info">回报率 {{ comboActions[comboIndex].ratio }}</span>
          </div>
        </div>
      </van-action-sheet>
    </div>

    <van-overlay :show="Store.data.sildershow" @click="handlemouseClick" :lazy-render="false">
          <div class="recommend-list">
            <div class="title"><span>現貨行情</span></div>
            <div class="recommend-item" v-for="(item,index) in Store.data.recommendList" :key="item.id" @click="onChangeList">
              <div class="mask" :data-value="item.MJname" :data-name="item.ZSname" :data-index="index"></div>
              <div class="name"><span>{{item.name}}</span><span class="subname">/{{item.ZSname.split('/')[1]}}</span></div>
              <div class="close">close</div>
              <div class="riseRate">riseRate</div>
            </div>
          </div>
      </van-overlay>
  </div>
</template>

<style scoped lang="less">
@paddHorizontal:0 15px;
@greenColor:#00C693;
@redColor:red;
// 混入弹性盒子
.flexMixin(@justify){
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
#echartsBox{
  height: 400px;
}

  .recommend-list{
    background-color: #fff;
    text-align: left;
    position: fixed;
    top: 0;
    left: 0;
    width: 80%;
    height: 100vh;
    overflow: scroll;
    background: #fff;
    z-index: 9999;
    .title{
      font-size: 20px;
      font-weight: 700;
      color: #000;
      margin: 30px 0;
      padding: @paddHorizontal;
    }
    .recommend-item{
      .flexMixin(space-between);
      position: relative;
      height: 45px;
      padding: @paddHorizontal;
      .mask{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: -webkit-linear-gradient(left,rgba(36,170,113,0),rgba(36,170,113,.2) 50%,rgba(48,229,152,.3) 80%,rgba(36,170,113,.8));
        background: linear-gradient(90deg,rgba(36,170,113,0),rgba(36,170,113,.2) 50%,rgba(48,229,152,.3) 80%,rgba(36,170,113,.8));
        background-size: 200%;
        -webkit-animation: mask-anime 1s .4s ease both;
        -moz-animation: mask-anime 1s .4s ease both;
        &::after{
          content: '';
          height: 1px;
          width: 100%;
          position: absolute;
          left: 0;
          bottom: 0;
          background: -webkit-linear-gradient(left,rgba(36,170,113,0),rgba(36,170,113,.2) 50%,rgba(48,229,152,.3) 80%,rgba(36,170,113,.8));
          background: linear-gradient(90deg,rgba(36,170,113,0),rgba(36,170,113,.2) 50%,rgba(48,229,152,.3) 80%,rgba(36,170,113,.8));
          background-size: 200%;
        }
      }
      .name{
        color: #3b3e4e;
        width: 90px;
        .subname{
          font-size: 12px;
          color: #ccc;
          letter-spacing: 0;
        }
      }
      .close{
        color: @greenColor;
      }
      .riseRate{
        width: 70px;
        height: 27px;
        line-height: 30px;
        text-align: center;
        font-size: 12px;
        border-radius: 4px;
        color: #fff;
        background: @greenColor;
      }
    }
  }


.page-main{
  padding-bottom: 120px;
  width: 100%;
  overflow: hidden;
  position: relative;
  .candlesticks-wrap{
    background-color: #fff;
    .candlesticks-top{
      padding: 15px;
      color: #4d4d4d;
      font-weight: 600;
      line-height: 24px;
      .candlesticks-topPrice{
        .flexMixin(space-between);
        .variety{
          font-size: 16px;
          .variety-price{
            color: #00c693;
            .riseRate{
              font-size: 12px;
              margin-left: 10px;
            }
          }
          .variety-price.red{
            color: #f55f5c;
          }
        }
        .price{
          font-size: 14px;
        }
      }
    }
    .candlesticks-bottom{
      .flexMixin(center);
      margin: 10px 0;
      font-size: 12px;
      font-weight: normal;
      cursor: pointer;
      .tabitem{
        background: #eee;
        border-radius: 4px;
        padding: 5px 7px;
        margin-right: 10px;
      }
      .tabitem.current{
          color: #fff;
          background: #2850e7;
      }
    }
  }
  .history-wrap{
    background: #fff;
    padding: 15px;
    margin-top: 20px;
    .history-box{
      .flexMixin(space-between);
      .history-tit{
        font-size: 19px;
        font-weight: 600;
        color: #4d4d4d;
      }
      .history-ico{
        font-size: 14px;
        color: #4d4d4d;
      }
    }

    .history-title{
      .flexMixin(space-between);
      color: #999ba9;
      position: relative;
      font-size: 12px;
      min-height: 32px;
      p{
       flex: 0 0 25%;
       text-align: left;
      }
      p:last-child{
        text-align: right;
      }
    }
    .history-info{
      .flexMixin(space-between);
      .history-data{
        flex: 0 0 50%;
        color: #1d1e26;
        .data-item{
          position: relative;
          text-align: left;
          line-height: 25px;
          div{flex: 0 0 50%;z-index: 1;}
          .flexMixin(flex-start);
          .data-mask-green,
          .data-mask-red{
            position: absolute;
            top: 0;
            height: 100%;
            z-index: 0;
            max-width: 150px;
          }
          .data-mask-red{
            left: 0;
            background-color: #feeeeb;
          }
          .data-mask-green{
            right: 5px;
            background-color: #e4f8f3;
          }
          .data-txt{
            font-size: 15px;
            color: #1d1e26;
            z-index: 1;
          }
          .data-direc{
            color: red;
            text-transform: capitalize;
          }
          .data-direc.green{
            color: #00c693;
          }
          .data-quantity{
            text-align: right;
          }
          
        }
      }
    }
  }
  .cus-sheet{
    --van-popup-background:#fff;
  }
}
.buy-wrap{
  position: fixed;
  bottom: 0;
  width: 100%;
  left: 0;
  height: 95px;
  background: #fff;
  padding: 0 19px;
  text-align: center;
  font-size: 17px;
  z-index: 1;
  .buy-btn{
    line-height: 48px;
    color: #fff;
    width: 100%;
    height: 48px;
    background: #2850e7;
    border-radius: 6px;
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

}

// 委托弹窗
.buy-content{
  height: auto;
  position: relative;
  padding: 25px;
  border-top: 1px solid #e7e7e7;
  .buy-select{
    .flexMixin(space-between);
    .buy-name{
      .flexMixin(space-between);
      img{
        height: 35px;
        width: 35px;
      }
      .buy-info{
        margin-left: 5px;
        .buy-name{
          font-size: 18px;
        }
      }
    }
    .buy-time{
      border-radius: 10px;
      text-align: center;
      background: #ECF0FD;
      padding: 10px 15px;
      font-size: 16px;
    }
  }

  .buy-card{
    margin-bottom: 12px;
    .buy-card-tit{
      color: #4d4d4d;
      font-size: 16px;
      margin-bottom: 10px;
    }
    .buy-card-item{
      .flexMixin(space-between);
      font-size: 16px;
      text-align: center;
      .buy-card-select{
        .flexMixin(space-between);
        .buy-card-field{
          width: 80%;
          --van-cell-line-height:unset;
          --van-cell-vertical-padding:0;
          --van-cell-horizontal-padding:0;
        }
        .buy-card-logo{
          width: 25px;
          height: 25px;
          img{
            width: 100%;
            height: 100%;
          }
        }
      }
      .low3{
        flex-basis: 45%;
      }
      .low1{
        flex-basis: 100%;
        .buy-card-flag{
          color: #00c693;
        }
        .buy-card-flag.Dsy{
          color: rgb(245, 95, 92);
        }
        .buy-card-txt{
          font-size: 15px;
          color: #000;
        }
      }
    
      .price-left{
        flex-basis: 30%;
        justify-content: flex-start;
        gap: 5px;
        // font-weight: bold;
      }
      .price-right{
        flex-basis: 65%;
      }
      >div{border-radius: 8px;padding: 10px;border: 1px solid #e1e1e1;}
      .buy-card-state{
        width: 75px;
      }
      .buy-card-state.active{
        color: #fff;
        background: #00c693;
      }
    }
  }
  .earnings{
    color: #5F7DED;
    font-size: 12px;
    margin-bottom: 25px;
    font-weight: bold;
  }
  .buytip-wrap{
    position: relative;
    padding-bottom: 50px;
    .buytip-title{
      text-align: center;
      margin-bottom: 15px;
    }
    .buytip-btn{
      height: 45px;
      width: 90%;
      line-height: 45px;
      text-align: center;
      position: fixed;
      bottom: 0;
      left: 5%;
      border-top: 1px solid #cdcdcd;
      background: #ffffff;
    }
  }
}
.buy-tip{
    position: absolute;
    top: 10px;
    left: 10px;
}

.buy-Range-list{
  padding: 20px;
  .buy-Range-item{
    .flexMixin(space-between);
    margin-bottom: 5px;
    .buy-Range-flog{
      color: #00c693;
    }
    .buy-Range-flog.Dsy{
      color: rgb(245, 95, 92);
    }
  }
}

@keyframes mask-anime{
  0% {
    opacity: 0;
    -webkit-transform: translateX(-50%);
  }
  100% {
      opacity: .5;
      -webkit-transform: translateX(0);
  }
}
</style>