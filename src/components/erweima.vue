<script lang="ts">
export default {
  name: "erweima",
};
</script>
<script setup lang="ts">
import { Options } from "qrcode";
import { ref, onMounted,computed } from "vue";
import QRCode from "qrcode";
import { useStore } from "vuex";

const $store = useStore();
const userStore = computed(() => $store.state.userinfo);
console.log(userStore, "sbcxk", userStore.value.address);
const qrcodeData = ref<string | null>(null);
onMounted(async () => {
  const url = "https://www1.feiyueadmin.com/#/"+userStore.value.id;
  console.log(url,'sb');
  
  const options: any = {
    width: 200,
    height: 200,
  };

  try {
    const dataUrl = await QRCode.toDataURL(url, options);
    qrcodeData.value = dataUrl;
  } catch (error) {
    console.error(error);
  }
});
</script>

<template>
  <div>
    <!-- <h1>生成二维码</h1> -->
    <div v-if="qrcodeData">
      <img :src="qrcodeData" alt="二维码" />
    </div>
    <!-- <div v-else>
      <p>请等待二维码生成...</p>
    </div> -->
  </div>
  
</template>

<style scoped lang="less">

</style>