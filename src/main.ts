import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import SvgIcon from './components/SvgIcon/index.vue';
import router from '@/router/routes'
import pinia from '@/store'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'


const app = createApp(App)
app.use(ElementPlus, {
    locale: zhCn    //国际化配置
})
import 'virtual:svg-icons-register'
//将SVG图表组件注册为全局组件
app.use(pinia)
app.use(router)
import '@/views/permisstion'
app.component('SvgIcon', SvgIcon)
app.mount('#app')

// 将所有图标注册为全局组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}