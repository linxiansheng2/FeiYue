<script lang="ts">
export default {
  name: 'cuscard',
}
</script>
<script setup lang="ts">

interface ChildProps {
  marginTop?: string;
  padding?:string;
  useBottom?: boolean;
}

withDefaults(defineProps<ChildProps>(), {
  marginTop : '0',
  padding : '0',
  useBottom : false
})

</script>

<template>
    <section class="cus-card-wrap" :style="{'margin-top':`${marginTop}px`}" :class="{'bottom':useBottom}">
      <div class="layout" :style="{'padding':`${padding}px`}">
        <slot></slot>
      </div>
    </section>
</template>

<style scoped lang="less">
.cus-card-wrap{
  padding: 0 15px 15px;
  .layout{
    background: #fff;
    border-radius: 10px;
  }
}
.bottom{
  margin-bottom: 15px;
}
</style>