<script lang="ts">
export default {
  name: 'cusfooter',
}
</script>
<script setup lang="ts">
import { ref, reactive } from 'vue'

</script>

<template>
  <div>
    <div class="footer">
     <div class="copyright">CopyRight@2023 All Rights Reserved</div>
    </div>
  </div>
</template>

<style scoped lang="less">
.footer{
  .copyright{
    height: 45px;
    width: 100%;
    text-align: center;
    font-weight: 400;
    font-size: 14px;
    line-height: 150%;
    text-align: center;
    color: #666;
    line-height: 45px;
    border-top: 1px solid #e0e0e0;
    margin-top: 25px;
    background: #fff;
  }
}
</style>