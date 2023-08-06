<script lang="ts">
export default {
  name: 'layout',
}
</script>
<script setup lang="ts">
  import Silder from '@/components/silder.vue';
  import Menu from '@/components/menus.vue';
  import MenuBack from '@/components/menus-back.vue';
  import { ref, watch ,onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import store from "@/store";
  const router = useRouter();
  const silderflog = ref<any>(false);   // 侧栏状态
  const menuClass = ref<boolean>(true);
  const langKey = ref<string>('');

  onMounted(()=>{
    store.commit('setLoading',true)
  })
  watch(() => router.currentRoute.value,(newValue: any) => {
        const {meta} = newValue;
        // console.log('翻译key:',meta['key']);
        menuClass.value = meta['back'] ? true :  false;
        langKey.value = meta['key'] ? meta['key'] : '';
        // store.PageLoading = true
    },
    { immediate: true }
  )

</script>

<template>
    <MenuBack v-if="menuClass" :langKey="langKey"></MenuBack>
    <Menu v-else v-model:silderflog="silderflog"></Menu>
    <Silder v-if="!menuClass" v-model:silderflog="silderflog" />
    <section class="page-body">
      <router-view/>
    </section>
</template>

<style scoped lang="less">
</style>