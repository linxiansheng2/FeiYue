<script lang="ts">
export default {
  name: 'ListScroll',
}
</script>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
interface ListItem {
  id: number;
  title: string;
  value: string;
}
// 使用组合式API定义组件
const list = ref<ListItem[]>([]);
const finished = ref(false);
const loading = ref(false);
// 模拟异步加载数据
function loadMore() {
  // 模拟网络请求延时
  setTimeout(() => {
    for (let i = 0; i < 10; i++) {
      list.value.push({
        id: list.value.length + 1,
        title: `dfsfdsfsfsfsfsfsf ${list.value.length + 1}`,
        value: `${list.value.length + 1+'ETH'}`,
      });
    }
    if (list.value.length >=30) {
      finished.value = true;
    }

    loading.value = false;
  }, 500);
}
// 初始化时加载数据
onMounted(()=>{
    loadMore()
})
</script>

<template>
  <div>
    <van-list
    v-show="list.length"
    :finished="finished"
    finished-text="没有更多了"
    :loading="loading"
    @load="loadMore"
  >
    <van-cell
      v-for="item in list"
      :key="item.id"
      :title="item.title"
      :value="item.value"
    />
  </van-list>
  </div>
</template>

<style scoped>

</style>