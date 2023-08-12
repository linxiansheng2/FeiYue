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
  console.log(cxkindex.value,'aaa');
};
const xianshia = () => {
  flogs.value = true;
};
// 量化
const sbindex = ref<any>(0);
const flags = ref<boolean>(false);
const banklianghua = [
{ id: 0, value: "全部" },
  { id: 1, value: "挖矿返佣" },
  { id: 2, value: "期权返佣" },
];
const onchangses = (ev: any) => {
  sbindex.value = ev;
  console.log(sbindex.value,'下标');
  
  flags.value = false;
};
const xianshisa = () => {
  flags.value = true;
};
// 邀请记录显示
const datas = reactive<any>({ data: [] });
const flagxianshi = ref<boolean>(true);
const postloser = async (type:any,index: any, pageSize: any) => {
  const data = await api.postloser(type,index, pageSize);
  console.log(data, "邀请记录");
  if (data.code == 200) {
    datas.data = data.rows;
    datas.data.forEach((item:any)=>{
      // let str=item.address.slice(5,-5)
      //      item.address=item.address.replace(str,'....')
      item.address=item.address.replace(/^(.{4})(?:\w+)(.{4})$/,"$1****$2")
    })
  }
};
//下级返佣记录接口
const cxkdatas=reactive<any>({data:[]})
const posttelist = async (type: any, pageNum: any, pageSize: any) => {
  const res = await api.posttelist(type, pageNum, pageSize);
  console.log(res, "//下级返佣记录接口");
  if(res.code==200){
        cxkdatas.data=res.rows
        cxkdatas.data.forEach((item:any)=>{
      // let str=item.address.slice(5,-5)
      //      item.address=item.address.replace(str,'....')
      item.address=item.address.replace(/^(.{4})(?:\w+)(.{4})$/,"$1****$2")
    })
      }
};
//查询
const chaxun=async()=>{
      const res=await api.postloser(cxkindex.value,1,10)
      console.log(res,'查询');
     if(res.code==200){
      datas.data=res.rows
      datas.data.forEach((item:any)=>{
      item.address=item.address.replace(/^(.{4})(?:\w+)(.{4})$/,"$1****$2")
    })
     }
}
//邀请
const yaoqing=()=>{
  flagxianshi.value=true
  postloser(0,1, 10)
}
//fanyong
const fanyong=()=>{
  flagxianshi.value=false
  posttelist(0, 1, 10)
}
//翻涌查询
const chaxuna=async()=>{
    const resdata=await api.posttelist(sbindex.value,1,10)
    console.log(resdata,'');
    if(resdata.code==200){
      cxkdatas.data=resdata.rows
        cxkdatas.data.forEach((item:any)=>{
      // let str=item.address.slice(5,-5)
      //      item.address=item.address.replace(str,'....')
      item.address=item.address.replace(/^(.{4})(?:\w+)(.{4})$/,"$1****$2")
    })
    }
}
onMounted(() => {
  postloser(0,1, 10), posttelist(0, 1, 10);
});
</script>

<template>
  <div>
    <div class="detailcontents">
      <div class="tabls">
        <div
          class="chushi"
          :class="{ current1: flagxianshi }"
          @click="yaoqing"
        >
          邀请记录
        </div>
        <div
          class="chushi"
          :class="{ current2: !flagxianshi }"
          @click="fanyong"
        >
          返佣记录
        </div>
      </div>
      <div class="filters" v-if="flagxianshi">
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
        <div class="cxkcha"  @click="chaxun">查询</div>
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
        <div class="cxkcha" @click="chaxuna">查询</div>
      </div>
      <div class="gainList" v-if="flagxianshi">
        <div class="no-more" v-if="!datas.data.length">
          <img src="../../assets/share/wufa.png" alt="" />
          <div class="fandeihen">暫無參與記錄</div>
        </div>
        <div class="sbssscxk">
          <div v-for="itema in datas.data" :key="itema.id" class="tantantan">
            <div>
              <img
                class="imgsxksb"
                src="../../assets/logos/touxiang.png"
                alt=""
              />
            </div>
            <div class="saddress">
              <div class="saddress_ress">{{ itema.address }}</div>
              <div>{{ itema.create_time }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 翻涌 -->
      <div class="gainList" v-else>
        <div class="no-more" v-if="!datas.data.length">
          <img src="../../assets/share/wufa.png" alt="" />
          <div class="fandeihen">暫無參與記錄</div>
        </div>
        <div class="sbssscxk">
          <div class="dongadong donga">
          <div class="color_title">地址</div>
          <div class="color_title">时间</div>
          <div class="color_title">金额</div>
          

        </div>
        <div v-for="itemcxk in cxkdatas.data" :key="itemcxk.id" class="dongadong">
              <div class="san">{{ itemcxk.address }}</div>
              <div  class="san1">{{ itemcxk.create_time }}</div>
              <div  class="san2">{{ itemcxk.FYmoney }}</div>
        </div>
        </div>
        <!-- <div class="sbssscxk">
          <div v-for="itema in datas.data" :key="itema.id" class="tantantan">
            <div>
              <img
                class="imgsxksb"
                src="../../assets/logos/touxiang.png"
                alt=""
              />
            </div>
            <div class="saddress">
              <div class="saddress_ress">{{ itema.address }}</div>
              <div>{{ itema.create_time }}</div>
            </div>
          </div>
        </div> -->
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
.current2 {
  color: #fff;
  background: #2850e7;
  border-radius: 0 10px 10px 0;
}
//
.sbssscxk {
  background-color: #fff;
  margin-top: 10px;
  border-radius: 10px;
  
}
.tantantan{
  display: flex;
  align-items: center;
}
.imgsxksb {
  width: 50px;
  height: 50px;
}
.saddress {
  margin-left: 10px;
}
.saddress_ress{
  font-weight: 500;
  font-size: 15px;
  color: #333;
}
.dongadong{
  display: flex;
  justify-content: space-between;
  align-items: center;
 
 margin-top: 10px;

}
.color_title{
  font-weight: 500;
  font-size: 15px;
  color: #333;
}
.donga{
  padding: 0 23px;
}
.san{
  width: 33%;
  margin-left: 5px;
  font-weight: 500;
  font-size: 14px;
  color: #333;
}
.san1{
  width: 50%;
  font-weight: 500;
  font-size: 14px;
  color: #333;
}
.san2{
  width: 12%;
  font-weight: 500;
  font-size: 14px;
  color: #333;
}
</style>