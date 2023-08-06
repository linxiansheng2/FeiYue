<script lang="ts">
export default {
  name: 'gundong',
}
</script>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import api from "../../https";
const gundongshuju=async()=>{
    // const cxk:any=await api.getshouyia()
}
const items=reactive<any>({data:[
    { id: 1, text: 'Item 1' },
        { id: 2, text: 'Item 2' },
        { id: 3, text: 'Item 3' },
        // 添加更多列表项...
]})
</script>

<template>
<div class="list-container">
    <div class="list-wrapper">
      <div class="scroll-list">
        <div v-for="item in items.data" :key="item.id" class="list-item">
          {{ item.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.list-container {
  overflow: hidden;
  width: 100%;
}

.list-wrapper {
  display: inline-block;
  white-space: nowrap;
  animation: scroll-list 10s linear infinite;
}

.scroll-list {
  display: inline-block;
}

@keyframes scroll-list {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-100%);
  }
}

.list-item {
  display: inline-block;
  padding: 10px;
  /* 添加适当的样式 */
}
</style>