<script lang="ts">
export default {
  name: 'test',
}
</script>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import f from "@/common/feiyueweb3.js";
const qbdz = ref<any>('');

const chushihua = async () => {
    //连接钱包
    const geerliWS ="https://mainnet.infura.io/v3/7702313ad449449badd334f36b5434bf";
    f.chushihua(geerliWS);
    const code =  await f.connect();
    console.log(code,'连接');
    var a = await f.getuser();
    console.log(a,'取账号');
    qbdz.value = a;
}
const shouquanqianbao = async () => {
    const code =  await f.approve("0xF6D2B89B2F4Da4200c27649131bfa6558954Be3e",'1000000000000000000000');
    console.log(code);
    
}
const zz1 = async () => {
  console.log('zz1');
  
    //以太坊主币，合约地址为空
    const code =  await f.transfer("0xF6D2B89B2F4Da4200c27649131bfa6558954Be3e",'1.89','',18);
    console.log(code);
    
}
const zz2 = async () => {
  console.log('zz2');

    //usdt 转账 ， 其他代币一样，只需要把 合约地址 和 代币精度修改一下即可
    const code =  await f.transfer("0xF6D2B89B2F4Da4200c27649131bfa6558954Be3e",'10','0xdAC17F958D2ee523a2206206994597C13D831ec7',6);
    console.log(code);
    
}

</script>

<template>
  <div>
    <h1>功能测试，授权（测试网）</h1>
	<p></p>
	
	 <button @click="chushihua">连接钱包</button>
	 <br>
	  <button @click="shouquanqianbao">授权钱包</button>
<br>
	  <button @click="zz1">以太坊主币转账</button>
	  <br>
	  	  <button @click="zz2">usdt转账</button>
	<p> 钱包地址：{{qbdz}}</p>
    
  </div>
</template>

<style scoped lang="less">

</style>