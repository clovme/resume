<script setup lang="ts">
import { getStore, saveForm } from '@/utils'
import RichText from '@/components/utils/RichText.vue'
import CheckButton from '@/components/utils/CheckButton.vue'
import plus from '@/components/icon/plus.vue'
import form from '@/utils/form.ts'
import { ref, watch } from 'vue'
import { ElNotification } from 'element-plus'
import { ISkills } from '@/store/interface/skills.ts'
import { ITags } from '@/store/interface/Tags.ts'

let timer = 0
const customTag = ref('')
const data = getStore<ISkills>('getSkills')
const tags = getStore<ITags[]>('getSkillsTags')

// 监听 tags 属性的变化
watch(tags.value, (newValue) => {
  for (const sTag of newValue) {
    if (sTag.isChecked) {
      if (!data.value.checkedTags[sTag.name]) {
        data.value.checkedTags[sTag.name] = { level: 50, isWord: true }
      }
    }
    for (const tag of Object.keys(data.value.checkedTags)) {
      if (tag === sTag.name && !sTag.isChecked) {
        sTag.isChecked = false
        delete data.value.checkedTags[tag]
      }
    }
  }
})

watch(data.value, (newValue) => {
  clearTimeout(timer)
  timer = setTimeout(function () {
    saveForm('/skills', [
      {
        ...newValue,
        tagsName: Object.keys(data.value.checkedTags),
      },
    ])
    clearTimeout(timer)
  }, 1000)
})

function addCustomTag() {
  if (!customTag.value || customTag.value.trim() === '') {
    ElNotification({
      title: '提示信息',
      message: '自定义特长不能为空。',
      type: 'warning',
    })
    return
  }
  data.value.checkedTags[customTag.value] = { level: 50, isWord: true }
  customTag.value = ''
}

function removeCustomTag(tag: string) {
  for (const t of tags.value) {
    if (t.name == tag) {
      t.isChecked = false
    }
  }
  delete data.value.checkedTags[tag]
}
</script>

<template>
  <div>
    <el-row class="split-row-2">
      <el-col :span="24">
        <div class="split-2">
          <RichText placeholder="技能特长文字描述" v-model="data.content" />
        </div>
      </el-col>
      <el-col :span="24">
        <div class="split-2">
          <CheckButton
            class="el-c-button"
            v-for="item in tags"
            v-model="item.isChecked"
            :title="item.name"
            :key="item.id"
          />
        </div>
      </el-col>
      <el-col :span="8">
        <div class="split-2">
          <el-input
            v-model="customTag"
            @keyup.enter="addCustomTag"
            placeholder="请输入自定义特长"
            clearable
          />
          <el-button
            class="el-c-button"
            :icon="plus"
            plain
            @click="addCustomTag"
            >添加自定义特长</el-button
          >
        </div>
      </el-col>
    </el-row>
    <el-row
      class="skills-expertise-row"
      v-if="data.checkedTags && Object.keys(data.checkedTags).length > 0"
    >
      <el-col :span="4" v-for="key in Object.keys(data.checkedTags)">
        <b>{{ key }}</b>
        <div class="skills-expertise-row-class">
          <el-select v-model="data.checkedTags[key].level">
            <el-option
              v-for="item in form.ProficiencyLevel"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select v-model="data.checkedTags[key].isWord">
            <el-option
              v-for="item in form.isWord"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <i class="icon-circle-with-minus" @click="removeCustomTag(key)" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.skills-expertise-row {
  margin-top: 5px;
  margin-left: 5px !important;
  margin-right: 5px !important;
  gap: 15px !important;

  .el-col {
    gap: 0 !important;
    display: flex;
    flex-direction: column !important;
    align-items: flex-start !important;

    .skills-expertise-row-class {
      width: 100%;
      gap: 3px;
      display: flex;
      align-items: center;

      i {
        color: red;
        opacity: 0.6;
        font-size: 18px;
        transition: 0.3s;

        &:hover {
          opacity: 1;
        }
      }
    }
  }
}
</style>
