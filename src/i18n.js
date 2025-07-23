import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ja from './locales/ja.json';
import en from './locales/en.json';
import zh from './locales/zh.json';
import zhTW from './locales/zh-TW.json';
import de from './locales/de.json';
import ko from './locales/ko.json';   
import LanguageDetector from 'i18next-browser-languagedetector';

// ▼推奨：rank名やbonus名もJSONリソース側で管理する
//   ex: en.json, ja.json それぞれ
//   "ranks": { "1等": "1st Prize", "2等": "2nd Prize", ... }
//   "bonus_names": { "ボーナス数字": "Bonus", "BONUS数字1": "Bonus 1", ... }

const resources = {
  ja: { translation: ja },
  en: { translation: en },
  zh: { translation: zh },
  'zh-TW': { translation: zhTW },
};

i18n
.use(LanguageDetector)
  .use(initReactI18next)
   .init({
    resources,
    fallbackLng: 'ja',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage'],
    },
    // 既存の設定もそのまま残す
    saveMissing: true,
    missingKeyHandler: function(lng, ns, key, fallbackValue) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[i18n] missing: ${key} (${lng})`);
      }
    }
  });

export default i18n;