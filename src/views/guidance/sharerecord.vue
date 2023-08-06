<script lang="ts">
export default {
  name: "sharerecord",
};
</script>
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import api from "../../https";

const flogs = ref<boolean>(false);
const bankhuiyuan = [
  { id: 0, value: "所有会员" },
  { id: 1, value: "1代会员" },
  { id: 2, value: "2代会员" },
  { id: 3, value: "3代会员" },
];
const cxkindex = ref<any>(0);
// const shaniaocxk=ref<any>('')
const onchangse = (ev: any) => {
  console.log(ev);
  console.log(cxkindex, "id");

  cxkindex.value = ev;
  flogs.value = false;
  // console.log(shaniaocxk.value,'aaa');
};
const xianshia = () => {
  flogs.value = true;
};
// 量化
const sbindex = ref<any>(0);
const flags=ref<boolean>(false)
const banklianghua = [
  { id: 0, value: "量化返佣" },
  { id: 1, value: "BOT策略返佣" },
  { id: 2, value: "期权返佣" },
];
const onchangses=(ev:any)=>{
  sbindex.value=ev;
  flags.value = false;
}
const xianshisa=()=>{
  flags.value = true;
}
// 邀请记录显示
const flagxianshi=ref<boolean>(true);
  const postloser=async(index:any)=>{
    const data=await api.postloser(index)
    console.log(data,'邀请记录');
    
  }
  onMounted(()=>{
    postloser(1)
  })
</script>

<template>
  <div>
    <div class="detailcontents">
      <div class="tabls">
        <div class="chushi" :class="{'current1':flagxianshi}" @click="flagxianshi=true">邀请记录</div>
        <div class="chushi" :class="{'current2':!flagxianshi}" @click="flagxianshi=false">返佣记录</div>
      </div>
      <div class="filters"   v-if="flagxianshi">
        <div class="selects">
          <div>{{ bankhuiyuan[cxkindex].value }}</div>
          <div @click="xianshia"><van-icon name="arrow-down" /></div>
        </div>
        <div class="selectSu" v-if="flogs == true">
          <div
            v-for="item in bankhuiyuan"
            :key="item.id"
            @click="onchangse(item.id)"
          >
            {{ item.value }}
          </div>
        </div>
        <div class="cxkcha">查询</div>
      </div>
      <!-- lianghua -->
      <div class="filters" v-else>
        <div class="selects">
          <div>{{ banklianghua[sbindex].value }}</div>
          <div @click="xianshisa"><van-icon name="arrow-down" /></div>
        </div>
        <div class="selectSu" v-if="flags == true">
          <div
            v-for="item in banklianghua"
            :key="item.id"
            @click="onchangses(item.id)"
          >
            {{ item.value }}
          </div>
        </div>
        <div class="cxkcha">查询</div>
      </div>
      <div class="gainList">
        <div class="no-more">
          <img src="../../assets/share/wufa.png" alt="" />
          <div class="fandeihen">暫無參與記錄</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.detailcontents {
  background: #f4f6f8;
  padding: 15px;
}
.tabls {
  background: #fff;
  border-radius: 10px;
  height: 47px;
  line-height: 47px;
  text-align: center;
  justify-content: space-around;
  font-size: 14px;
  margin: 10px 0;
  margin-bottom: 15px;
  display: flex;
}
// 点击变颜色
.chushi {
  width: 50%;
}
.current1 {
  color: #fff;
  background: #2850e7;
  border-radius: 10px 0 0 10px;
}
.filters {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
}
.selects {
  background: #fff;
  border-radius: 10px;
  color: #333;
  display: flex;
  justify-content: space-between;
  padding: 9px 18px;
  font-size: 15px;
  width: 243px;
}
.cxkcha {
  color: #fff;
  background: #2850e7;
  border-radius: 10px;
  padding: 9px 18px;
  margin-left: 15px;
}
.selectSu {
  background: #fff;
  border-radius: 10px;
  color: #333;
  padding: 9px 18px;
  font-size: 15px;
  position: absolute;
  top: 45px;
  z-index: 999;
  text-align: center;
  width: 243px;
  box-shadow: 0 5px 15px 0 #ccc;
}
.gainList {
  background: #f4f6f8;
}
.no-more {
  text-align: center;
  margin: 20px 0 0;
  background: #fff;
  box-shadow: 0 2px 18px rgba(67, 101, 255, 0.06);
  border-radius: 15px;
  padding-top: 121px;
  height: 429px;
}
.fandeihen {
  color: #2c3e50;
  font-weight: 500;
}
.current2{
  color: #fff;
    background: #2850e7;
    border-radius: 0 10px 10px 0;
}
</style>