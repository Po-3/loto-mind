import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ja from './locales/ja.json';
import en from './locales/en.json';
import zh from './locales/zh.json';
import zhTW from './locales/zh-TW.json';

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
  .use(initReactI18next)
  .init({
    resources,
    lng:
      navigator.language.startsWith('zh-TW') ? 'zh-TW'
      : navigator.language.startsWith('zh') ? 'zh'
      : navigator.language.startsWith('ja') ? 'ja'
      : 'en',
    fallbackLng: 'ja',
    interpolation: { escapeValue: false }, // プレースホルダの展開に必須
    // 推奨：キー未定義の時に警告が出る設定
    saveMissing: true,
    missingKeyHandler: function(lng, ns, key, fallbackValue) {
      // 本番用には消してOK
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[i18n] missing: ${key} (${lng})`);
      }
    }
  });

export default i18n;