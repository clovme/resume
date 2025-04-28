declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue-cropper' {
  import VueCropper from './vue-cropper.vue'
  export { VueCropper }
}
