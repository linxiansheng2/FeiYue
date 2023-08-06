<script lang="ts">
export default {
  name: 'menus-back',
}
</script>
<script setup lang="ts">
  defineProps<{ langKey ? : string }>();
  const onClickLeft = () => history.back();
</script>

<template>
    <van-nav-bar :title="langKey ? $t(langKey) : ''" left-arrow @click-left="onClickLeft"/>
</template>

<style scoped lang="less">
</style>