<script lang="ts">
export default {
  name: 'NotFound',
}
</script>
<script setup lang="ts">
import { getAssetURL } from '@/common/load_asset'

</script>

<template>
  <div class="page-body">
    <div class="layout">
      <img class="imgundefind" :src="getAssetURL('assetcenter/404img.jpg')" alt="">
        <van-button type="primary" to="/" color="#4B3F8B" plain >Go to Home Page</van-button>
    </div>
  </div>
</template>

<style scoped lang="less">
.page-body{
  height: 100vh;
  width: 100%;
  position: relative;
  background: #fff;
  .layout{
    text-align: center;
    position: relative;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
  }
}
.imgundefind{
  width: 100%;
}
</style>