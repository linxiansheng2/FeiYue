import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'vant/lib/index.css';
import 'default-passive-events'
import Card from '@/components/cuscard.vue';
import Footer from './components/cusfooter.vue';
import store from './store';
import {createPinia} from "pinia";
import {usePersist} from "pinia-use-persist";
const pinia = createPinia()
pinia.use(usePersist)

import {i18n, vantLocales} from './lang'
//对vant组件进行初始化语言设置
vantLocales(i18n.Locale)
const app = createApp(App);
app.component('Cus-Card',Card);
app.component('Cus-Footer',Footer);
app.use(router).use(pinia).use(i18n).use(store).mount('#app');
app.config.globalProperties.$t = i18n.global.t;




