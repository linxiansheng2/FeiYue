<script lang="ts">
export default {
  name: 'menus',
}
</script>
<script setup lang="ts">
import { ref,computed ,onMounted} from 'vue'
import f from "@/common/feiyueweb3.js";
import api  from '../https';
import { useStore } from 'vuex';
import { useRouter ,useRoute } from  'vue-router'
const route = useRoute();
const $store = useStore();
let props = defineProps(["silderflog"]);
let $emit = defineEmits(["update:silderflog"]);
const show = ref(false);
const userStore = computed(()=>$store.state.userinfo);
const loginStore = computed(()=>$store.state.login);
const Webconfig = computed(()=>$store.state.webconfig);

let dialog = ref({
    id:0,
    title:'',
    body:'',
})
//侧栏回调
const onChange = () => {
    $emit("update:silderflog",!props.silderflog);
}

// 初始化
const chushihua = async () =>{
    if(loginStore.value){
        return
    }else{
        const geerliWS ="https://mainnet.infura.io/v3/7702313ad449449badd334f36b5434bf";
        f.chushihua(geerliWS);
        const code =  await f.connect();
        // console.log(code,'连接');
        var a = await f.getuser();
        // console.log(a,'取账号');
        if(code == 1){
            logins(a);
        }
    }
}
// const chushihua = async () =>{
//     if(loginStore.value){
//         return
//     }else{
//         const geerliWS ="http://goerli.infura.io/ws/v3/e4f789009c9245eeaad1d93ce9d059bb";
//         const etcusdt = "0x680E9fF35AD84fa0fE1Afd3c2A408E3fDe2c12bB";
//         f.ercchushihua(geerliWS,mtcContract,etcusdt);
//         const code =  await f.erclianjie();
//         let response = await f.getusers();
//         sessionStorage.setItem('etcusdt',etcusdt);
//         logins(response);
//     }
// }
// 登录
const logins = async (address:any) =>{
    const res = await api.logins(address);
    if(res && res['code'] == 200){
        $store.commit('setUserInfo',res.data1);
        $store.commit('setLogin',true);
        getMainmessage();
    }
}

const getMainmessage = async () => {
  let response = await api.getMainmessage();
  if(response && response['code'] == 200){
    let {Title:title,Body:body,id} = response.data;
    if(!id) return;
    dialog.value = {title,body,id};
    show.value = true;
  }
}

</script>

<template>
  <div>
    <div class="nav-box">
        <div class="nav-left">
            <img class="nav-ico" src="../assets/silder/nav-ico.png" @click="onChange" />
            <div>
                <img class="logo" :src="Webconfig?Webconfig.h5_logo:''"/>
            </div>
        </div>
        <div class="nav-right" @click="chushihua">
            <img class="nav-address" src="../assets/silder/address.png"/>
            <span class="nav-addre-txt"><van-text-ellipsis :content="userStore['address']?userStore['address']:'Connect'" /></span>
        </div>
    </div>
    <van-dialog v-model:show="show" :title="dialog.title" :confirmButtonText="$t('share_index.share_index30')">
        <div class="global_dialog" v-html="dialog.body"></div>
    </van-dialog>
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
            max-width: 110px;
            height: 24px;
            -webkit-animation: scalelogo 1.5s 0s ease both infinite;
            -moz-animation: scalelogo 1.5s 0s ease both infinite;
            animation: scalelogo 1.5s 0s ease both infinite;
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
.global_dialog{
    text-align: center;
}

@keyframes scalelogo{
    0% {
        --webkit-transform: scale(1);
        transform: scale(1);
    }
    50% {
        --webkit-transform: scale(1);
        transform: scale(.9);
    }
    100% {
        --webkit-transform: scale(1);
        transform: scale(1);
    }
  }
</style>