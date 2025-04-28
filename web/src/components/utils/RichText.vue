<script setup lang="ts">
import { onMounted, watch } from 'vue'
import Quill from 'quill'
import { IRichText } from '@/components/utils/interface/interface.ts'
import { uuid } from '@/components/utils/options/richtext.ts'

const props = withDefaults(defineProps<IRichText>(), {
  id: uuid,
  height: '150px',
  placeholder: '输入你的自定义内容',
})
const emit = defineEmits(['update:modelValue'])

onMounted(() => {
  const quill = new Quill(`#${props.id}`, {
    modules: {
      toolbar: {
        container: [
          [{ size: [false, 'large', 'huge'] }],
          [{ color: [] }, 'bold', 'italic', 'underline', 'link', 'image'],
          [{ list: 'ordered' }, { list: 'bullet' }, { align: [] }],
          ['clean'],
        ],
        handlers: {},
      },
    },
    placeholder: props.placeholder,
    theme: 'snow',
  })

  quill.on('text-change', () => {
    emit('update:modelValue', quill.root.innerHTML)
  })

  watch(
    () => props.modelValue,
    (newValue) => {
      if (quill.root.innerHTML !== newValue && newValue) {
        quill.root.innerHTML = newValue
      }
    },
  )
  if (props.modelValue) {
    quill.root.innerHTML = props.modelValue
  }
})
</script>

<template>
  <div class="rich-text-editor">
    <div :id="props.id" :style="`height: ${props.height}`"></div>
  </div>
</template>

<style scoped lang="scss">
.rich-text-editor {
  background-color: #f3f4f6;
  border-radius: 5px;
  overflow: hidden;
  border: 1px solid #ddd !important;
  border: unset;
  flex: 1;

  :deep(.ql-editor) {
    padding: 5px 10px;

    ol,
    ul {
      padding: 0;
    }
  }

  .ql-container.ql-snow {
    border: none;
  }

  &:hover {
    border-color: #13d8a7 !important;
  }

  :deep(.ql-toolbar) {
    padding: 2px 8px;
    border-right: unset;
    border-top: unset;
    border-left: unset;
    display: flex;
    align-items: center;
    gap: 10px;

    .ql-formats {
      margin-right: unset;
      display: flex;
      vertical-align: unset;
      align-items: center;
      justify-content: center;

      span.ql-color {
        height: 22px;
        width: 24px;

        .ql-picker-label {
          padding: 2px;
        }
      }

      span.ql-align {
        width: 24px;
        height: 22px;

        .ql-picker-label {
          padding: 1px 2px 2px 2px;
        }
      }

      span.ql-size {
        width: 70px;
        align-items: center;
        display: flex;

        .ql-picker-label {
          width: 70px !important;
          padding-left: 3px;

          &:before {
            font-size: 12px;
            content: '字体大小';
            font-weight: bold;
            display: inline-block;
            line-height: 22px;
          }
        }

        .ql-picker-options {
          .ql-picker-item[data-value='small']:before {
            content: '小号';
          }

          .ql-picker-item:nth-child(1):before {
            content: '默认';
          }

          .ql-picker-item[data-value='large']:before {
            content: '中号';
          }

          .ql-picker-item[data-value='huge']:before {
            content: '大号';
          }
        }
      }

      button {
        padding: 2px;
        height: 22px;
        width: 24px;
      }
    }

    &:after {
      content: '\529F\80FD\63D0\793A\FF1A\4F7F\7528\5DE5\5177\680F\4E4B\524D\FF0C\9700\8981\5148\9009\4E2D\8F93\5165\6846\7684\6587\5B57\3002';
      display: inline-block;
      vertical-align: middle;
      color: #999;
      font-size: 11px;
    }
  }
}
</style>
