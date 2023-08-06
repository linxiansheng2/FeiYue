<script lang="ts">
export default {
  name: 'trade',
}
</script>
<script setup lang="ts">
import { ref, reactive ,computed} from 'vue'
import {useStore,mapMutations,mapActions} from 'vuex'
const $store = useStore();
// console.log($store);
const active = ref<boolean>(true);

  const test = computed(()=>$store.state.loading)
  const onadd = () => {
    $store.commit('setLoading',false);
  }
</script>

<template>
  <div class="page-main">
    <div class="trade-tab" >
      <div class="trade-item" :class="{'active':active}" @click="active = true">Holding detail</div>
      <div class="trade-item" :class="{'active':!active}" @click="active = false">History detail</div>
    </div>
<button @click="onadd">ssssssssssssssssss</button>
    <div>{{ test }}</div>
    <Cus-Card marginTop="30">
      <div class="trade-list">
        <van-empty image-size="10rem" description="No record" />
      </div>
    </Cus-Card>
  </div>
</template>

<style scoped lang="less">
.page-main{
  padding-top: 20px;
}
.trade-tab{
  display: flex;
  flex: 0 0 50%;
  justify-content: center;
  padding: 0 25px;
  .trade-item{
    background: #fff;
    box-shadow: 0 3px 25px rgba(0,0,0,.1);
    border-radius: 5px;
    text-align: center;
    line-height: 44px;
    font-size: 17px;
    font-weight: 500;
    color: #3b3e4e;
    padding: 0 5px;
    height: 44px;
    width: 100%;
  }
  .trade-item.active{
    color: #fff;
    background: #2850E7;
  }
}
</style>