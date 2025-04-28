import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css' // 引入 Snow 主题的样式
import 'element-plus/dist/index.css'
import '@/styles/webfont/style.scss'
import '@/main.scss'
import store from '@/store'
import App from '@/App.vue'

const app = createApp(App)
app.use(store)
app.use(ElementPlus, { locale: zhCn })
app.mount('#app')
