<script setup lang="ts">
import { ref } from 'vue'
import { ITitleContent } from '@/components/utils/interface/interface.ts'
import { getStore } from '@/utils'
import { ISetting } from '@/store/interface/setting.ts'

const setting = getStore<ISetting>('getSetting')

const props = withDefaults(defineProps<ITitleContent>(), {
  margin: 10,
})

const headerStyle = ref({
  marginTop: `${props.margin * 2}px`,
})

function isContent(content: string | undefined): boolean {
  if (content === undefined || content.trim().length <= 0) {
    return false
  }
  return content !== '<p><br></p>'
}
</script>

<template>
  <ul class="title-content-header" :style="headerStyle" v-if="name">
    <li v-if="startAt">
      {{ startAt }}<span v-if="toNow || endAt">~{{ toNow ? '至今' : endAt }}</span>
    </li>
    <li v-if="name"><b v-text="name"></b></li>
    <li v-if="title"><b v-text="title"></b></li>
  </ul>
  <div
    class="ql-editor"
    v-html="content"
    :style="`font-family: ${setting.fontFamily};font-size: ${setting.fontSize}px; margin-top: ${props.margin}px;line-height: ${setting.lines * setting.fontSize * 2}px`"
    v-if="isContent(content)"
  ></div>
</template>

<style scoped lang="scss"></style>
