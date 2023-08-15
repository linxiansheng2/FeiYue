<script lang="ts">
export default {
  name: 'index',
}
</script>
<script setup lang="ts">
import { ref, reactive ,onMounted} from 'vue'
import $api  from '@/https';
import { useI18n } from 'vue-i18n'
const { locale , t } = useI18n();
const loading = ref<boolean>(false);
const Store:any = reactive({data:{
    finished:false,     //是否已加载完成，加载完成后不再触发 load 事件
    pageNum:1,          //当前页数
    pageSize:10,        //单页最大值
    bulletinList:[]
}})
//获取
const onLoad = async () => {
    let res:any,total:any;
    res = await $api.getactivity(0);
    // console.log(res);
    
    if(res && res['code'] == 200){
        Store.data.bulletinList.push(...res.rows);
        // 加载状态结束
        Store.data.loading = false;
        total = parseInt(String((res['total'] + Store.data.pageSize -1 ) / Store.data.pageSize));
        if(Store.data.pageNum == total){
            // 数据全部加载完成
            Store.data.finished = true;
        }else{
            Store.data.pageNum+=1;
        }
        loading.value = true;
    }
}
</script>

<template>
    <div class="page-main" >
    <div class="bulletin-list">
        <van-list
            v-model:loading="Store.data.loading"
            :finished="Store.data.finished"
            :finished-text="$t('mining_faq.mining_faq1')"
            @load="onLoad"
            >
            <van-cell class="bulletin-cell" v-for="item in Store.data.bulletinList" :key="item.id" :to="`/officialActivity/detaile/${item.id}`">
              
            <template #title>
              <div><img class="sbcxkaaa" :src=item.img alt=""></div>
                <div class="bulletin-item" :data-id="item.id">
                    <!-- <span class="order">{{ index+1 }}</span> -->
                    <p class="title"><span>{{ item.title }}</span></p>
                    <!-- <img :src=item.img alt=""> -->
                </div>
            </template>
            </van-cell>  
        </van-list>
    </div>
    <!-- <div class="bulletin-wrap" v-else>
        <van-empty description="No Announcement"></van-empty>
    </div> -->
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
.sbcxkaaa{
  width: 100%;
  height: 154px;

}
</style>