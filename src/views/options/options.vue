<script lang="ts">
export default {
  name: 'options',
}
</script>
<script setup lang="ts">
import { ref, reactive, onMounted ,onUnmounted ,getCurrentInstance ,toRef} from 'vue'
import * as echarts from 'echarts'
import $api  from '@/https'
import dayjs from "dayjs"
import { showToast } from 'vant'
import {useStore} from 'vuex'
import router from '@/router'
const $store = useStore();
type EChartsOption = echarts.EChartsOption;
const Store:any = reactive({data:{
  sildershow:false,     //显示币种动态列表窗口
  show:false,           //显示主面板
  showTip:false,        //显示说明,
  tabindex:0,           //Tab 索引
  timelist:['1Min','30Min','60Min','1Day','1Week','1Mon'],
  options_trading:{},   //期权交易玩法
  proIndex:0,     //产品索引
  recommendList:[],     //列表产品
  comboInfo:'',         //下单选项文字
  comboActions:[],      //下单选项属性
  comboIndex:0,         //下单选项索引
  placeholder:'',       //下单金额限制
  ratio:'0.00',         //下单收益率
}})

// 倒计时
const countDown = ref<any>(null);
const timeDown = ref<number>(1000);

// 下单数据
const formData:any = reactive({data:{
  comboInfoId:0,
  amount:'',
  Bid:1,
  ZD:0
}})

// 买卖数据
const TotalTrades = reactive<any>({data:[]});
const showTimeCard = ref(false);
const showRangeCard = ref(false);

// K线时间切换
const onChangeTime = (_ev:any) => {
  const index = _ev.target.dataset['index'];
  Store.data.tabindex = Number(index);
  splitData(Store.data.recommendList[Store.data.proIndex]['MJname'],Store.data.timelist[Number(index)]);
  settitle.value = false;
}

// k线数据
var option: EChartsOption;
var myChart:any;
var time:any = null;
const MA5 = ref<any>('');
const MA10 = ref<any>('');
const MA20 = ref<any>('');
const volMA5 = ref<any>('');
const volMA10 = ref<any>('');
const rawData = ref<any[]>([]);
const dates = ref<any>([]);
const echartsData = ref<any>([]);
const volumes = ref<any>([]);
const QQQuotes = ref<any>('');
const settitle = ref<boolean>(false);
var upColor = '#E65D44';
var downColor = '#24AA71';

// 重置数据
const resetData = () => {
  MA5.value = '';
  MA10.value = '';
  MA20.value = '';
  volMA5.value = '';
  volMA10.value = '';
}
/**
 * 
 * @param list 后端K线数据
 */
const splitData = async (symbol:string = 'eth_usdt',period:string = '1min') => {
  const res = await $api.getQQJYKX(symbol,period);
  if(res && res['code'] == 200){
    res['list'].reverse();
    let setlist = res['list'].map((item:any)=>Object.values(item).map(Number));
    rawData.value = setlist;
    QQQuotes.value = res.quotes;

    // 格式化Echarts
    dates.value = setlist.map((item:any) => {
      return dayjs.unix(item[5]).format('HH:mm');
    });
    echartsData.value = setlist.map((item:any) =>[+item[0], +item[1], +item[2], +item[3], +item[4]]);
    volumes.value = setlist.map((item:any, index:number) =>[index, item[4], item[0] > item[1] ? 1 : -1]);
    resetData();
    draw();
  }
}

// 截取数字字符串 保留precision小数
const formatterNum = (value:any, precision:any) => {
  let reg = new RegExp('^\\d+(?:\\.\\d{0,' + precision + '})?')
  return value.toString().match(reg)
}

// 计算MA
const calculateMA = (dayCount:number, data:any[]) => {
  var result = [];
  for (var i = 0, len = data.length; i < len; i++) {
    if (i < dayCount) {
      result.unshift('-');
      continue;
    }
    var sum = 0;
    for (var j = 0; j < dayCount; j++) {
      sum += data[i - j][1];
    }
    result.unshift((sum / dayCount).toFixed(2));
  }
  return result;
}

var styleline = 'display: flex;flex-direction: row;align-items: center;justify-content: space-between;gap:20px'
// 绘制(配置项)
const draw = () =>{
  if(!myChart){
    myChart = echarts.init(document.getElementById('echartsBox'));
  }
  option = {
    backgroundColor: '#fff',
    title: [
      {left: 'left',text: 'MA(5,10,20)',textStyle:{color:'#666',fontStyle:'normal',fontWeight:'normal',fontFamily:'sans-serif',fontSize:12,}},
      {top: '75%',left: 'left',text: 'VOL(5,10)',textStyle:{color:'#666',fontStyle:'normal',fontWeight:'normal',fontFamily:'sans-serif',fontSize:12,}},
    ],
    visualMap: {
      show: false,
      seriesIndex: 4,
      dimension: 2,
      pieces: [{
          value: 1,
          color: upColor
      }, {
          value: -1,
          color: downColor
      }]
    },
    grid: [{
        top: '5%',
        left: 20,
        right: '15%',
        height: '65%'
      },
      {
        top: '75%',
        left: 20,
        right: '15%',
        height: '20%'
      },
    ],
    axisPointer: { //坐标轴指示器配置项
      link: [{xAxisIndex: [0,1]}],
      // label: {
      //   backgroundColor: '#ff0000',
      //   color: '#fff',
      //   borderColor: 'rgb(99, 117, 139)',
      //   borderWidth: 1,
      //   borderRadius: 2,
      //   fontSize: 10
      // }
    },
    xAxis: [{
      type: 'category', //坐标轴类型。(value:数值轴，适用于连续数据。,category:类目轴，适用于离散的类目数据,time: 时间轴，适用于连续的时序数据,log:对数轴。适用于对数数据)
      data: dates.value, //类目数据，在类目轴（type: 'category'）中有效。
      // scale: true,
      boundaryGap: false, //坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样。
      axisLine: {
        show: false
      }, //坐标轴轴线相关设置
      axisTick: {
        show: false
      }, //坐标轴刻度相关设置。
      axisLabel: {
        show: false,
      }, //坐标轴刻度标签的相关设置。
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255,255,255, 0.1)'
        }
      }, //坐标轴在 grid 区域中的分隔线。
      min: 'dataMin', //坐标轴刻度最小值。可以设置成特殊值 'dataMin'，此时取数据在该轴上的最小值作为最小刻度。
      max: 'dataMax', //坐标轴刻度最大值。可以设置成特殊值 'dataMax'，此时取数据在该轴上的最大值作为最大刻度。
      axisPointer: {
        label: {
          margin: 200
        }
      },
    }, {
      type: 'category',
      gridIndex: 1, //x 轴所在的 grid 的索引，默认位于第一个 grid。
      data: dates.value, //类目数据，在类目轴（type: 'category'）中有效。
      // scale: true,
      boundaryGap: false, //坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样。
      axisLine: {
        show: false,
      }, //坐标轴轴线相关设置
      axisTick: {
        show: false
      }, //坐标轴刻度相关设置。
      axisLabel: { //坐标轴刻度标签的相关设置。
        show: true,
        // margin: 6,
        fontSize: 10,
        color: 'rgba(99, 117, 139, 1.0)',
      },
      // splitNumber: 20,
      splitLine: {
        show: false,
      }, //坐标轴在 grid 区域中的分隔线。
      min: 'dataMin', //坐标轴刻度最小值。可以设置成特殊值 'dataMin'，此时取数据在该轴上的最小值作为最小刻度。
      max: 'dataMax', //坐标轴刻度最大值。可以设置成特殊值 'dataMax'，此时取数据在该轴上的最大值作为最大刻度。
    }],
    yAxis: [{
      type: 'value', //坐标轴类型。(value:数值轴，适用于连续数据。,category:类目轴，适用于离散的类目数据,time: 时间轴，适用于连续的时序数据,log:对数轴。适用于对数数据)
      position: 'right', //y 轴的位置。'left','right'
      scale: true, //是否是脱离 0 值比例。设置成 true 后坐标刻度不会强制包含零刻度。在双数值轴的散点图中比较有用。(在设置 min 和 max 之后该配置项无效。)
      axisLine: {
        show: false
      }, //坐标轴轴线相关设置。
      axisTick: {
        show: false,
        inside:true
      }, //坐标轴刻度相关设置。
      axisLabel: { //坐标轴刻度标签的相关设置。
        show: true,
        color: 'rgba(99, 117, 139, 1.0)',
        inside: false,
        fontSize: 10,
        formatter: function(value:string|number) {
          return Number(value).toFixed(2)
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255,255,255, 0.1)'
        }
      }, //坐标轴在 grid 区域中的分隔线。
    }, {
      type: 'value',
      position: 'right',
      scale: true,
      gridIndex: 1,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show: false
      },
      splitLine: {
        show: false
      }
    }],
    animation: false,
    color: ['#FFBD09','#16C6FF','#AE23A1'],
    tooltip: {
      trigger: 'axis',
      triggerOn: 'mousemove|click', //提示框触发的条件 'mousemove','click','mousemove|click','none'
      formatter:(params:any)=>{
        let tooltip:any = '';
        let time = '', open = 0, high = 0, low = 0, close = 0, amount = 0;
        for (var i = 0; i < params.length; i++) {
          if (params[i].seriesName === '日K') {
            time = params[i].name;
            open = params[i].data.length > 1 ? Number(formatterNum(params[i].data[1], 2)) : 0;
            close = params[i].data.length > 1 ? Number(formatterNum(params[i].data[2], 2)) : 0;
            low = params[i].data.length > 1 ? Number(formatterNum(params[i].data[3], 2)) : 0;
            high = params[i].data.length > 1 ? Number(formatterNum(params[i].data[4], 2)) : 0;
            amount = params[i].data.length > 1 ? Number(formatterNum(params[i].data[5], 2)) : 0;
            // console.log(time,open,close,low,high,amount)
            tooltip = '<div class="charts-tooltip" style="width:auto;">' +
              `<div class="charts-tooltip-row" style="${styleline}"><div class="ctr-label">` + 'Time' + '</div><div class="ctr-value">' + time + '</div></div>' + 
              `<div class="charts-tooltip-row" style="${styleline}"><div class="ctr-label">` + 'Open' + '</div><div class="ctr-value">' + open + '</div></div>' + 
              `<div class="charts-tooltip-row" style="${styleline}"><div class="ctr-label">` + 'High' + '</div><div class="ctr-value">' + high + '</div></div>' + 
              `<div class="charts-tooltip-row" style="${styleline}"><div class="ctr-label">` + 'Low' + '</div><div class="ctr-value">' + low + '</div></div>' + 
              `<div class="charts-tooltip-row" style="${styleline}"><div class="ctr-label">` + 'Close' + '</div><div class="ctr-value">' + close + '</div></div>' + 
              `<div class="charts-tooltip-row" style="${styleline}"><div class="ctr-label">` + 'Amount' + '</div><div class="ctr-value">' +amount + '</div></div></div>';
          }
          if (params[i].seriesName === 'MA5') {
            MA5.value = params[i].data !== 'NAN' ? Number(formatterNum(params[i].data, 2)) : 0
          }
          if (params[i].seriesName === 'MA10') {
            MA10.value = params[i].data !== 'NAN' ? Number(formatterNum(params[i].data, 2)) : 0
          }
          if (params[i].seriesName === 'MA20') {
            MA20.value = params[i].data !== 'NAN' ? Number(formatterNum(params[i].data, 2)) : 0
          }
          if (params[i].seriesName === 'VolumeMA5') {
            volMA5.value = params[i].data !== 'NAN' ? Number(formatterNum(params[i].data, 2)) : 0
          }
          if (params[i].seriesName === 'VolumeMA10') {
            volMA10.value = params[i].data !== 'NAN' ? Number(formatterNum(params[i].data, 2)) : 0
          }
          
        }
        return tooltip;
      },
      show:true,
      confine: true,
      showContent: true,
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      textStyle: {
        color: '#000'
      },
      position: function (pos, params, el, elRect, size) {
        const obj: Record<string, number> = {
          top: 10
        };
        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
        return obj;
      },
      axisPointer: { 
        label: {
          color: 'rgba(255,255,255,.87)',
          fontSize: 9,
          backgroundColor: 'rgb(245 114 114 / 80%)',
          borderColor: "rgb(245 114 114 / 80%)",
          shadowBlur: 0,
          borderWidth: 0.5,
          padding: [4, 2, 3, 2],
        },
        animation: false,
        type: 'cross',
        lineStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: 'rgba(30, 42, 66, 0.1)' // 0% 处的颜色
            }, {
              offset: 0.7,
              color: 'rgba(30, 42, 66,0.9)' // 100% 处的颜色
            }, {
              offset: 1,
              color: 'rgba(30, 42, 66,0.2)' // 100% 处的颜色
            }]
          },
          width: 1,
          shadowColor: 'rgba(255, 0, 0, 0.7)',
          shadowBlur: 0,
          shadowOffsetY: 68,
        }
      },
    },
    dataZoom: [{ //用于区域缩放
      type: 'inside',
      xAxisIndex: [0, 1],
      start: 70,
      end: 100,
    }
    ],
    series: [
      {
        type: 'candlestick',
        name: '日K',
        data: rawData.value.reverse(),
        markLine: {
        data:[{
              name: 'value',
              yAxis: 1800
          }],
      },
        itemStyle: {
          color: upColor,
          color0: downColor,
          borderColor: undefined,
          borderColor0: undefined,
        },
      }, 
      {
        name: 'MA5',
        type: 'line',
        data: calculateMA(5, echartsData.value),
        symbol: 'none',//去除圆点
        smooth: true,
        lineStyle: {width: 1},
        z: 5,
      }, 
      {
        name: 'MA10',
        type: 'line',
        data: calculateMA(10, echartsData.value),
        symbol: 'none',//去除圆点
        smooth: true,
        lineStyle: {width: 1},
        z: 4
      },
      {
        name: 'MA20',
        type: 'line',
        data: calculateMA(20, echartsData.value),
        symbol: 'none',//去除圆点
        smooth: true,
        lineStyle: {width: 1},
        z: 3
      },
      {
          name: 'Volume',
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data:volumes.value.reverse(),
          barWidth:'50%'
        },
        {
          name: 'VolumeMA5',
          type: 'line',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: calculateMA(5, volumes.value),
          symbol: 'none',//去除圆点
          smooth: true,
          lineStyle: {width: 1},
          z: 5,
        },
        {
          name: 'VolumeMA10',
          type: 'line',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: calculateMA(10, volumes.value),
          symbol: 'none',//去除圆点
          smooth: true,
          lineStyle: {width: 1},
          z: 4,
        },
    ]
  };
  option && myChart.setOption(option);
  settitle.value = true;
  window.addEventListener('resize', () => { myChart.resize()})
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

// 获取产品列表
const getList = async () => {
  // const res = await $api.getList();
  const res = await $api.getQQJYproduct('');
  if(res && res['code'] == 200){
    Store.data.recommendList = res.data;
    formData.data.Bid = res.data[0].id;
  }
}

var widthArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
// 获取买卖数据
const getTotalTrades = async (symbol:string = 'eth_usdt') => {
  let widthRandom:any = [];
  const res = await $api.getTotalTrades(symbol);
  if(res && res['code'] == 200){
    widthArr.forEach(item=>{
      widthRandom.push(Math.floor(Math.random()*(item - item*5 ) + item*7))
    })
    widthRandom.sort(function(m:number,n:number){return m-n; })
    res.list.forEach((item:any,index:number)=>{
      item['width'] = widthRandom[index];
      item.date = dayjs(item.date*1000).format("HH:mm:ss");
    })
    TotalTrades.data = res.list;
  }
}

// 切换产品列表
const onChangeList = (_ev:any) => {
  const { dataset } = _ev.target;
  Store.data.proIndex = Number(dataset['index']);
  Store.data.sildershow = false;
  formData.data.Bid = dataset['id'];
  // 重置属性
  formData.data.amount = '';
  Store.data.tabindex = 0;
  Store.data.comboIndex = 0;
  getTotalTrades(dataset['value']);
  splitData(dataset['value']);
  $store.commit('setUseLoading',true);
  settitle.value = false;
}

// 下单重置
const formDataClone = {...formData.data}

// 选择购买时间
const onSelect = (action: any, index: number) => {
    showTimeCard.value = false;
    Store.data.comboInfo = action.name;
    Store.data.placeholder = action.maxmoney;
    Store.data.comboIndex = index;
    onUpdatemount(formData.data.amount);
};

// 计算金额
const onUpdatemount = (value: string) => {
  if(!Store.data.comboActions.length) return;
  Store.data.ratio = (Number(value) * Store.data.comboActions[Store.data.comboIndex].ratio).toFixed(2);
}

// 立即下单
const onSubmit = async () => {
  if(!formData.data.amount){
    showToast('请输入金额');return;
  }else if(formData.data.amount < Store.data.comboActions[Store.data.comboIndex].minmoney){
    showToast('金额太小'); return;
  }else{
    $store.commit('setUseLoading',true);
    formData.data.comboInfoId = Store.data.comboActions[Store.data.comboIndex].id;
    const res = await $api.getSubmitOrder(formData.data);
    if(res && res['code'] == 200 ){
      timeDown.value = Store.data.comboActions[Store.data.comboIndex].duration_m* 1000;
      formData.data = formDataClone;
      Store.data.show = false;
      Ordershow.value = true;
    }else{
      showToast(res['msg'])
    }
  }
}

// 继续下单
const handleContinue = () => {
  Ordershow.value = false;
  formData.data.amount = '';
  timeDown.value = 1000;
}

// 倒计时结束
const onFinish = () => {
  timeDown.value = 1000;
  Ordershow.value = false;
};
// 订单信息
const Ordershow = ref<boolean>(false);

onMounted(()=>{
  handleLogin();
  getList();
  splitData();
  getTotalTrades();
  Promise.all([
    $api.getSubmitOptions(),
    $api.getAuxiliary('options_trading_Xck')
  ])
  .then((res:any[])=>{
    if(res.includes(undefined)||res[0]['code'] == 5001){
      return
    };
    res[0].data.forEach(((item:any)=>{item.ratio = (item.ratio/100).toFixed(3)}));
    Store.data.comboActions = res[0].data;
    Store.data.comboInfo = res[0].data.length ? res[0].data[0].name : '';
    Store.data.placeholder = res[0].data.length ? res[0].data[0].maxmoney : '0'
    Store.data.options_trading = res[1].data1;

    // 买卖数据轮询
    time = setInterval(() => {
      setTimeout(async () => {
        $store.commit('setUseLoading',false);
        getTotalTrades(Store.data.recommendList[Store.data.proIndex]['MJname']);
      }, 100)
    }, 6000)
    
  })
  .catch((err)=>{
    console.log(err);
  })

})

onUnmounted(()=>{
  clearInterval(time);
  $store.commit('setUseLoading',true);
})
</script>

<template>
  <div class="page-main">

    <section class="candlesticks-wrap">
      <div class="candlesticks-top">
        <div class="candlesticks-topPrice">
          <div class="variety">
            <div class="variety-title" @click="Store.data.sildershow = !Store.data.sildershow">
              {{Store.data.recommendList.length?Store.data.recommendList[Store.data.proIndex].ZSname:'USDT'}} 
              <van-icon name="arrow-down" />
            </div>
            <div class="variety-price" :class="{'red':Number(QQQuotes?QQQuotes.riseRate:-1)<0?true:false}">
              <span>{{QQQuotes?QQQuotes.close:0}}</span><span class="riseRate">{{QQQuotes?QQQuotes['riseRate']:0}}%</span></div>
          </div>
          <div class="price">
            <div>24H High:{{ Number(QQQuotes?QQQuotes.high:0.00).toFixed(5) }}</div>
            <div>24H Low:{{ Number(QQQuotes?QQQuotes.low:0.00).toFixed(5) }}</div>
          </div>
        </div>

        <div class="candlesticks-bottom tablist" @click="onChangeTime">
          <div class="tabitem" :class="{'current':index == Store.data.tabindex}" v-for="(item,index) in Store.data.timelist" :key="index" :data-index="index">{{ item }}</div>
        </div>

      </div>

      <div class="charts-wrap">
        <div class="candlesticks-echarts" id="echartsBox"></div>
        <div class="charts-label" v-show="settitle">
					<div class="charts-MA5">MA5:{{MA5 || 0}}</div>
					<div class="charts-MA10">MA10:{{MA10 || 0}}</div>
					<div class="charts-MA20">MA20:{{MA20 || 0}}</div>
				</div>
				<div class="charts-bar-label" v-show="settitle">
					<div class="charts-MA5">MA5:{{ volMA5 || 0}}</div>
					<div class="charts-MA10">MA10:{{ volMA10 || 0}}</div>
				</div>
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
        <div class="history-info">
          <!-- left -->
          <div class="history-data">
            <div class="data-item" v-for="(item,index) in TotalTrades.data" :key="index">
              <div class="data-mask-green" :style="{'width':`${item.width}px`,'max-width':'100px'}"></div>
              <div class="data-txt">{{item.date}}</div>
              <div class="data-direc" :class="{'red':item.type == 'sell' ,'green':item.type == 'buy'}">{{item.type}}</div>
            </div>
          </div>
          <!-- right -->
          <div class="history-data">
            <div class="data-item" v-for="(item,index) in TotalTrades.data" :key="index">
              <div class="data-mask-red" :style="{'width':`${item.width}px`,'max-width':'100px'}"></div>
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
      <van-action-sheet v-model:show="Store.data.show" title="確認訂單">
        <!-- 说明按钮 -->
        <div class="buy-tip" @click="Store.data.showTip = true"><van-icon name="warning" size="25" color="#F7931A" /></div>
        <div class="buy-content">
          <div>
            <div v-show="!Store.data.showTip">
            <div class="buy-select">
              <div class="buy-name">
                <img :src="Store.data.recommendList.length?Store.data.recommendList[Store.data.proIndex].Ioc:'#'" :alt="Store.data.recommendList[Store.data.proIndex].name">
                <div class="buy-info">
                  <p class="buy-name">{{Store.data.recommendList.length?Store.data.recommendList[Store.data.proIndex].name:'USDT'}} </p>
                  <p class="buy-flog">buy <van-tag color="#00c6931a" :text-color="!formData.data.ZD?'#00C693':'red'">{{!formData.data.ZD?'涨':'跌'}}</van-tag></p>
                </div>
              </div>
              <div class="buy-time"><van-icon name="clock-o" color="#333333" />  {{ Store.data.comboInfo }}</div>
            </div>
            <van-divider />

            <div class="buy-card">
              <p class="buy-card-tit">選擇時間</p>
              <div class="buy-card-item">
                <div class="buy-card-select low3" @click="showTimeCard = true" >
                  <van-icon name="clock-o" color="#333333"  />{{ Store.data.comboInfo }}<van-icon name="arrow-down" color="#333333" />
                </div>
                <div class="buy-card-state" :class="{'active':!formData.data.ZD}" @click="formData.data.ZD = 0">涨</div>
                <div class="buy-card-state" :class="{'active':formData.data.ZD }" @click="formData.data.ZD = 1">跌</div>
              </div>
            </div>

            <div class="buy-card">
              <p class="buy-card-tit">價格範圍</p>
              <div class="buy-card-item">
                <div class="buy-card-select low1" @click="showRangeCard = true">
                  <p class="buy-card-flag" :class="{'Dsy':formData.data.ZD}">
                    <van-icon :name="!formData.data.ZD?'plus':'minus'" :color="!formData.data.ZD?'#00C693':'red'" /> {{!formData.data.ZD?'涨':'跌'}} | >0.001%</p>
                  <p class="buy-card-txt">(*{{!Store.data.comboActions.length?'xxx':Store.data.comboActions[Store.data.comboIndex].ratio}})</p>
                  <van-icon name="arrow-down" color="#333333" />
                </div>
              </div>
            </div>

            <div class="buy-card">
              <p class="buy-card-tit">購買金額</p>
              <div class="buy-card-item">
                <div class="buy-card-select price-left">
                  <!-- <p class="buy-card-logo">
                    <img src="../../assets/silder/btc.png" alt="">
                  </p> -->
                  <p>USDT</p>
                </div>
                <div class="buy-card-select price-right">
                  <div class="buy-card-field">
                    <van-field 
                      v-model="formData.data.amount" 
                      type="number" 
                      :placeholder="`>=${Store.data.placeholder}USDT`" 
                      @update:model-value="onUpdatemount"
                      /></div>
                  <p @click="formData.data.amount = !Store.data.comboActions.length?'':Store.data.comboActions[Store.data.comboIndex].maxmoney">Max</p>
                </div>
              </div>
            </div>
            <div class="earnings">預期收益：<span>{{Store.data.ratio}}</span></div>
            <van-button type="primary" color="#3C5FE7" block @click="onSubmit">確認下單</van-button>
            </div>
          </div>

          <div class="buytip-wrap" v-show="Store.data.showTip">
            <h2 class="buytip-title">{{Store.data.options_trading.title}}</h2>
            <div class="buytip-desc" v-html="Store.data.options_trading.body"></div>
            <div class="buytip-btn" @click="Store.data.showTip = !Store.data.showTip">OK</div>
          </div>

        </div>
      </van-action-sheet>

      <van-action-sheet v-model:show="showTimeCard" :actions="Store.data.comboActions" @select="onSelect" close-on-click-action/>
      <!-- range -->
      <van-action-sheet v-model:show="showRangeCard" @select="showRangeCard = false" close-on-click-action>
        <div class="buy-Range-list">
          <div class="buy-Range-item" @click="showRangeCard = false">
            <span class="buy-Range-flog" :class="{'Dsy':formData.data.ZD}">{{ !formData.data.ZD?'涨':'跌' }} |>0.001%。</span>
            <span class="buy-Range-info">回报率 {{ Store.data.comboActions[Store.data.comboIndex].ratio }}</span>
          </div>
        </div>
      </van-action-sheet>
    </div>

    <van-overlay :show="Store.data.sildershow" @click="handlemouseClick" :lazy-render="false">
      <div class="recommend-list">
        <div class="title"><span>現貨行情</span></div>
        <div class="recommend-item" v-for="(item,index) in Store.data.recommendList" :key="item.id" @click="onChangeList">
          <div class="mask" :class="{'red':item.riseRate < 0}" :data-value="item.MJname" :data-name="item.ZSname" :data-index="index" :data-id="item.id" ></div>
          <div class="name"><span>{{item.name}}</span><span class="subname">/{{item.ZSname.split('/')[1]}}</span></div>
          <div class="close" :class="{'red':item.riseRate < 0}">{{item.close}}</div>
          <div class="riseRate" :class="{'red':item.riseRate < 0}">{{ item.riseRate > 0 ? `+${item.riseRate}` : `${item.riseRate}` }}%</div>
        </div>
      </div>
    </van-overlay>

    <van-overlay :show="Ordershow">
      <div class="order-wrap">
        <div class="order-layout">
          <div class="order-head">
            <span>订单信息</span>
            <van-icon class="order-off" size="20" name="cross" @click="Ordershow = false" />
          </div>
          <div class="order-main">
            <div class="order-countDown">
              <van-count-down ref="countDown" :time="timeDown" format="DD:HH:ss" @finish="onFinish">
                <template #default="timeData">
                  <div class="time-box">
                    <span class="block day">{{ timeData.days < 10? '0' + timeData.days : timeData.days }}</span>
                    <span class="block hour">{{ timeData.hours < 10? '0' + timeData.hours : timeData.hours }}</span>
                    <span class="block minute">{{ timeData.minutes < 10? '0' + timeData.minutes : timeData.minutes }}</span>
                    <span class="block secound">{{ timeData.seconds < 10? '0' + timeData.seconds : timeData.seconds }}</span>
                  </div>
                </template>
              </van-count-down>
            </div>
            
            <div class="order-info">
              <div class="order-item"><div class="left">方向</div><div class="right green">{{!formData.data.ZD?'涨':'跌'}}|>{{Store.data.comboActions[Store.data.comboIndex].ratio}}%</div></div>
              <div class="order-item"><div class="left">金额</div><div class="right">{{formData.data.amount}} USDT</div></div>
              <div class="order-item"><div class="left">執行價</div><div class="right">{{  QQQuotes ? QQQuotes.close : 0 }}</div></div>
              <div class="order-item"><div class="left">盈利率</div><div class="right"></div></div>
              <div class="order-item"><div class="left">盈利</div><div class="right">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="20px" height="26px" viewBox="0 0 24 30" xml:space="preserve">
                  <rect x="0" y="10" width="4" height="10" fill="#333" opacity="0.2">
                    <animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0s" dur="0.6s" repeatCount="indefinite"></animate>
                    <animate  attributeName="height" attributeType="XML" values="10; 20; 10" begin="0s" dur="0.6s" repeatCount="indefinite"></animate>
                    <animate  attributeName="y" attributeType="XML" values="10; 5; 10" begin="0s" dur="0.6s" repeatCount="indefinite"></animate>
                  </rect>
                  <rect  x="8" y="10" width="4" height="10" fill="#333" opacity="0.2">
                    <animate  attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.15s" dur="0.6s" repeatCount="indefinite"></animate>
                    <animate  attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite"></animate>
                    <animate  attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite"></animate>
                  </rect>
                  <rect  x="16" y="10" width="4" height="10" fill="#333" opacity="0.2">
                    <animate  attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.3s" dur="0.6s" repeatCount="indefinite"></animate>
                    <animate  attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite"></animate>
                    <animate  attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite"></animate>
                  </rect>
                </svg>
              </div>
            </div>

            </div>
          </div>
          <div class="order-foot">
            <div class="buttom checkOrder" @click="$router.push('/options/trade')">查看订单</div>
            <div class="buttom continue" @click="handleContinue">继续下单</div>
          </div>
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

.multiEllipsis(@line:2) {
    overflow : hidden;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: @line;
    -webkit-box-orient: vertical;
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
      animation: mask-anime 1s .4s ease both;
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
    .mask.red{
      background: -webkit-linear-gradient(left,rgba(230,93,68,0),rgba(230,93,68,.2) 50%,rgba(230,93,68,.3) 80%,rgba(230,50,46,.4));
      background: linear-gradient(90deg,rgba(230,93,68,0),rgba(230,93,68,.2) 50%,rgba(230,93,68,.3) 80%,rgba(230,50,46,.4));
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
      font-size: 17px;
      .multiEllipsis(1);
      flex-basis: 35%;
    }
    .close.red{
      color: @redColor;
    }
    .riseRate{
      width: 70px;
      height: 27px;
      line-height: 30px;
      text-align: center;
      font-size: 13px;
      border-radius: 4px;
      color: #fff;
      background: @greenColor;
    }
    .riseRate.red{
      background-color: @redColor;
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
      .flexMixin(space-evenly);
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
        justify-content: center;
        gap: 5px;
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

.order-wrap{
  .flexMixin(center);
  height: 100%;
  padding: 0 30px;
  .order-layout{
    background-color: #fff;
    border-radius: 15px;
    height: 370px;
    width: 100%;
    .order-head{
      position: relative;
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 15px;
      font-weight: 700;
      color: #3c3220;
      border-bottom: 1px solid #f0f0f0;
      .order-off{
        position: absolute;
        top: 50%;
        right: 20px;
        transform: translateY(-50%);
      }
    }
    .order-main{
      padding: 0 35px;
      .order-countDown{
        margin: 20px 0;
        .time-box{
          .flexMixin(center);
          gap: 7px;
          .block{
            height: 50px;
            border-radius: 7px;
            width: 45px;
            text-align: center;
            line-height: 50px;
            color: #fff;
            font-size: 15px;
            font-weight: bold;
            letter-spacing: 5px;
          }
          .day{background-color: #FA6142;}
          .hour{background-color: #00C693;}
          .minute{background-color: #F7BC58;}
          .secound{background-color: #6C96E8;}
        }
      }
      .order-info{
        .order-item{
          .flexMixin(space-between);
          line-height: 30px;
          .left{
            color: #999ba9;
            flex-basis: 50%;
          }
          .right{
            text-align: right;
            flex-basis: 50%;
            color: #3b3e4e;
            font-weight: 700;
        }
          .right.green{
            color: #009f49;
          }
        }
      }
    }
    .order-foot{
      .flexMixin(space-between);
      margin-top: 15px;
      padding: 0 20px;
      text-align: center;
      .buttom{
        background: #fff;
        border: 1px solid #e0e0e0;
        border-radius: 10px;
        font-size: 15px;
        font-weight: 600;
        width: 120px;
        height: 40px;
        line-height: 40px;
      }
      .checkOrder{
        color: #4d4d4d;
      }
      .continue{
        background: -webkit-linear-gradient(359.84deg,#00c693 .14%,#00c693 102.99%);
        background: linear-gradient(90.16deg,#00c693 .14%,#00c693 102.99%);
        color: #fff;
      }
    }
  }
}

.charts-wrap{
  position: relative;
}
.charts-label {
	position: absolute;
	left: 80px;
	top: 3px;
	font-size: 10px;
	display: flex;
	justify-content: center;
	align-items: center;
}

.charts-label div {
	margin-right: 14px;
}

.charts-MA5 {
	color: #FFC62B;
}

.charts-MA10 {
	color: #4FD4FF;
}

.charts-MA20 {
	color: #C767BE;
}

.charts-bar-label {
	position: absolute;
	left: 65px;
	top: 75.8%;
	font-size: 10px;
	display: flex;
	justify-content: center;
	align-items: center;
}

.charts-bar-label div {
	margin-right: 14px;
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