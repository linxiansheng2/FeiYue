<script lang="ts">
export default {
  name: 'index',
}
</script>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import $api  from '@/https';
const loading = ref<boolean>(false);
const Store:any = reactive({data:{
    data:[]
}})


// 获取公告数据
const getStore = async () => {
    let res = await $api.getBulletin(0);
    if(res && res['code'] == 200){
        Store.data.data = res.rows;
        console.log(res)
    }
    loading.value = true;

}
onMounted(()=>{
    getStore();
})
</script>

<template>
  <div class="page-main" v-if="loading">
    <div class="bulletin-list" v-if="Store.data.data.length">
        <van-cell class="bulletin-cell" v-for="(item,index) in Store.data.data" :key="item.id" :to="`/proclamation/articleDetails/${item.id}`">
        <template #title>
            <div class="bulletin-item" :data-id="item.id">
                <span class="order">{{ index+1 }}</span>
                <p class="title"><span>{{ item.title }}</span></p>
            </div>
        </template>
        </van-cell>        
    </div>
    <div class="bulletin-wrap" v-else>
        <van-empty description="No Announcement"></van-empty>
    </div>
  </div>
</template>

<style scoped lang="less">
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

/*多行文本溢出...*/
.multiEllipsis(@line:2) {
    overflow : hidden;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: @line;
    -webkit-box-orient: vertical;
  }
.page-main{
    padding: 15px;
    .bulletin-list{
        --van-cell-vertical-padding:15px;
        --van-cell-horizontal-padding:15px;
        .bulletin-cell{
            border-radius: 10px;
            margin-bottom: 15px;
            box-shadow: 0 2px 18px rgba(67,101,255,.06);
        }
        .bulletin-item{
            .flexMixin(center);
            .flexMixin(flex-strat);
            .order{
                width: 28px;
                height: 28px;
                background: #2850e7;
                border-radius: 50px;
                font-size: 16px;
                color: #fff;
                text-align: center;
                line-height: 28px;
            }
            .title{
                .multiEllipsis(1);
                -webkit-box-flex: 1;
                -webkit-flex: 1;
                flex: 1;
                margin-left: 17px;
                word-break: break-all;
                line-height: 150%;
            }
        }
    }
}
</style>