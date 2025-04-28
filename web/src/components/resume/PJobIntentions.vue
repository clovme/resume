<script setup lang="ts">
import ModuleTitle from '@/components/utils/ModuleTitle.vue'
import TitleContent from '@/components/utils/TitleContent.vue'
import { getStore } from '@/utils'
import { IIntentions } from '@/store/interface/intentions.ts'

defineProps<{
  title: string
}>()

const data = getStore<IIntentions>('getIntentions')
</script>

<template>
  <ModuleTitle :title="title">
    <TitleContent :content="data.content" :margin="0" />
  </ModuleTitle>
</template>

<style scoped lang="scss"></style>
