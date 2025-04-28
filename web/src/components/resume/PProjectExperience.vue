<script setup lang="ts">
import ModuleTitle from '@/components/utils/ModuleTitle.vue'
import { getStore } from '@/utils'
import { IProjectExperience } from '@/store/interface/project.ts'
import TitleContent from '@/components/utils/TitleContent.vue'

defineProps<{
  title: string
}>()

const datas = getStore<IProjectExperience[]>('getProject')
</script>

<template>
  <ModuleTitle :title="title">
    <TitleContent
      v-for="data in datas"
      :to-now="data.toNow"
      :content="data.content"
      :start-at="data.startAt"
      :end-at="data.endAt"
      :name="data.name"
      :title="data.title"
    />
  </ModuleTitle>
</template>

<style scoped lang="scss"></style>
