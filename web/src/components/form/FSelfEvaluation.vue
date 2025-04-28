<script setup lang="ts">
import RichText from '@/components/utils/RichText.vue'
import { getStore, saveForm } from '@/utils'
import { IEvaluation } from '@/store/interface/evaluation.ts'
import { watch } from 'vue'

let timer = 0
const data = getStore<IEvaluation>('getEvaluation')

watch(data.value, (newValue) => {
  clearTimeout(timer)

  timer = setTimeout(function () {
    saveForm('/evaluation', [newValue])
    clearTimeout(timer)
  }, 1000)
})
</script>

<template>
  <div>
    <div class="split-row-module">
      <el-row class="split-row-1">
        <el-col>
          <div class="split-1">
            <RichText
              v-model="data.content"
              placeholder="所修课程、成绩排名、在校的职务、参赛获奖情况等有利于突出个人优势的信息。尽量简洁，突出重点。"
            />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
