<script setup lang="ts">
import LineBox from '@/components/utils/LineBox.vue'
import { getStore } from '@/utils'
import { ISetting } from '@/store/interface/setting.ts'

defineProps<{
  title: string
}>()

const setting = getStore<ISetting>('getSetting')
</script>

<template>
  <div class="resume-content">
    <div class="module-title">
      <span>{{ title }}</span>
      <div class="title-icon"></div>
    </div>
    <LineBox color="#4e7282" margin="0" />
    <div
      class="resume-content-main"
      :style="`padding: ${setting.module}px 15px;`"
    >
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
