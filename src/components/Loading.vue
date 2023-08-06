<script lang="ts">
export default {
  name: 'Loading',
}
</script>
<script setup lang="ts">
</script>

<template>
    <div class="loading">
    <van-loading type="spinner" color="#1989fa" />
    </div>
</template>

<style scoped lang="less">
.loading {
    position: fixed;
    z-index: 9999;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>