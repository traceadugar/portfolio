const translations = {
  en: {
    home: 'Home', about: 'About', darkMode: 'Dark mode', github: 'View my current GitHub profile',
    projects: 'View projects', contact: 'Connect on LinkedIn', language: 'Language', english: 'English', japanese: '日本語',
    loading: 'Loading portfolio…', loadError: 'The portfolio could not be loaded. Please try again.', retry: 'Try again',
    archived: 'Archived project', archiveNote: 'Live demos are retired. These screenshots show the original working versions.',
    openProject: 'View project details', close: 'Close project details', repository: 'View repository', gallery: 'Project screenshots',
    previous: 'Previous image', next: 'Next image', image: 'Image', of: 'of', selectImage: 'Show image', screenshot: 'screenshot',
    profilePhoto: 'Profile photo of Trace Dugar', notFound: 'Page not found', notFoundDetail: 'This address does not match a page in this portfolio.',
    backHome: 'Return home', copyright: 'Copyright',
    pauseAnimation: 'Pause animation', playAnimation: 'Play animation',
  },
  ja: {
    home: 'ホーム', about: 'プロフィール', darkMode: 'ダークモード', github: '現在のGitHubプロフィールを開く',
    projects: 'プロジェクトを見る', contact: 'LinkedInで連絡する', language: '表示言語', english: 'English', japanese: '日本語',
    loading: 'ポートフォリオを読み込んでいます…', loadError: 'ポートフォリオを読み込めませんでした。もう一度お試しください。', retry: '再試行',
    archived: '過去のプロジェクト', archiveNote: '公開デモは終了しています。スクリーンショットは当時の動作画面です。',
    openProject: 'プロジェクトの詳細を表示', close: 'プロジェクトの詳細を閉じる', repository: 'ソースコードを見る', gallery: 'プロジェクトのスクリーンショット',
    previous: '前の画像', next: '次の画像', image: '画像', of: '/', selectImage: '画像を表示', screenshot: 'スクリーンショット',
    profilePhoto: 'Trace Dugarのプロフィール写真', notFound: 'ページが見つかりません', notFoundDetail: 'このアドレスに対応するページはありません。',
    backHome: 'ホームに戻る', copyright: '著作権',
    pauseAnimation: 'アニメーションを停止', playAnimation: 'アニメーションを再生',
  },
};

export function getLabels(language) {
  return translations[language === 'ja' ? 'ja' : 'en'];
}

export function readPreference(key, fallback) {
  try { return window.localStorage.getItem(key) || fallback; }
  catch { return fallback; }
}

export function savePreference(key, value) {
  // Storage can be unavailable in private browsers; the controls still work.
  try { window.localStorage.setItem(key, value); } catch { /* Session-only preference. */ }
}
