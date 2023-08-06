<script lang="ts">
export default {
  name: 'cusswiper',
}
</script>
<script setup lang="ts">
defineProps<{
     childstore : any[],
     height ? : string,
     time ? : number
    }>();
</script>

<template>
    <section class="banner-wrap">
        <div class="banner-box" :style="{'height': height ? `${height}px`: '125px'}">
            <van-swipe :autoplay=" height ? height: 3000" :show-indicators="false" >
            <van-swipe-item v-for="item in childstore" :key="item['id']">
                <img :src="item['img']" />
            </van-swipe-item>
            </van-swipe>
        </div>
    </section>
</template>

<style scoped lang="less">
.banner-wrap{
  position: relative;
  overflow: hidden;
  margin: 15px 0;
  .banner-box{
    .van-swipe-item{
        border-radius: 15px;
        overflow: hidden;
        height: 100%;
      img{
        height: 100%;
      }
    }
  }
  img{
    width: 100%;
  }
}
</style>