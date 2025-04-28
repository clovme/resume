<script setup lang="ts">
import ModuleTitle from '@/components/utils/ModuleTitle.vue'
import TitleContent from '@/components/utils/TitleContent.vue'
import { getStore } from '@/utils'
import { IEducation } from '@/store/interface/education.ts'

defineProps<{
  title: string
}>()

const datas = getStore<IEducation[]>('getEducation')

function degree(data: string) {
  if (data === '不填' || data.length <= 0) {
    return ''
  }
  return `(${data})`
}
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
      :title="`${data.major}${degree(data.degree)}`"
      :key="data.id"
    />
  </ModuleTitle>
</template>

<style scoped lang="scss"></style>
