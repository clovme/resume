<script setup lang="ts">
import ModuleTitle from '@/components/utils/ModuleTitle.vue'
import { getStore } from '@/utils'
import {
  IApplicationInfo,
  ICourseGrade,
} from '@/store/interface/applicationinfo.ts'
import { ref, watch } from 'vue'

defineProps<{
  title: string
}>()

const baokaoListStyle = ref({
  fontSize: '14px',
  padding: '0 0 10px 0',
})

const data = getStore<IApplicationInfo>('getApplicationInfo')
const courseGrade = getStore<ICourseGrade[]>('getCourseGrade')

if (!courseGrade.value || courseGrade.value.length <= 0) {
  baokaoListStyle.value.padding = '0'
}

watch(courseGrade.value, (newValue) => {
  baokaoListStyle.value.padding = newValue.length <= 0 ? '0' : '0 0 10px 0'
})

watch(data.value, (newValue) => {
  baokaoListStyle.value.padding =
    newValue.name || newValue.major ? '0' : '0 0 10px 0'
})
</script>

<template>
  <ModuleTitle :title="title">
    <ul
      v-if="data.name || data.major || courseGrade.length > 0"
      class="baokao-list"
      :style="baokaoListStyle"
    >
      <li>报考院校：{{ data.name }}</li>
      <li>报考专业：{{ data.major }}</li>
    </ul>
    <table class="baokao-table" v-if="courseGrade.length > 0">
      <tr>
        <td rowspan="2">{{ data.cname }}</td>
        <td v-for="item in courseGrade" :key="item.id">{{ item.name }}</td>
      </tr>
      <tr>
        <td v-for="item in courseGrade" :key="item.id">{{ item.score }}</td>
      </tr>
    </table>
  </ModuleTitle>
</template>

<style scoped lang="scss"></style>
