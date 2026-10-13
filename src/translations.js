const translations = {
  en: {
    locale: 'en-US',
    home: 'Home', about: 'About', darkMode: 'Dark mode', github: 'View my current GitHub profile',
    projects: 'View projects', contact: 'Connect on LinkedIn', language: 'Language', english: 'English', japanese: '日本語',
    loading: 'Loading portfolio…', loadError: 'The portfolio could not be loaded. Please try again.', retry: 'Try again',
    archived: 'Archived project', archiveNote: 'Live demos are retired. These screenshots show the original working versions.',
    openProject: 'View project details', close: 'Close project details', repository: 'View repository', gallery: 'Project screenshots',
    previous: 'Previous image', next: 'Next image', image: 'Image', of: 'of', selectImage: 'Show image', screenshot: 'screenshot',
    profilePhoto: 'Profile photo of Trace Dugar', notFound: 'Page not found', notFoundDetail: 'This address does not match a page in this portfolio.',
    backHome: 'Return home', copyright: 'Copyright',
    pauseAnimation: 'Pause animation', playAnimation: 'Play animation',
    navigation: 'Main navigation', skipContent: 'Skip to content', projectsNav: 'Projects', experienceNav: 'Experience',
    heroEyebrow: 'Software · Systems · Support', projectsKicker: 'Selected projects', technologies: 'Technologies',
    introEyebrow: 'Engineering & operations', readAbout: 'More about me',
    systemsTools: 'Systems & workflow', developmentTools: 'Application development',
    focusOperations: 'IT & network operations', focusDevelopment: 'Software development', focusDocumentation: 'Technical documentation',
    connectHeading: 'Let’s connect', connectNote: 'Find my code, professional background, and writing.', backToTop: 'Back to top',
    credentialsHeading: 'Certifications', educationHeading: 'Education & training',
    degreeAudio: 'Associate’s degree in Recording Technology, Audio Engineering & Production',
    trainingCode: 'Code Fellows · Full Stack JavaScript certificate',
    certGoogleIT: 'Google IT Support Professional Certificate', certGoogleSecurity: 'Google Cybersecurity Certificate',
    certSecurity: 'CompTIA Security+', certVideoSurveillance: 'Video Surveillance Tech',
    credentialIssued: 'Issued', credentialExpires: 'Expires', opensNewTab: 'opens in a new tab',
  },
  ja: {
    locale: 'ja-JP',
    home: 'ホーム', about: 'プロフィール', darkMode: 'ダークモード', github: '現在のGitHubプロフィールを開く',
    projects: 'プロジェクトを見る', contact: 'LinkedInで連絡する', language: '表示言語', english: 'English', japanese: '日本語',
    loading: 'ポートフォリオを読み込んでいます…', loadError: 'ポートフォリオを読み込めませんでした。もう一度お試しください。', retry: '再試行',
    archived: '過去のプロジェクト', archiveNote: '公開デモは終了しています。スクリーンショットは当時の動作画面です。',
    openProject: 'プロジェクトの詳細を表示', close: 'プロジェクトの詳細を閉じる', repository: 'ソースコードを見る', gallery: 'プロジェクトのスクリーンショット',
    previous: '前の画像', next: '次の画像', image: '画像', of: '/', selectImage: '画像を表示', screenshot: 'スクリーンショット',
    profilePhoto: 'Trace Dugarのプロフィール写真', notFound: 'ページが見つかりません', notFoundDetail: 'このアドレスに対応するページはありません。',
    backHome: 'ホームに戻る', copyright: '著作権',
    pauseAnimation: 'アニメーションを停止', playAnimation: 'アニメーションを再生',
    navigation: 'メインナビゲーション', skipContent: '本文へ移動', projectsNav: '制作実績', experienceNav: '職歴',
    heroEyebrow: 'ソフトウェア開発・システム運用・ITサポート', projectsKicker: '制作実績', technologies: '使用技術',
    introEyebrow: '開発と運用', readAbout: 'プロフィールを見る',
    systemsTools: 'システム・業務ツール', developmentTools: 'アプリケーション開発',
    focusOperations: 'IT・ネットワーク運用', focusDevelopment: 'ソフトウェア開発', focusDocumentation: '技術文書の作成',
    connectHeading: '連絡先', connectNote: 'ソースコード、職歴、執筆記事はこちらからご覧いただけます。', backToTop: 'ページの先頭へ',
    credentialsHeading: '認定資格', educationHeading: '学歴・研修',
    degreeAudio: 'レコーディング技術・音響工学・音楽制作の準学士号',
    trainingCode: 'コードフェローズ · JavaScriptフルスタック開発課程修了',
    certGoogleIT: 'Google ITサポート プロフェッショナル認定資格', certGoogleSecurity: 'Google サイバーセキュリティ認定資格',
    certSecurity: 'CompTIA Security+', certVideoSurveillance: '映像監視技術者',
    credentialIssued: '取得', credentialExpires: '有効期限', opensNewTab: '新しいタブで開きます',
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
