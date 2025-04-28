<script setup lang="ts">
import { getStore, saveForm } from '@/utils'
import RichText from '@/components/utils/RichText.vue'
import CheckButton from '@/components/utils/CheckButton.vue'
import plus from '@/components/icon/plus.vue'
import { ref, watch } from 'vue'
import { ElNotification } from 'element-plus'
import { ITags } from '@/store/interface/Tags.ts'
import { IHonors } from '@/store/interface/honors.ts'

let timer = 0
const customTag = ref('')
const tags = getStore<ITags[]>('getHobbiesTags')
const data = getStore<IHonors>('getHobbies')

// 监听 tags 属性的变化
watch(tags.value, (newValue) => {
  for (const sTag of newValue) {
    if (sTag.isChecked) {
      data.value.checkedTags[sTag.name] = true
    }
    for (const tag of Object.keys(data.value.checkedTags)) {
      if (tag === sTag.name && !sTag.isChecked) {
        delete data.value.checkedTags[tag]
      }
    }
  }
})

watch(data.value, (newValue) => {
  clearTimeout(timer)
  timer = setTimeout(function () {
    saveForm('/hobbies', [
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
      message: '自定义名称不能为空。',
      type: 'warning',
    })
    return
  }
  data.value.checkedTags[customTag.value] = true
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
          <RichText
            placeholder="兴趣爱好内容描述，非必填。"
            v-model="data.content"
          />
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
            placeholder="请输入自定义名称"
            clearable
          />
          <el-button
            class="el-c-button"
            :icon="plus"
            plain
            @click="addCustomTag"
            >添加自定义兴趣爱好</el-button
          >
        </div>
      </el-col>
    </el-row>
    <el-row v-if="data.checkedTags && Object.keys(data.checkedTags).length > 0">
      <el-col :span="24">
        <ul class="f-honorsc-ertificates-box split-2">
          <li v-for="key in Object.keys(data.checkedTags)">
            {{ key }}
            <i class="icon-circle-with-minus" @click="removeCustomTag(key)" />
          </li>
        </ul>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.f-honorsc-ertificates-box {
  list-style: none;

  li {
    float: left;
    padding: 0 10px;
    height: 28px;
    line-height: 27px;
    margin-right: 30px;
    border-radius: 16px;
    color: #222;
    border: 1px solid #13d8a7;
    position: relative;
    margin-top: 10px;

    i {
      position: absolute;
      right: -20px;
      top: -2px;
      font-size: 18px;
      line-height: 32px;
      vertical-align: top;
      margin-left: 6px;
      color: red;
      opacity: 0.6;
      cursor: pointer;

      &:hover {
        opacity: 1;
      }
    }
  }
}
</style>
