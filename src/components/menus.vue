<script lang="ts">
export default {
  name: 'menus',
}
</script>
<script setup lang="ts">
import { ref, reactive ,computed,onMounted} from 'vue'
import { useRouter} from 'vue-router';
import mtcContract from "@/common/1.json";
import f from "@/common/feiyueweb3.js";
import api  from '../https';
import {useStore} from 'vuex'
import { showToast } from 'vant';
const $store = useStore();
let props = defineProps(["silderflog"]);
let $emit = defineEmits(["update:silderflog"]);

const userStore = computed(()=>$store.state.userinfo);
const loginStore = computed(()=>$store.state.login);


//侧栏回调
const onChange = () => {
    $emit("update:silderflog",!props.silderflog);
    // let navbox = document.querySelector('#nav-wrap');
    // console.log(navbox);
}

// 初始化
const chushihua = async (ev:Event) =>{
    console.log(loginStore.value);
    
    if(loginStore.value){
        return
    }else{
        const geerliWS ="http://goerli.infura.io/ws/v3/e4f789009c9245eeaad1d93ce9d059bb";
        const etcusdt = "0x680E9fF35AD84fa0fE1Afd3c2A408E3fDe2c12bB";
        f.ercchushihua(geerliWS,mtcContract,etcusdt);
        const code =  await f.erclianjie();
        let response = await f.getusers();
        sessionStorage.setItem('etcusdt',etcusdt);
        logins(response);
    }

}
    // 登录
const logins = async (address:any) =>{
    const res = await api.logins(address);
    if(res && res['code'] == 200){
        showToast(`success Money:${res.data1.money}`)
        sessionStorage.setItem("token", res.data1.token);
        $store.commit('setUserInfo',res.data1);
        $store.commit('setLogin',true);
    }else{
        showToast(`failed code:${res.code}`)
    }
}

</script>

<template>
  <div>
    <div class="nav-box">
        <div class="nav-left">
            <img class="nav-ico" src="../assets/silder/nav-ico.png" @click="onChange" />
            <img class="logo" src="../assets/silder/logo-bot.png"/>
        </div>
        <div class="nav-right" @click="chushihua">
            <img class="nav-address" src="../assets/silder/address.png"/>
            <span class="nav-addre-txt"><van-text-ellipsis :content="userStore['address']?userStore['address']:'Connect'" /></span>
        </div>
    </div>
  </div>
</template>

<style scoped lang="less">
@themeBgColor:#fff;
.menuFontStyle(){
    color: #4d4d4d;
    font-size: 16px;
    font-weight: 600;
}
.multiEllipsis(@line:2) {
    overflow : hidden;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: @line;
    -webkit-box-orient: vertical;
}
.flex-dom(@justify){
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
.nav-box{
    background-color: @themeBgColor;
    height: 60px;
    .flex-dom(space-between);
    box-shadow: 0 4px 4px rgba(97,6,243,.04);
    padding: 0 16px;
    .nav-left{
        height: 40px;
        .flex-dom(space-between);
        gap: 8px;
        .logo{
            min-width: 110px;
            height: 24px;
            -webkit-animation: scalelogo 1.5s 0s ease both infinite;
            -moz-animation: scalelogo 1.5s 0s ease both infinite;
        }
    }
    .nav-right{
        width: 114px;
        height: 39px;
        border-radius: 6px;
        color: #fff;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        background: -webkit-linear-gradient(right,#607cff,#4570fe);
        background: linear-gradient(270deg,#607cff,#4570fe);
        border-radius: 8px;
        .flex-dom(center);
        .nav-addre-txt{
            width: 65px;
            padding-left: 5px;
            font-size: 15px;
            .multiEllipsis(1)
        }
    }
}
</style>