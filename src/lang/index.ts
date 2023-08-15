// index.js
import { createI18n } from 'vue-i18n'

// vue-i18n所需要引入的
// 本地的文件夹
import zhLocale from './zh'
import zhhkLocale from './en'
import japLocale from './jap'
import krLocale from './kr'
import frLocale from './fr'
import rusLocale from './rus'
import gerLocale from './ger'
import esLocale from './es'
// vant所需要引入的
import { Locale } from 'vant'
//vant中的文件夹  需要的语言和本地的语言保持一致
import zhHK from 'vant/lib/locale/lang/zh-HK'
import enUS from 'vant/lib/locale/lang/en-US'
import jaJP from 'vant/lib/locale/lang/ja-JP'
import koKR from 'vant/lib/locale/lang/ko-KR'
import frFR from 'vant/lib/locale/lang/fr-FR'
import ruRU from 'vant/lib/locale/lang/ru-RU'
import deDE from 'vant/lib/locale/lang/de-DE'
import esES from 'vant/lib/locale/lang/es-ES'
const messages = {
  zh: {
    ...zhHK,
    ...zhLocale
  },
  en: {
    ...enUS,
    ...zhhkLocale
  },
  jap: {
    ...jaJP,
    ...japLocale
  },
  kr: {
    ...koKR,
    ...krLocale
  },
  fr: {
    ...frFR,
    ...frLocale
  },
  rus: {
    ...ruRU,
    ...rusLocale
  },
  ger: {
    ...deDE,
    ...gerLocale
  },
  es: {
    ...esES,
    ...esLocale
  },
}
// 更新vant组件库本身的语言变化，支持国际化
function vantLocales (lang:any) {
  if (lang === 'en') {
    Locale.use(lang, enUS)
  } else if (lang === 'zh') {
    Locale.use(lang, zhHK)
  } else if (lang === 'jap') {
    Locale.use(lang, jaJP)
  } else if (lang === 'kr') {
    Locale.use(lang, koKR)
  } else if (lang === 'fr') {
    Locale.use(lang, frFR)
  } else if (lang === 'rus') {
    Locale.use(lang, ruRU)
  } else if (lang === 'ger') {
    Locale.use(lang, deDE)
  } else if (lang === 'es') {
    Locale.use(lang, esES)
  }
}
// 获取浏览器的语言
const lang = (navigator.language || 'en').toLocaleLowerCase() 
const language = localStorage.getItem('language') || lang.split('-')[0] || 'zh';
localStorage.setItem('language', language)
const i18n:any = createI18n({
  //Not available in legacy mode 解决报错问题的配置项！！！
  legacy: false,
  // 全局注册 $t方法
  globalInjection: true, 
  //设置初始化语言
  locale: language, 
  // 设置备用语言
  fallbackLocale: 'en', 
  messages, 
})

export const getMessage = () => {
  return messages
}

export {i18n, vantLocales}
 
 