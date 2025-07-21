import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ja from './locales/ja.json';
import en from './locales/en.json';
import zh from './locales/zh.json';
import zhTW from './locales/zh-TW.json';

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
    lng:
      navigator.language.startsWith('zh-TW') ? 'zh-TW'
      : navigator.language.startsWith('zh') ? 'zh'
      : navigator.language.startsWith('ja') ? 'ja'
      : 'en',
    fallbackLng: 'ja',
    interpolation: { escapeValue: false }, // ここが大事
  });

export default i18n;