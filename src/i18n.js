import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 作成したjsonをimport
import ja from './ja.json';
import en from './en.json';
import zh from './zh.json';
import zhTW from './zh-TW.json';

const resources = {
  ja: { translation: ja },
  en: { translation: en },
  zh: { translation: zh },
  'zh-TW': { translation: zhTW },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: navigator.language.startsWith('zh-TW') ? 'zh-TW'
      : navigator.language.startsWith('zh') ? 'zh'
      : navigator.language.startsWith('ja') ? 'ja'
      : 'en', // デフォルト言語（自動判定）
    fallbackLng: 'ja',
    interpolation: { escapeValue: false },
  });

export default i18n;