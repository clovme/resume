<script setup lang="ts">
import RichText from '@/components/utils/RichText.vue'
import { getStore, saveForm } from '@/utils'
import { IIntentions } from '@/store/interface/intentions.ts'
import { watch } from 'vue'

let timer = 0
const data = getStore<IIntentions>('getIntentions')

watch(data.value, (newValue) => {
  clearTimeout(timer)

  timer = setTimeout(function () {
    saveForm('/intentions', [newValue])
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
              placeholder="请输入您的自定义内容"
            />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
