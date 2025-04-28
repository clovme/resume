<script setup lang="ts">
import { CSSProperties, ref } from 'vue'
import { ILineBox } from '@/components/utils/interface/interface.ts'
import VLineBox from '@/components/utils/options/linebox.ts'

const props = withDefaults(defineProps<ILineBox>(), {
  size: '1',
  margin: '0',
  lineStyle: 'solid',
  color: VLineBox.color,
  position: 'bottom',
})

const mp = VLineBox.margin(props)

const lineBoxStyle = ref<CSSProperties>({
  [`border-${props.position}`]: `${props.size}px ${props.lineStyle} ${props.color}`,
  margin: mp.margin,
  padding: mp.padding,
  position: 'relative',
})
</script>

<template>
  <div :style="lineBoxStyle">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss"></style>
