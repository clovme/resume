<script setup lang="ts">
import ModuleTitle from '@/components/utils/ModuleTitle.vue'
import TitleContent from '@/components/utils/TitleContent.vue'
import { getStore } from '@/utils'
import { IEvaluation } from '@/store/interface/evaluation.ts'

defineProps<{
  title: string
}>()

const data = getStore<IEvaluation>('getEvaluation')
</script>

<template>
  <ModuleTitle :title="title">
    <TitleContent v-if="data.id" :content="data.content" :margin="0" />
  </ModuleTitle>
</template>

<style scoped lang="scss"></style>
