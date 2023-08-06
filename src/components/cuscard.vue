<script lang="ts">
export default {
  name: 'cuscard',
}
</script>
<script setup lang="ts">

interface ChildProps {
  marginTop?: string;
  padding?:string;
}

withDefaults(defineProps<ChildProps>(), {
  marginTop : '0',
  padding : '0'
})

</script>

<template>
  <div>
    <section class="cus-card-wrap" :style="{'margin-top':`${marginTop}px`}">
        <div class="layout" :style="{'padding':`${padding}px`}">
          <slot></slot>
        </div>
      </section>
  </div>
</template>

<style scoped lang="less">
.cus-card-wrap{
  padding: 0 15px 15px;
  .layout{
    background: #fff;
    border-radius: 10px;
  }
}
</style>