<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios'

let icons = ref<string[]>([])

let dialog = ref(false)
let dialogIcon = ref('icon-remen')
let copyStatus = ref('')

onMounted(async () => {
  const response = await axios.get('http://localhost:8080/api/icon')
  for (const item of response.data.split('\n')) {
    const regex = /\$icon-([a-zA-Z0-9-]+):/
    const match = item.match(regex)
    if (match) {
      const iconName = match[1]
      icons.value.push(`icon-${iconName}`)
    }
  }
})

async function copyTextToClipboard(icon: string) {
  try {
    await navigator.clipboard.writeText(`<i class="${icon}" />`)
    copyStatus.value = '已复制'
  } catch (err) {
    copyStatus.value = '复制失败'
  }
  const timer = setTimeout(function () {
    copyStatus.value = ''
    clearTimeout(timer)
  }, 2000)
}

function iconsBoxStatus() {
  if (dialog.value) {
    dialog.value = false
    dialogIcon.value = 'icon-remen'
  } else {
    dialog.value = true
    dialogIcon.value = 'icon-cha'
  }
}
</script>

<template>
  <div>
    <div class="icons-box-click" @click="iconsBoxStatus">
      <i :class="dialogIcon"></i>
    </div>

    <div class="icons-dialog" v-show="dialog">
      <ul class="icons-box">
        <li
          class="icons-box-item"
          v-for="icon in icons"
          @click="copyTextToClipboard(icon)"
        >
          <i :class="`${icon}`"></i>
        </li>
        <li class="icons-box-item">{{ copyStatus }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
$wh: 75px;

.icons-box-click:hover {
  color: var(--el-button-hover-text-color);
  border-color: var(--el-button-hover-border-color);
  background-color: var(--el-button-hover-bg-color);
  outline: none;
}

.icons-box-click {
  position: fixed;
  bottom: 50px;
  right: 10px;
  width: 50px;
  height: 50px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  color: #606266;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  transition: 0.1s;
  font-weight: 500;
  user-select: none;
  vertical-align: middle;
  background-color: #ffffff;
  border: 1px solid #dcdfe6;
  font-size: 14px;
  border-radius: 100%;
}

.icons-dialog {
  position: fixed;
  top: calc(50% - 342px);
  left: calc(50% - 342px);
  border: 1px solid #e4e7ed;
  background-color: #303133;
  border-radius: 4px;
  overflow: hidden;
  transition: 0.3s;
  box-shadow:
    0 12px 32px 4px rgba(0, 0, 0, 0.04),
    0 8px 20px rgba(0, 0, 0, 0.08);
  padding: 10px;

  .icons-box {
    list-style: none;
    padding: 0 !important;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    border-left: 1px solid #dcdfe6;

    .icons-box-item:nth-child(-n + 7) {
      border-top: 1px solid #dcdfe6;
    }

    .icons-box-item:hover {
      background-color: #f2f6fc;
    }

    .icons-box-item {
      width: $wh;
      height: $wh;
      display: flex;
      color: #a2a4aa;
      font-size: 13px;
      border-right: 1px solid #dcdfe6;
      border-bottom: 1px solid #dcdfe6;
      transition: background-color 0.3s;
      justify-content: center;
      align-items: center;

      i {
        font-size: 40px;
        height: 1em;
        width: 1em;
        line-height: 1em;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        position: relative;
        fill: currentColor;
      }
    }
  }
}
</style>
