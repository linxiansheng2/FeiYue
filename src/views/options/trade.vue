<script lang="ts">
export default {
  name: "trade",
};
</script>
<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from "vue";
import $api from "@/https";
import { useStore } from "vuex";
import { useI18n } from 'vue-i18n'
const { locale , t } = useI18n();
const $store = useStore();

const Store: any = reactive({
  data: {
    state: 3, //3=持仓中 4=已完成
    pageNum: 1, //当前页数
    pageSize: 10, //单页最大值
    total: 10, //总数据
    count: 1, //总页数
    orderList: [], //订单列表
  },
});

/**
 *
 * @param val 启用tab
 * @param state 3=持仓中 4=已完成
 */
const onChange = (state: number) => {
  Store.data.state = state;
  Store.data.pageNum = 1;
  Store.data.orderList = [];
  onChangePage(1);
};

const onChangePage = async (_ev: any) => {
  const res = await $api.getQQJYOrderList(
    Store.data.state,
    _ev,
    Store.data.pageSize
  );
  if (res && res["code"] == 200) {
    Store.data.count = parseInt(
      String((res["total"] + Store.data.pageSize - 1) / Store.data.pageSize)
    );
    Store.data.orderList = res["rows"];
    Store.data.total = res["total"];
  }
};

onMounted(() => {
  onChangePage(1);
});
</script>

<template>
  <div class="page-main">
    <div class="trade-tab" >
      <div class="trade-item" :class="{'active':Store.data.state == 3}" @click="()=>{onChange(3)}">{{$t('options_trade.options_trade1')  }}</div>
      <div class="trade-item" :class="{'active':Store.data.state == 4}" @click="()=>{onChange(4)}">{{$t('options_trade.options_trade2')  }}</div>
    </div>
    <Cus-Card marginTop="15" padding="15">
      <div class="order-list" v-if="Store.data.orderList.length">
        <div class="order-item" v-for="item in Store.data.orderList" :key="item.id">
          <div class="order-info">
            <div class="head">{{String(item.MJname).replace('_','/')}}
          <p class="bullish" :class="{
            }">{{ item.order_type?`${$t('options_trade.options_trade3')  }`:`${$t('options_trade.options_trade4')  }` }}
            </p>  
            </div>
            <span class="bullitit">{{item.State == 1 ?`${$t('options_trade.options_trade14')  }`:`${$t('options_trade.options_trade15')  }`}}</span></div>
          <van-divider />
          <div class="order-info"><span>{{$t('options_trade.options_trade5')  }}</span><span>{{item.time1}}</span></div>
          <div class="order-info"><span>{{$t('options_trade.options_trade6')  }}</span><span>{{item.Bhuil}}</span></div>
          <div class="order-info"><span>{{$t('options_trade.options_trade7')  }}</span><span>{{ item.money }}</span></div>
          <div class="order-info"><span>{{$t('options_trade.options_trade8')  }}</span><span>{{ item.time_name }}</span></div>
          <div class="order-info"><span>{{$t('options_trade.options_trade9')  }}</span><span>{{ item.ratio }}%</span></div>
          <div class="order-info"  v-if="Store.data.state == 4"><span>{{$t('options_trade.options_trade10')  }}</span><span>{{ item.Bhuil_end }}</span></div>
          <div class="order-info"><span>{{$t('options_trade.options_trade11')  }}</span><span>{{ item.time2 }}</span></div>
          <div class="order-info" v-if="Store.data.state == 4"><span>{{$t('options_trade.options_trade12')  }}</span><span>{{ item.money_SY }}</span></div>
          <div class="order-info"><span>{{$t('options_trade.options_trade13')  }}</span><span>{{ item.handlingfee }}%</span></div>
          <!-- <div class="order-details" v-if="Store.data.state == 3"><p class="details_btn">查看详情</p></div> -->
        </div>
        <van-pagination v-show="Store.data.total>Store.data.orderList.length" v-model="Store.data.pageNum" :page-count="Store.data.count" mode="simple" @change="onChangePage" >
          <template #prev-text><van-icon name="arrow-left" /></template>
          <template #next-text><van-icon name="arrow" /></template>
        </van-pagination>
      </div>
      <van-empty v-else image-size="10rem" :description="$t('options_trade.options_trade16')" />
    </Cus-Card>
  </div>
</template>

<style scoped lang="less">
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
  padding-top: 20px;
}
.trade-tab {
  display: flex;
  flex: 0 0 50%;
  justify-content: center;
  padding: 0 25px;
  .trade-item {
    background: #fff;
    box-shadow: 0 3px 25px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    text-align: center;
    line-height: 44px;
    font-size: 17px;
    font-weight: 500;
    color: #3b3e4e;
    padding: 0 5px;
    height: 44px;
    width: 100%;
  }
  .trade-item.active {
    color: #fff;
    background: #2850e7;
  }
}

.order-list {
  .order-item {
    padding: 5px 0;
    .order-info {
      font-size: 13px;
      line-height: 30px;
      .flexMixin(space-between);
      .head {
        font-size: 18px;
        color: #010101;
        text-transform: uppercase;
        .bullish {
          background: #00c693;
          color: #fff;
          border-radius: 8px 24px 8px 8px;
          font-size: 11px;
          padding: 2px 6px 1px 2px;
          margin-left: 10px;
          display: inline;
        }
      }
      .bullitit {
        color: #00c693;
        font-size: 16px;
      }
    }
    .order-details {
      text-align: center;
      .details_btn {
        border-radius: 5px;
        border: 1px solid #d7d7d7;
        width: auto;
        display: inline-block;
        padding: 5px 25px;
        cursor: pointer;
      }
    }
    .order-info > span {
      flex-basis: 50%;
    }
    .order-info > span:last-child {
      text-align: right;
      font-size: 14px;
    }
  }
}
</style>