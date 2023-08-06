<template>
  <div class="home">

    <h1>功能测试，授权（测试网）</h1>
	 <button @click="chushihua">连接钱包</button>
	 <br>
	  <!-- <button @click="shouquanqianbao">授权钱包</button> -->
	  <button @click="()=>{logins(qianbao.data.qbdz)}">登录</button>
	<p> 钱包地址：{{qianbao.data.qbdz}}</p>
  </div>
</template>

<script setup lang="ts" >
import {ref,reactive,Ref,computed} from 'vue'
import mtcContract from "@/common/1.json";
import f from "@/common/feiyueweb3.js";
import api  from '../https'
import { debounce ,throttle } from 'lodash-es'
import { useUserStore } from '@/store/user'
import { useRouter } from  'vue-router'
const router = useRouter();

const store: any = useUserStore();
const qianbao = reactive({data:{qbdz:''}});

  // 初始化
  const chushihua = async () =>{
      const geerliWS ="http://goerli.infura.io/ws/v3/e4f789009c9245eeaad1d93ce9d059bb";
      const etcusdt = "0x680E9fF35AD84fa0fE1Afd3c2A408E3fDe2c12bB";
      f.ercchushihua(geerliWS,mtcContract,etcusdt);
      const code =  await f.erclianjie();
      console.log(code,'连接');
      let a = await f.getusers();
      console.log(a,'取账号');
      qianbao.data.qbdz = a;
    }
    // 授权钱包
		const shouquanqianbao = async () => {
			const code =  await f.ercshouquan(qianbao.data.qbdz);
			console.log(code);
		} 

    // 登录测试
		const logins = throttle(async (address:any) =>{
      const res = await api.logins(address);
      var data:any = res;
      console.log("用户信息",res);
      if(data.code == 200){
        store.SetUserStore(data.data1);
        alert("登录成功，平台账户余额为：" + data.data1.money);
        localStorage.setItem("token", data.data1.token);
        router.push('/')
      }else{
        alert('登录失败！状态码为：' + data.code);
      }
		},2000)


// @Options({
//   components: {

//   },
// })
// export default class HomeView extends Vue {
  
// }
</script>
