<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElNotification } from 'element-plus'
import { ITabsLabel } from '@/components/utils/interface/interface.ts'
import axios from '@/utils/axios.ts'

const props = defineProps<ITabsLabel>()

const isChecked = ref(props.modelValue)
const tabsLabelTitleStyle = ref({
  color: '',
})

// 事件发射器
const emit = defineEmits(['update:modelValue', 'tab-click', 'tab-sore', 'edit'])

// 当 props.modelValue 发生变化时，更新 isChecked
watch(
  () => props.modelValue,
  (newVal) => {
    tabsLabelTitleStyle.value.color = !newVal ? '#a8abb2' : ''
    isChecked.value = newVal
  },
)

// 更新值时改变样式并发射事件
function updateValue() {
  emit('update:modelValue', isChecked.value)
  axios.put('/menus/switch/status', {
    id: props.id,
    isChecked: isChecked.value,
  })
}

// 切换标签点击事件
function onTabClick() {
  if (!isChecked.value) {
    ElNotification({
      title: '这是隐藏模块',
      message: '启用请点击标题上的灰色开关。',
      type: 'warning',
    })
  } else {
    emit('tab-click')
  }
}

/**
 * 向前或向后排序
 * @param flag 向前/向后
 */
function onTabSore(flag: boolean) {
  emit('tab-sore', props.index, flag)
}

function onClickModuleName(title: string) {
  emit('edit', title, props.id)
}
</script>

<template>
  <div class="custom-tabs-label">
    <div class="tabs-label-switch" v-if="props.option">
      <div class="tabs-label-switch-lr">
        <i
          class="icon-sliderleft"
          v-show="isChecked"
          @click="onTabSore(true)"
        />
      </div>
      <div class="tabs-label-switch-c">
        <el-switch
          size="small"
          v-model="isChecked"
          style="--el-switch-on-color: #13ce66"
          @input="updateValue"
        />
      </div>
      <div class="tabs-label-switch-lr">
        <i
          class="icon-sliderright"
          v-show="isChecked"
          @click="onTabSore(false)"
        />
      </div>
    </div>
    <div class="tabs-label-switch" v-else></div>
    <div class="tabs-label-bottom">
      <b
        class="tabs-label-title"
        @click="onTabClick"
        :style="tabsLabelTitleStyle"
        v-text="props.title"
      />
      <div class="tabs-label-edit">
        <i
          @click="onClickModuleName(props.title)"
          class="icon-edit"
          v-show="isChecked && props.option"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$el-switch-on-color: #13ce66;

.custom-tabs-label {
  height: 50px;
  width: 100%;
  display: flex;
  flex-direction: column;

  .tabs-label-switch {
    display: flex;
    align-items: center;
    justify-content: space-between;
    opacity: 0.6;
    height: 22px;

    .tabs-label-switch-lr {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: $el-switch-on-color;
      opacity: 0.6;
      transition: 0.3s;

      i {
        transition: 0.3s;
        display: none;
      }

      &:hover {
        opacity: 1;
      }

      &:last-child {
        text-align: right;
      }
    }

    .tabs-label-switch-c {
      flex: 1;
      display: flex;
      justify-content: center;

      :deep(.el-switch--small) {
        width: 16px;
        transition: 0.3s;

        .el-switch__core {
          min-width: 16px;
          transition: 0.3s;

          .el-switch__action {
            background-color: #dcdfe6;
            transition: 0.3s;
          }
        }

        &.is-checked {
          .el-switch__action {
            background-color: $el-switch-on-color;
          }
        }
      }
    }
  }

  .tabs-label-bottom {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3px;
    width: 100%;
    padding-top: 5px;
    position: relative;

    .tabs-label-title {
      font-size: 15px;
    }

    .tabs-label-edit {
      width: 15px;
      position: absolute;
      right: 0;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      font-size: 14px;
      color: $el-switch-on-color;
      opacity: 0.6;
      transition: opacity 0.3s;

      i {
        transition: 0.3s;
        display: none;
      }

      &:hover {
        opacity: 1;
      }
    }
  }
}
</style>
