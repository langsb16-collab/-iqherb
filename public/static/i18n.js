// Internationalization (i18n) - Multi-language support
// 다국어 지원: 한국어, 영어, 중국어(간체), 일본어, 독일어, 스페인어, 프랑스어, 아랍어

const translations = {
  // 한국어 (Korean)
  ko: {
    // Header
    siteTitle: 'OpenFunding IT Hub',
    siteSubtitle: '프로젝트가 자본을 만나는 곳',
    adminPage: '관리자 페이지',
    mainPage: '메인',
    backToMain: '메인으로',
    
    // Hero Section
    heroTitle: 'Code your vision,<br>build your future',
    heroSubtitle: '개발자, 전략적 투자자 조달 허브',
    fundingTypeInvestment: '투자',
    fundingTypeRevenue: '수익분배',
    fundingTypeStartup: '창업희망',
    
    // Announcements
    announcementsTitle: '공지',
    noAnnouncements: '등록된 공지가 없습니다',
    
    // News
    newsTitle: '참고뉴스',
    noNews: '등록된 참고뉴스가 없습니다',
    
    // Filter Section
    filterFunding: '자금',
    filterAll: '전체',
    filterSort: '정렬',
    sortLatest: '최신순',
    sortAmountDesc: '금액↓',
    sortAmountAsc: '금액↑',
    sortViews: '조회수',
    searchPlaceholder: '검색...',
    
    // Project List
    loading: '프로젝트를 불러오는 중...',
    noProjects: '등록된 프로젝트가 없습니다',
    amountUnit: '만원',
    viewsCount: '회',
    clickForVideo: '클릭하시면 설명 영상 보입니다',
    projectContent: '프로젝트 내용',
    noContent: '프로젝트 내용이 없습니다.',
    
    // Admin Page
    adminTitle: '관리자 페이지',
    tabProjects: '프로젝트',
    tabAnnouncements: '공지',
    tabNews: '참고뉴스',
    
    // Admin - Projects Tab
    newProject: '새 프로젝트',
    exportData: '내보내기',
    importData: '가져오기',
    deleteAll: '전체 삭제',
    storageSpace: '저장 공간',
    projectsCount: '프로젝트',
    storageWarning: '저장 공간 부족',
    registeredProjects: '등록된 프로젝트',
    
    // Admin - Announcements Tab
    newAnnouncement: '새 공지',
    registeredAnnouncements: '등록된 공지',
    
    // Admin - News Tab
    newNews: '새 참고뉴스',
    registeredNews: '등록된 참고뉴스',
    
    // Form Labels
    formTitle: '제목',
    formContent: '내용',
    formImageUrl: '이미지 URL',
    formYoutubeLink: 'YouTube 링크',
    formDescription: '설명',
    formProjectName: '프로젝트명',
    formBriefIntro: '한줄 소개',
    formCategory: '카테고리',
    formFundingType: '자금 방식',
    formAmount: '희망 금액 (만원)',
    formLanguages: '지원 언어',
    formTextInfo: '텍스트 정보',
    formDetailedDescription: '프로젝트에 대한 상세 설명을 입력하세요...',
    
    // Form Options
    optionSelect: '선택',
    categoryApp: '앱',
    categoryWeb: '웹플랫폼',
    categoryO2O: 'O2O',
    categoryGame: '게임',
    categoryOther: '기타',
    
    // Buttons
    btnSave: '저장',
    btnCancel: '취소',
    btnEdit: '수정',
    btnDelete: '삭제',
    btnClose: '닫기',
    
    // Messages
    msgSaved: '저장되었습니다',
    msgDeleted: '삭제되었습니다',
    msgUpdated: '수정되었습니다',
    msgConfirmDelete: '정말 삭제하시겠습니까?',
    msgRequired: '필수 항목입니다',
    
    // Footer
    footerTagline: '프로젝트가 자본을 만나는 곳',
    footerCopyright: '© 2024 OpenFunding IT Hub. All rights reserved.',
    
    // Language Selector
    languageLabel: '언어',
    selectLanguage: '언어 선택'
  },
  
  // English
  en: {
    // Header
    siteTitle: 'OpenFunding IT Hub',
    siteSubtitle: 'Where Projects Meet Capital',
    adminPage: 'Admin Panel',
    mainPage: 'Home',
    backToMain: 'Back to Home',
    
    // Hero Section
    heroTitle: 'Code your vision,<br>build your future',
    heroSubtitle: 'Strategic Investment Hub for Developers',
    fundingTypeInvestment: 'Investment',
    fundingTypeRevenue: 'Revenue Sharing',
    fundingTypeStartup: 'Startup Funding',
    
    // Announcements
    announcementsTitle: 'Announcements',
    noAnnouncements: 'No announcements available',
    
    // News
    newsTitle: 'Reference News',
    noNews: 'No news available',
    
    // Filter Section
    filterFunding: 'Funding',
    filterAll: 'All',
    filterSort: 'Sort',
    sortLatest: 'Latest',
    sortAmountDesc: 'Amount ↓',
    sortAmountAsc: 'Amount ↑',
    sortViews: 'Views',
    searchPlaceholder: 'Search...',
    
    // Project List
    loading: 'Loading projects...',
    noProjects: 'No projects available',
    amountUnit: 'K',
    viewsCount: 'views',
    clickForVideo: 'Click to watch explanation video',
    projectContent: 'Project Details',
    noContent: 'No project details available.',
    
    // Admin Page
    adminTitle: 'Admin Panel',
    tabProjects: 'Projects',
    tabAnnouncements: 'Announcements',
    tabNews: 'News',
    
    // Admin - Projects Tab
    newProject: 'New Project',
    exportData: 'Export',
    importData: 'Import',
    deleteAll: 'Delete All',
    storageSpace: 'Storage',
    projectsCount: 'projects',
    storageWarning: 'Storage Low',
    registeredProjects: 'Registered Projects',
    
    // Admin - Announcements Tab
    newAnnouncement: 'New Announcement',
    registeredAnnouncements: 'Registered Announcements',
    
    // Admin - News Tab
    newNews: 'New News',
    registeredNews: 'Registered News',
    
    // Form Labels
    formTitle: 'Title',
    formContent: 'Content',
    formImageUrl: 'Image URL',
    formYoutubeLink: 'YouTube Link',
    formDescription: 'Description',
    formProjectName: 'Project Name',
    formBriefIntro: 'Brief Introduction',
    formCategory: 'Category',
    formFundingType: 'Funding Type',
    formAmount: 'Target Amount (10K KRW)',
    formLanguages: 'Supported Languages',
    formTextInfo: 'Text Information',
    formDetailedDescription: 'Enter detailed project description...',
    
    // Form Options
    optionSelect: 'Select',
    categoryApp: 'App',
    categoryWeb: 'Web Platform',
    categoryO2O: 'O2O',
    categoryGame: 'Game',
    categoryOther: 'Other',
    
    // Buttons
    btnSave: 'Save',
    btnCancel: 'Cancel',
    btnEdit: 'Edit',
    btnDelete: 'Delete',
    btnClose: 'Close',
    
    // Messages
    msgSaved: 'Saved successfully',
    msgDeleted: 'Deleted successfully',
    msgUpdated: 'Updated successfully',
    msgConfirmDelete: 'Are you sure you want to delete this?',
    msgRequired: 'This field is required',
    
    // Footer
    footerTagline: 'Where Projects Meet Capital',
    footerCopyright: '© 2024 OpenFunding IT Hub. All rights reserved.',
    
    // Language Selector
    languageLabel: 'Language',
    selectLanguage: 'Select Language'
  },
  
  // 中文 (Chinese Simplified)
  zh: {
    // Header
    siteTitle: 'OpenFunding IT Hub',
    siteSubtitle: '项目与资本相遇之地',
    adminPage: '管理面板',
    mainPage: '首页',
    backToMain: '返回首页',
    
    // Hero Section
    heroTitle: '编写你的愿景，<br>构建你的未来',
    heroSubtitle: '开发者战略投资对接平台',
    fundingTypeInvestment: '投资',
    fundingTypeRevenue: '收益分成',
    fundingTypeStartup: '创业融资',
    
    // Announcements
    announcementsTitle: '公告',
    noAnnouncements: '暂无公告',
    
    // News
    newsTitle: '参考资讯',
    noNews: '暂无资讯',
    
    // Filter Section
    filterFunding: '资金类型',
    filterAll: '全部',
    filterSort: '排序',
    sortLatest: '最新',
    sortAmountDesc: '金额↓',
    sortAmountAsc: '金额↑',
    sortViews: '浏览量',
    searchPlaceholder: '搜索...',
    
    // Project List
    loading: '加载项目中...',
    noProjects: '暂无项目',
    amountUnit: '万元',
    viewsCount: '次',
    clickForVideo: '点击观看说明视频',
    projectContent: '项目详情',
    noContent: '暂无项目详情。',
    
    // Admin Page
    adminTitle: '管理面板',
    tabProjects: '项目',
    tabAnnouncements: '公告',
    tabNews: '资讯',
    
    // Admin - Projects Tab
    newProject: '新建项目',
    exportData: '导出',
    importData: '导入',
    deleteAll: '全部删除',
    storageSpace: '存储空间',
    projectsCount: '个项目',
    storageWarning: '存储不足',
    registeredProjects: '已注册项目',
    
    // Admin - Announcements Tab
    newAnnouncement: '新建公告',
    registeredAnnouncements: '已注册公告',
    
    // Admin - News Tab
    newNews: '新建资讯',
    registeredNews: '已注册资讯',
    
    // Form Labels
    formTitle: '标题',
    formContent: '内容',
    formImageUrl: '图片URL',
    formYoutubeLink: 'YouTube链接',
    formDescription: '描述',
    formProjectName: '项目名称',
    formBriefIntro: '简要介绍',
    formCategory: '类别',
    formFundingType: '资金方式',
    formAmount: '目标金额（万韩元）',
    formLanguages: '支持语言',
    formTextInfo: '文本信息',
    formDetailedDescription: '请输入详细项目描述...',
    
    // Form Options
    optionSelect: '选择',
    categoryApp: '应用',
    categoryWeb: '网络平台',
    categoryO2O: 'O2O',
    categoryGame: '游戏',
    categoryOther: '其他',
    
    // Buttons
    btnSave: '保存',
    btnCancel: '取消',
    btnEdit: '编辑',
    btnDelete: '删除',
    btnClose: '关闭',
    
    // Messages
    msgSaved: '保存成功',
    msgDeleted: '删除成功',
    msgUpdated: '更新成功',
    msgConfirmDelete: '确定要删除吗？',
    msgRequired: '此项必填',
    
    // Footer
    footerTagline: '项目与资本相遇之地',
    footerCopyright: '© 2024 OpenFunding IT Hub. 版权所有。',
    
    // Language Selector
    languageLabel: '语言',
    selectLanguage: '选择语言'
  },
  
  // 日本語 (Japanese)
  ja: {
    // Header
    siteTitle: 'OpenFunding IT Hub',
    siteSubtitle: 'プロジェクトと資本が出会う場所',
    adminPage: '管理パネル',
    mainPage: 'ホーム',
    backToMain: 'ホームに戻る',
    
    // Hero Section
    heroTitle: 'ビジョンをコード化し、<br>未来を構築する',
    heroSubtitle: '開発者のための戦略的投資対接ハブ',
    fundingTypeInvestment: '投資',
    fundingTypeRevenue: '収益分配',
    fundingTypeStartup: '創業資金',
    
    // Announcements
    announcementsTitle: 'お知らせ',
    noAnnouncements: 'お知らせはありません',
    
    // News
    newsTitle: '参考ニュース',
    noNews: 'ニュースはありません',
    
    // Filter Section
    filterFunding: '資金',
    filterAll: 'すべて',
    filterSort: '並び替え',
    sortLatest: '最新',
    sortAmountDesc: '金額↓',
    sortAmountAsc: '金額↑',
    sortViews: '閲覧数',
    searchPlaceholder: '検索...',
    
    // Project List
    loading: 'プロジェクトを読み込み中...',
    noProjects: 'プロジェクトはありません',
    amountUnit: '万ウォン',
    viewsCount: '回',
    clickForVideo: 'クリックして説明動画を見る',
    projectContent: 'プロジェクト詳細',
    noContent: 'プロジェクト詳細はありません。',
    
    // Admin Page
    adminTitle: '管理パネル',
    tabProjects: 'プロジェクト',
    tabAnnouncements: 'お知らせ',
    tabNews: 'ニュース',
    
    // Admin - Projects Tab
    newProject: '新規プロジェクト',
    exportData: 'エクスポート',
    importData: 'インポート',
    deleteAll: 'すべて削除',
    storageSpace: 'ストレージ',
    projectsCount: 'プロジェクト',
    storageWarning: 'ストレージ不足',
    registeredProjects: '登録済みプロジェクト',
    
    // Admin - Announcements Tab
    newAnnouncement: '新規お知らせ',
    registeredAnnouncements: '登録済みお知らせ',
    
    // Admin - News Tab
    newNews: '新規ニュース',
    registeredNews: '登録済みニュース',
    
    // Form Labels
    formTitle: 'タイトル',
    formContent: '内容',
    formImageUrl: '画像URL',
    formYoutubeLink: 'YouTubeリンク',
    formDescription: '説明',
    formProjectName: 'プロジェクト名',
    formBriefIntro: '簡単な紹介',
    formCategory: 'カテゴリー',
    formFundingType: '資金方式',
    formAmount: '希望金額（万ウォン）',
    formLanguages: '対応言語',
    formTextInfo: 'テキスト情報',
    formDetailedDescription: 'プロジェクトの詳細な説明を入力してください...',
    
    // Form Options
    optionSelect: '選択',
    categoryApp: 'アプリ',
    categoryWeb: 'Webプラットフォーム',
    categoryO2O: 'O2O',
    categoryGame: 'ゲーム',
    categoryOther: 'その他',
    
    // Buttons
    btnSave: '保存',
    btnCancel: 'キャンセル',
    btnEdit: '編集',
    btnDelete: '削除',
    btnClose: '閉じる',
    
    // Messages
    msgSaved: '保存されました',
    msgDeleted: '削除されました',
    msgUpdated: '更新されました',
    msgConfirmDelete: '本当に削除しますか？',
    msgRequired: '必須項目です',
    
    // Footer
    footerTagline: 'プロジェクトと資本が出会う場所',
    footerCopyright: '© 2024 OpenFunding IT Hub. All rights reserved.',
    
    // Language Selector
    languageLabel: '言語',
    selectLanguage: '言語を選択'
  },
  
  // Deutsch (German)
  de: {
    // Header
    siteTitle: 'OpenFunding IT Hub',
    siteSubtitle: 'Wo Projekte auf Kapital treffen',
    adminPage: 'Admin-Panel',
    mainPage: 'Startseite',
    backToMain: 'Zurück zur Startseite',
    
    // Hero Section
    heroTitle: 'Kodieren Sie Ihre Vision,<br>bauen Sie Ihre Zukunft',
    heroSubtitle: 'Strategischer Investitions-Hub für Entwickler',
    fundingTypeInvestment: 'Investition',
    fundingTypeRevenue: 'Umsatzbeteiligung',
    fundingTypeStartup: 'Startup-Finanzierung',
    
    // Announcements
    announcementsTitle: 'Ankündigungen',
    noAnnouncements: 'Keine Ankündigungen verfügbar',
    
    // News
    newsTitle: 'Referenznachrichten',
    noNews: 'Keine Nachrichten verfügbar',
    
    // Filter Section
    filterFunding: 'Finanzierung',
    filterAll: 'Alle',
    filterSort: 'Sortieren',
    sortLatest: 'Neueste',
    sortAmountDesc: 'Betrag ↓',
    sortAmountAsc: 'Betrag ↑',
    sortViews: 'Ansichten',
    searchPlaceholder: 'Suchen...',
    
    // Project List
    loading: 'Projekte werden geladen...',
    noProjects: 'Keine Projekte verfügbar',
    amountUnit: 'K',
    viewsCount: 'Ansichten',
    clickForVideo: 'Klicken Sie, um das Erklärvideo anzusehen',
    projectContent: 'Projektdetails',
    noContent: 'Keine Projektdetails verfügbar.',
    
    // Admin Page
    adminTitle: 'Admin-Panel',
    tabProjects: 'Projekte',
    tabAnnouncements: 'Ankündigungen',
    tabNews: 'Nachrichten',
    
    // Admin - Projects Tab
    newProject: 'Neues Projekt',
    exportData: 'Exportieren',
    importData: 'Importieren',
    deleteAll: 'Alle löschen',
    storageSpace: 'Speicher',
    projectsCount: 'Projekte',
    storageWarning: 'Speicher knapp',
    registeredProjects: 'Registrierte Projekte',
    
    // Admin - Announcements Tab
    newAnnouncement: 'Neue Ankündigung',
    registeredAnnouncements: 'Registrierte Ankündigungen',
    
    // Admin - News Tab
    newNews: 'Neue Nachricht',
    registeredNews: 'Registrierte Nachrichten',
    
    // Form Labels
    formTitle: 'Titel',
    formContent: 'Inhalt',
    formImageUrl: 'Bild-URL',
    formYoutubeLink: 'YouTube-Link',
    formDescription: 'Beschreibung',
    formProjectName: 'Projektname',
    formBriefIntro: 'Kurze Einführung',
    formCategory: 'Kategorie',
    formFundingType: 'Finanzierungsart',
    formAmount: 'Zielbetrag (10K KRW)',
    formLanguages: 'Unterstützte Sprachen',
    formTextInfo: 'Textinformationen',
    formDetailedDescription: 'Geben Sie eine detaillierte Projektbeschreibung ein...',
    
    // Form Options
    optionSelect: 'Wählen',
    categoryApp: 'App',
    categoryWeb: 'Web-Plattform',
    categoryO2O: 'O2O',
    categoryGame: 'Spiel',
    categoryOther: 'Andere',
    
    // Buttons
    btnSave: 'Speichern',
    btnCancel: 'Abbrechen',
    btnEdit: 'Bearbeiten',
    btnDelete: 'Löschen',
    btnClose: 'Schließen',
    
    // Messages
    msgSaved: 'Erfolgreich gespeichert',
    msgDeleted: 'Erfolgreich gelöscht',
    msgUpdated: 'Erfolgreich aktualisiert',
    msgConfirmDelete: 'Möchten Sie dies wirklich löschen?',
    msgRequired: 'Dieses Feld ist erforderlich',
    
    // Footer
    footerTagline: 'Wo Projekte auf Kapital treffen',
    footerCopyright: '© 2024 OpenFunding IT Hub. Alle Rechte vorbehalten.',
    
    // Language Selector
    languageLabel: 'Sprache',
    selectLanguage: 'Sprache wählen'
  },
  
  // Español (Spanish)
  es: {
    // Header
    siteTitle: 'OpenFunding IT Hub',
    siteSubtitle: 'Donde los proyectos encuentran capital',
    adminPage: 'Panel de administración',
    mainPage: 'Inicio',
    backToMain: 'Volver al inicio',
    
    // Hero Section
    heroTitle: 'Codifica tu visión,<br>construye tu futuro',
    heroSubtitle: 'Centro estratégico de inversión para desarrolladores',
    fundingTypeInvestment: 'Inversión',
    fundingTypeRevenue: 'Participación en ingresos',
    fundingTypeStartup: 'Financiación de startups',
    
    // Announcements
    announcementsTitle: 'Anuncios',
    noAnnouncements: 'No hay anuncios disponibles',
    
    // News
    newsTitle: 'Noticias de referencia',
    noNews: 'No hay noticias disponibles',
    
    // Filter Section
    filterFunding: 'Financiación',
    filterAll: 'Todos',
    filterSort: 'Ordenar',
    sortLatest: 'Más reciente',
    sortAmountDesc: 'Monto ↓',
    sortAmountAsc: 'Monto ↑',
    sortViews: 'Vistas',
    searchPlaceholder: 'Buscar...',
    
    // Project List
    loading: 'Cargando proyectos...',
    noProjects: 'No hay proyectos disponibles',
    amountUnit: 'K',
    viewsCount: 'vistas',
    clickForVideo: 'Haz clic para ver el video explicativo',
    projectContent: 'Detalles del proyecto',
    noContent: 'No hay detalles del proyecto disponibles.',
    
    // Admin Page
    adminTitle: 'Panel de administración',
    tabProjects: 'Proyectos',
    tabAnnouncements: 'Anuncios',
    tabNews: 'Noticias',
    
    // Admin - Projects Tab
    newProject: 'Nuevo proyecto',
    exportData: 'Exportar',
    importData: 'Importar',
    deleteAll: 'Eliminar todo',
    storageSpace: 'Almacenamiento',
    projectsCount: 'proyectos',
    storageWarning: 'Almacenamiento bajo',
    registeredProjects: 'Proyectos registrados',
    
    // Admin - Announcements Tab
    newAnnouncement: 'Nuevo anuncio',
    registeredAnnouncements: 'Anuncios registrados',
    
    // Admin - News Tab
    newNews: 'Nueva noticia',
    registeredNews: 'Noticias registradas',
    
    // Form Labels
    formTitle: 'Título',
    formContent: 'Contenido',
    formImageUrl: 'URL de imagen',
    formYoutubeLink: 'Enlace de YouTube',
    formDescription: 'Descripción',
    formProjectName: 'Nombre del proyecto',
    formBriefIntro: 'Breve introducción',
    formCategory: 'Categoría',
    formFundingType: 'Tipo de financiación',
    formAmount: 'Monto objetivo (10K KRW)',
    formLanguages: 'Idiomas admitidos',
    formTextInfo: 'Información de texto',
    formDetailedDescription: 'Ingrese una descripción detallada del proyecto...',
    
    // Form Options
    optionSelect: 'Seleccionar',
    categoryApp: 'App',
    categoryWeb: 'Plataforma web',
    categoryO2O: 'O2O',
    categoryGame: 'Juego',
    categoryOther: 'Otro',
    
    // Buttons
    btnSave: 'Guardar',
    btnCancel: 'Cancelar',
    btnEdit: 'Editar',
    btnDelete: 'Eliminar',
    btnClose: 'Cerrar',
    
    // Messages
    msgSaved: 'Guardado exitosamente',
    msgDeleted: 'Eliminado exitosamente',
    msgUpdated: 'Actualizado exitosamente',
    msgConfirmDelete: '¿Estás seguro de que quieres eliminar esto?',
    msgRequired: 'Este campo es obligatorio',
    
    // Footer
    footerTagline: 'Donde los proyectos encuentran capital',
    footerCopyright: '© 2024 OpenFunding IT Hub. Todos los derechos reservados.',
    
    // Language Selector
    languageLabel: 'Idioma',
    selectLanguage: 'Seleccionar idioma'
  },
  
  // Français (French)
  fr: {
    // Header
    siteTitle: 'OpenFunding IT Hub',
    siteSubtitle: 'Là où les projets rencontrent le capital',
    adminPage: 'Panneau d\'administration',
    mainPage: 'Accueil',
    backToMain: 'Retour à l\'accueil',
    
    // Hero Section
    heroTitle: 'Codez votre vision,<br>construisez votre avenir',
    heroSubtitle: 'Centre d\'investissement stratégique pour les développeurs',
    fundingTypeInvestment: 'Investissement',
    fundingTypeRevenue: 'Partage des revenus',
    fundingTypeStartup: 'Financement de startup',
    
    // Announcements
    announcementsTitle: 'Annonces',
    noAnnouncements: 'Aucune annonce disponible',
    
    // News
    newsTitle: 'Nouvelles de référence',
    noNews: 'Aucune nouvelle disponible',
    
    // Filter Section
    filterFunding: 'Financement',
    filterAll: 'Tous',
    filterSort: 'Trier',
    sortLatest: 'Plus récent',
    sortAmountDesc: 'Montant ↓',
    sortAmountAsc: 'Montant ↑',
    sortViews: 'Vues',
    searchPlaceholder: 'Rechercher...',
    
    // Project List
    loading: 'Chargement des projets...',
    noProjects: 'Aucun projet disponible',
    amountUnit: 'K',
    viewsCount: 'vues',
    clickForVideo: 'Cliquez pour regarder la vidéo explicative',
    projectContent: 'Détails du projet',
    noContent: 'Aucun détail de projet disponible.',
    
    // Admin Page
    adminTitle: 'Panneau d\'administration',
    tabProjects: 'Projets',
    tabAnnouncements: 'Annonces',
    tabNews: 'Nouvelles',
    
    // Admin - Projects Tab
    newProject: 'Nouveau projet',
    exportData: 'Exporter',
    importData: 'Importer',
    deleteAll: 'Tout supprimer',
    storageSpace: 'Stockage',
    projectsCount: 'projets',
    storageWarning: 'Stockage faible',
    registeredProjects: 'Projets enregistrés',
    
    // Admin - Announcements Tab
    newAnnouncement: 'Nouvelle annonce',
    registeredAnnouncements: 'Annonces enregistrées',
    
    // Admin - News Tab
    newNews: 'Nouvelle nouvelle',
    registeredNews: 'Nouvelles enregistrées',
    
    // Form Labels
    formTitle: 'Titre',
    formContent: 'Contenu',
    formImageUrl: 'URL de l\'image',
    formYoutubeLink: 'Lien YouTube',
    formDescription: 'Description',
    formProjectName: 'Nom du projet',
    formBriefIntro: 'Brève introduction',
    formCategory: 'Catégorie',
    formFundingType: 'Type de financement',
    formAmount: 'Montant cible (10K KRW)',
    formLanguages: 'Langues prises en charge',
    formTextInfo: 'Informations textuelles',
    formDetailedDescription: 'Entrez une description détaillée du projet...',
    
    // Form Options
    optionSelect: 'Sélectionner',
    categoryApp: 'App',
    categoryWeb: 'Plateforme web',
    categoryO2O: 'O2O',
    categoryGame: 'Jeu',
    categoryOther: 'Autre',
    
    // Buttons
    btnSave: 'Enregistrer',
    btnCancel: 'Annuler',
    btnEdit: 'Modifier',
    btnDelete: 'Supprimer',
    btnClose: 'Fermer',
    
    // Messages
    msgSaved: 'Enregistré avec succès',
    msgDeleted: 'Supprimé avec succès',
    msgUpdated: 'Mis à jour avec succès',
    msgConfirmDelete: 'Êtes-vous sûr de vouloir supprimer ceci?',
    msgRequired: 'Ce champ est obligatoire',
    
    // Footer
    footerTagline: 'Là où les projets rencontrent le capital',
    footerCopyright: '© 2024 OpenFunding IT Hub. Tous droits réservés.',
    
    // Language Selector
    languageLabel: 'Langue',
    selectLanguage: 'Sélectionner la langue'
  },
  
  // العربية (Arabic)
  ar: {
    // Header
    siteTitle: 'OpenFunding IT Hub',
    siteSubtitle: 'حيث تلتقي المشاريع برأس المال',
    adminPage: 'لوحة الإدارة',
    mainPage: 'الرئيسية',
    backToMain: 'العودة إلى الرئيسية',
    
    // Hero Section
    heroTitle: 'رمِّز رؤيتك،<br>ابنِ مستقبلك',
    heroSubtitle: 'مركز الاستثمار الاستراتيجي للمطورين',
    fundingTypeInvestment: 'استثمار',
    fundingTypeRevenue: 'مشاركة الإيرادات',
    fundingTypeStartup: 'تمويل الشركات الناشئة',
    
    // Announcements
    announcementsTitle: 'الإعلانات',
    noAnnouncements: 'لا توجد إعلانات متاحة',
    
    // News
    newsTitle: 'الأخبار المرجعية',
    noNews: 'لا توجد أخبار متاحة',
    
    // Filter Section
    filterFunding: 'التمويل',
    filterAll: 'الكل',
    filterSort: 'ترتيب',
    sortLatest: 'الأحدث',
    sortAmountDesc: 'المبلغ ↓',
    sortAmountAsc: 'المبلغ ↑',
    sortViews: 'المشاهدات',
    searchPlaceholder: 'بحث...',
    
    // Project List
    loading: 'تحميل المشاريع...',
    noProjects: 'لا توجد مشاريع متاحة',
    amountUnit: 'ألف',
    viewsCount: 'مشاهدة',
    clickForVideo: 'انقر لمشاهدة الفيديو التوضيحي',
    projectContent: 'تفاصيل المشروع',
    noContent: 'لا توجد تفاصيل للمشروع متاحة.',
    
    // Admin Page
    adminTitle: 'لوحة الإدارة',
    tabProjects: 'المشاريع',
    tabAnnouncements: 'الإعلانات',
    tabNews: 'الأخبار',
    
    // Admin - Projects Tab
    newProject: 'مشروع جديد',
    exportData: 'تصدير',
    importData: 'استيراد',
    deleteAll: 'حذف الكل',
    storageSpace: 'التخزين',
    projectsCount: 'مشاريع',
    storageWarning: 'مساحة التخزين منخفضة',
    registeredProjects: 'المشاريع المسجلة',
    
    // Admin - Announcements Tab
    newAnnouncement: 'إعلان جديد',
    registeredAnnouncements: 'الإعلانات المسجلة',
    
    // Admin - News Tab
    newNews: 'خبر جديد',
    registeredNews: 'الأخبار المسجلة',
    
    // Form Labels
    formTitle: 'العنوان',
    formContent: 'المحتوى',
    formImageUrl: 'رابط الصورة',
    formYoutubeLink: 'رابط يوتيوب',
    formDescription: 'الوصف',
    formProjectName: 'اسم المشروع',
    formBriefIntro: 'مقدمة موجزة',
    formCategory: 'الفئة',
    formFundingType: 'نوع التمويل',
    formAmount: 'المبلغ المستهدف (10 آلاف وون)',
    formLanguages: 'اللغات المدعومة',
    formTextInfo: 'معلومات نصية',
    formDetailedDescription: 'أدخل وصفًا تفصيليًا للمشروع...',
    
    // Form Options
    optionSelect: 'اختر',
    categoryApp: 'تطبيق',
    categoryWeb: 'منصة ويب',
    categoryO2O: 'O2O',
    categoryGame: 'لعبة',
    categoryOther: 'أخرى',
    
    // Buttons
    btnSave: 'حفظ',
    btnCancel: 'إلغاء',
    btnEdit: 'تعديل',
    btnDelete: 'حذف',
    btnClose: 'إغلاق',
    
    // Messages
    msgSaved: 'تم الحفظ بنجاح',
    msgDeleted: 'تم الحذف بنجاح',
    msgUpdated: 'تم التحديث بنجاح',
    msgConfirmDelete: 'هل أنت متأكد من حذف هذا؟',
    msgRequired: 'هذا الحقل مطلوب',
    
    // Footer
    footerTagline: 'حيث تلتقي المشاريع برأس المال',
    footerCopyright: '© 2024 OpenFunding IT Hub. جميع الحقوق محفوظة.',
    
    // Language Selector
    languageLabel: 'اللغة',
    selectLanguage: 'اختر اللغة'
  }
};

// Translation function
let currentLang = localStorage.getItem('iqherb_language') || 'ko';

function t(key) {
  return translations[currentLang]?.[key] || translations['ko'][key] || key;
}

function changeLanguage(lang) {
  if (!translations[lang]) {
    console.error('Language not supported:', lang);
    return;
  }
  
  currentLang = lang;
  localStorage.setItem('iqherb_language', lang);
  
  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = t(key);
    
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      if (element.hasAttribute('placeholder')) {
        element.placeholder = translation;
      } else {
        element.value = translation;
      }
    } else {
      element.innerHTML = translation;
    }
  });
  
  // Update language selector
  const selector = document.getElementById('languageSelector');
  if (selector) {
    selector.value = lang;
  }
  
  // Apply RTL for Arabic
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  
  console.log('Language changed to:', lang);
}

// Initialize language on page load
function initializeLanguage() {
  const savedLang = localStorage.getItem('iqherb_language') || 'ko';
  changeLanguage(savedLang);
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeLanguage);
} else {
  initializeLanguage();
}
    storageWarning: 'ストレージ不足',
    registeredProjects: '登録済みプロジェクト',
    
    // Admin - Announcements Tab
    newAnnouncement: '新規お知らせ',
    registeredAnnouncements: '登録済みお知らせ',
    
    // Admin - News Tab
    newNews: '新規ニュース',
    registeredNews: '登録済みニュース',
    
    // Form Labels
    formTitle: 'タイトル',
    formContent: '内容',
    formImageUrl: '画像URL',
    formYoutubeLink: 'YouTubeリンク',
    formDescription: '説明',
    formProjectName: 'プロジェクト名',
    formBriefIntro: '簡単な紹介',
    formCategory: 'カテゴリー',
    formFundingType: '資金方式',
    formAmount: '目標金額（万ウォン）',
    formLanguages: '対応言語',
    formTextInfo: 'テキスト情報',
    formDetailedDescription: '詳細なプロジェクト説明を入力してください...',
    
    // Form Options
    optionSelect: '選択',
    categoryApp: 'アプリ',
    categoryWeb: 'ウェブプラットフォーム',
    categoryO2O: 'O2O',
    categoryGame: 'ゲーム',
    categoryOther: 'その他',
    
    // Buttons
    btnSave: '保存',
    btnCancel: 'キャンセル',
    btnEdit: '編集',
    btnDelete: '削除',
    btnClose: '閉じる',
    
    // Messages
    msgSaved: '保存しました',
    msgDeleted: '削除しました',
    msgUpdated: '更新しました',
    msgConfirmDelete: '本当に削除しますか？',
    msgRequired: '必須項目です',
    
    // Footer
    footerTagline: 'プロジェクトと資本が出会う場所',
    footerCopyright: '© 2024 OpenFunding IT Hub. All rights reserved.',
    
    // Language Selector
    languageLabel: '言語',
    selectLanguage: '言語を選択'
  },
  
  // Deutsch (German)
  de: {
    // Header
    siteTitle: 'OpenFunding IT Hub',
    siteSubtitle: 'Wo Projekte auf Kapital treffen',
    adminPage: 'Admin-Panel',
    mainPage: 'Startseite',
    backToMain: 'Zur Startseite',
    
    // Hero Section
    heroTitle: 'Codiere deine Vision,<br>baue deine Zukunft',
    heroSubtitle: 'Strategischer Investitions-Hub für Entwickler',
    fundingTypeInvestment: 'Investition',
    fundingTypeRevenue: 'Umsatzbeteiligung',
    fundingTypeStartup: 'Startup-Finanzierung',
    
    // Announcements
    announcementsTitle: 'Ankündigungen',
    noAnnouncements: 'Keine Ankündigungen verfügbar',
    
    // News
    newsTitle: 'Referenznachrichten',
    noNews: 'Keine Nachrichten verfügbar',
    
    // Filter Section
    filterFunding: 'Finanzierung',
    filterAll: 'Alle',
    filterSort: 'Sortieren',
    sortLatest: 'Neueste',
    sortAmountDesc: 'Betrag ↓',
    sortAmountAsc: 'Betrag ↑',
    sortViews: 'Aufrufe',
    searchPlaceholder: 'Suchen...',
    
    // Project List
    loading: 'Projekte werden geladen...',
    noProjects: 'Keine Projekte verfügbar',
    amountUnit: 'Tsd.',
    viewsCount: 'Aufrufe',
    clickForVideo: 'Klicken Sie, um das Erklärungsvideo anzusehen',
    projectContent: 'Projektdetails',
    noContent: 'Keine Projektdetails verfügbar.',
    
    // Admin Page
    adminTitle: 'Admin-Panel',
    tabProjects: 'Projekte',
    tabAnnouncements: 'Ankündigungen',
    tabNews: 'Nachrichten',
    
    // Admin - Projects Tab
    newProject: 'Neues Projekt',
    exportData: 'Exportieren',
    importData: 'Importieren',
    deleteAll: 'Alle löschen',
    storageSpace: 'Speicher',
    projectsCount: 'Projekte',
    storageWarning: 'Speicher knapp',
    registeredProjects: 'Registrierte Projekte',
    
    // Admin - Announcements Tab
    newAnnouncement: 'Neue Ankündigung',
    registeredAnnouncements: 'Registrierte Ankündigungen',
    
    // Admin - News Tab
    newNews: 'Neue Nachricht',
    registeredNews: 'Registrierte Nachrichten',
    
    // Form Labels
    formTitle: 'Titel',
    formContent: 'Inhalt',
    formImageUrl: 'Bild-URL',
    formYoutubeLink: 'YouTube-Link',
    formDescription: 'Beschreibung',
    formProjectName: 'Projektname',
    formBriefIntro: 'Kurze Einführung',
    formCategory: 'Kategorie',
    formFundingType: 'Finanzierungsart',
    formAmount: 'Zielbetrag (10K KRW)',
    formLanguages: 'Unterstützte Sprachen',
    formTextInfo: 'Textinformationen',
    formDetailedDescription: 'Geben Sie eine detaillierte Projektbeschreibung ein...',
    
    // Form Options
    optionSelect: 'Auswählen',
    categoryApp: 'App',
    categoryWeb: 'Web-Plattform',
    categoryO2O: 'O2O',
    categoryGame: 'Spiel',
    categoryOther: 'Andere',
    
    // Buttons
    btnSave: 'Speichern',
    btnCancel: 'Abbrechen',
    btnEdit: 'Bearbeiten',
    btnDelete: 'Löschen',
    btnClose: 'Schließen',
    
    // Messages
    msgSaved: 'Erfolgreich gespeichert',
    msgDeleted: 'Erfolgreich gelöscht',
    msgUpdated: 'Erfolgreich aktualisiert',
    msgConfirmDelete: 'Möchten Sie dies wirklich löschen?',
    msgRequired: 'Dieses Feld ist erforderlich',
    
    // Footer
    footerTagline: 'Wo Projekte auf Kapital treffen',
    footerCopyright: '© 2024 OpenFunding IT Hub. Alle Rechte vorbehalten.',
    
    // Language Selector
    languageLabel: 'Sprache',
    selectLanguage: 'Sprache auswählen'
  },
  
  // Español (Spanish)
  es: {
    // Header
    siteTitle: 'OpenFunding IT Hub',
    siteSubtitle: 'Donde los proyectos encuentran capital',
    adminPage: 'Panel de administración',
    mainPage: 'Inicio',
    backToMain: 'Volver al inicio',
    
    // Hero Section
    heroTitle: 'Codifica tu visión,<br>construye tu futuro',
    heroSubtitle: 'Centro de inversión estratégica para desarrolladores',
    fundingTypeInvestment: 'Inversión',
    fundingTypeRevenue: 'Participación en ingresos',
    fundingTypeStartup: 'Financiación inicial',
    
    // Announcements
    announcementsTitle: 'Anuncios',
    noAnnouncements: 'No hay anuncios disponibles',
    
    // News
    newsTitle: 'Noticias de referencia',
    noNews: 'No hay noticias disponibles',
    
    // Filter Section
    filterFunding: 'Financiación',
    filterAll: 'Todos',
    filterSort: 'Ordenar',
    sortLatest: 'Más reciente',
    sortAmountDesc: 'Cantidad ↓',
    sortAmountAsc: 'Cantidad ↑',
    sortViews: 'Vistas',
    searchPlaceholder: 'Buscar...',
    
    // Project List
    loading: 'Cargando proyectos...',
    noProjects: 'No hay proyectos disponibles',
    amountUnit: 'mil',
    viewsCount: 'vistas',
    clickForVideo: 'Haga clic para ver el video explicativo',
    projectContent: 'Detalles del proyecto',
    noContent: 'No hay detalles del proyecto disponibles.',
    
    // Admin Page
    adminTitle: 'Panel de administración',
    tabProjects: 'Proyectos',
    tabAnnouncements: 'Anuncios',
    tabNews: 'Noticias',
    
    // Admin - Projects Tab
    newProject: 'Nuevo proyecto',
    exportData: 'Exportar',
    importData: 'Importar',
    deleteAll: 'Eliminar todo',
    storageSpace: 'Almacenamiento',
    projectsCount: 'proyectos',
    storageWarning: 'Almacenamiento bajo',
    registeredProjects: 'Proyectos registrados',
    
    // Admin - Announcements Tab
    newAnnouncement: 'Nuevo anuncio',
    registeredAnnouncements: 'Anuncios registrados',
    
    // Admin - News Tab
    newNews: 'Nueva noticia',
    registeredNews: 'Noticias registradas',
    
    // Form Labels
    formTitle: 'Título',
    formContent: 'Contenido',
    formImageUrl: 'URL de imagen',
    formYoutubeLink: 'Enlace de YouTube',
    formDescription: 'Descripción',
    formProjectName: 'Nombre del proyecto',
    formBriefIntro: 'Breve introducción',
    formCategory: 'Categoría',
    formFundingType: 'Tipo de financiación',
    formAmount: 'Cantidad objetivo (10K KRW)',
    formLanguages: 'Idiomas compatibles',
    formTextInfo: 'Información de texto',
    formDetailedDescription: 'Ingrese una descripción detallada del proyecto...',
    
    // Form Options
    optionSelect: 'Seleccionar',
    categoryApp: 'Aplicación',
    categoryWeb: 'Plataforma web',
    categoryO2O: 'O2O',
    categoryGame: 'Juego',
    categoryOther: 'Otro',
    
    // Buttons
    btnSave: 'Guardar',
    btnCancel: 'Cancelar',
    btnEdit: 'Editar',
    btnDelete: 'Eliminar',
    btnClose: 'Cerrar',
    
    // Messages
    msgSaved: 'Guardado exitosamente',
    msgDeleted: 'Eliminado exitosamente',
    msgUpdated: 'Actualizado exitosamente',
    msgConfirmDelete: '¿Está seguro de que desea eliminar esto?',
    msgRequired: 'Este campo es obligatorio',
    
    // Footer
    footerTagline: 'Donde los proyectos encuentran capital',
    footerCopyright: '© 2024 OpenFunding IT Hub. Todos los derechos reservados.',
    
    // Language Selector
    languageLabel: 'Idioma',
    selectLanguage: 'Seleccionar idioma'
  },
  
  // Français (French)
  fr: {
    // Header
    siteTitle: 'OpenFunding IT Hub',
    siteSubtitle: 'Où les projets rencontrent le capital',
    adminPage: 'Panneau d\'administration',
    mainPage: 'Accueil',
    backToMain: 'Retour à l\'accueil',
    
    // Hero Section
    heroTitle: 'Codez votre vision,<br>construisez votre avenir',
    heroSubtitle: 'Centre d\'investissement stratégique pour développeurs',
    fundingTypeInvestment: 'Investissement',
    fundingTypeRevenue: 'Partage des revenus',
    fundingTypeStartup: 'Financement de démarrage',
    
    // Announcements
    announcementsTitle: 'Annonces',
    noAnnouncements: 'Aucune annonce disponible',
    
    // News
    newsTitle: 'Actualités de référence',
    noNews: 'Aucune actualité disponible',
    
    // Filter Section
    filterFunding: 'Financement',
    filterAll: 'Tous',
    filterSort: 'Trier',
    sortLatest: 'Plus récent',
    sortAmountDesc: 'Montant ↓',
    sortAmountAsc: 'Montant ↑',
    sortViews: 'Vues',
    searchPlaceholder: 'Rechercher...',
    
    // Project List
    loading: 'Chargement des projets...',
    noProjects: 'Aucun projet disponible',
    amountUnit: 'k',
    viewsCount: 'vues',
    clickForVideo: 'Cliquez pour regarder la vidéo explicative',
    projectContent: 'Détails du projet',
    noContent: 'Aucun détail de projet disponible.',
    
    // Admin Page
    adminTitle: 'Panneau d\'administration',
    tabProjects: 'Projets',
    tabAnnouncements: 'Annonces',
    tabNews: 'Actualités',
    
    // Admin - Projects Tab
    newProject: 'Nouveau projet',
    exportData: 'Exporter',
    importData: 'Importer',
    deleteAll: 'Tout supprimer',
    storageSpace: 'Stockage',
    projectsCount: 'projets',
    storageWarning: 'Stockage faible',
    registeredProjects: 'Projets enregistrés',
    
    // Admin - Announcements Tab
    newAnnouncement: 'Nouvelle annonce',
    registeredAnnouncements: 'Annonces enregistrées',
    
    // Admin - News Tab
    newNews: 'Nouvelle actualité',
    registeredNews: 'Actualités enregistrées',
    
    // Form Labels
    formTitle: 'Titre',
    formContent: 'Contenu',
    formImageUrl: 'URL de l\'image',
    formYoutubeLink: 'Lien YouTube',
    formDescription: 'Description',
    formProjectName: 'Nom du projet',
    formBriefIntro: 'Brève introduction',
    formCategory: 'Catégorie',
    formFundingType: 'Type de financement',
    formAmount: 'Montant cible (10K KRW)',
    formLanguages: 'Langues prises en charge',
    formTextInfo: 'Informations textuelles',
    formDetailedDescription: 'Entrez une description détaillée du projet...',
    
    // Form Options
    optionSelect: 'Sélectionner',
    categoryApp: 'Application',
    categoryWeb: 'Plateforme web',
    categoryO2O: 'O2O',
    categoryGame: 'Jeu',
    categoryOther: 'Autre',
    
    // Buttons
    btnSave: 'Enregistrer',
    btnCancel: 'Annuler',
    btnEdit: 'Modifier',
    btnDelete: 'Supprimer',
    btnClose: 'Fermer',
    
    // Messages
    msgSaved: 'Enregistré avec succès',
    msgDeleted: 'Supprimé avec succès',
    msgUpdated: 'Mis à jour avec succès',
    msgConfirmDelete: 'Êtes-vous sûr de vouloir supprimer ceci ?',
    msgRequired: 'Ce champ est obligatoire',
    
    // Footer
    footerTagline: 'Où les projets rencontrent le capital',
    footerCopyright: '© 2024 OpenFunding IT Hub. Tous droits réservés.',
    
    // Language Selector
    languageLabel: 'Langue',
    selectLanguage: 'Sélectionner la langue'
  },
  
  // العربية (Arabic)
  ar: {
    // Header
    siteTitle: 'OpenFunding IT Hub',
    siteSubtitle: 'حيث تلتقي المشاريع برأس المال',
    adminPage: 'لوحة الإدارة',
    mainPage: 'الرئيسية',
    backToMain: 'العودة إلى الرئيسية',
    
    // Hero Section
    heroTitle: 'اكتب رؤيتك،<br>ابنِ مستقبلك',
    heroSubtitle: 'مركز الاستثمار الاستراتيجي للمطورين',
    fundingTypeInvestment: 'استثمار',
    fundingTypeRevenue: 'مشاركة الإيرادات',
    fundingTypeStartup: 'تمويل بدء التشغيل',
    
    // Announcements
    announcementsTitle: 'الإعلانات',
    noAnnouncements: 'لا توجد إعلانات متاحة',
    
    // News
    newsTitle: 'الأخبار المرجعية',
    noNews: 'لا توجد أخبار متاحة',
    
    // Filter Section
    filterFunding: 'التمويل',
    filterAll: 'الكل',
    filterSort: 'ترتيب',
    sortLatest: 'الأحدث',
    sortAmountDesc: 'المبلغ ↓',
    sortAmountAsc: 'المبلغ ↑',
    sortViews: 'المشاهدات',
    searchPlaceholder: 'بحث...',
    
    // Project List
    loading: 'جاري تحميل المشاريع...',
    noProjects: 'لا توجد مشاريع متاحة',
    amountUnit: 'ألف',
    viewsCount: 'مشاهدة',
    clickForVideo: 'انقر لمشاهدة الفيديو التوضيحي',
    projectContent: 'تفاصيل المشروع',
    noContent: 'لا توجد تفاصيل المشروع متاحة.',
    
    // Admin Page
    adminTitle: 'لوحة الإدارة',
    tabProjects: 'المشاريع',
    tabAnnouncements: 'الإعلانات',
    tabNews: 'الأخبار',
    
    // Admin - Projects Tab
    newProject: 'مشروع جديد',
    exportData: 'تصدير',
    importData: 'استيراد',
    deleteAll: 'حذف الكل',
    storageSpace: 'التخزين',
    projectsCount: 'مشاريع',
    storageWarning: 'مساحة تخزين منخفضة',
    registeredProjects: 'المشاريع المسجلة',
    
    // Admin - Announcements Tab
    newAnnouncement: 'إعلان جديد',
    registeredAnnouncements: 'الإعلانات المسجلة',
    
    // Admin - News Tab
    newNews: 'خبر جديد',
    registeredNews: 'الأخبار المسجلة',
    
    // Form Labels
    formTitle: 'العنوان',
    formContent: 'المحتوى',
    formImageUrl: 'رابط الصورة',
    formYoutubeLink: 'رابط يوتيوب',
    formDescription: 'الوصف',
    formProjectName: 'اسم المشروع',
    formBriefIntro: 'مقدمة موجزة',
    formCategory: 'الفئة',
    formFundingType: 'نوع التمويل',
    formAmount: 'المبلغ المستهدف (10 آلاف وون)',
    formLanguages: 'اللغات المدعومة',
    formTextInfo: 'معلومات نصية',
    formDetailedDescription: 'أدخل وصفًا تفصيليًا للمشروع...',
    
    // Form Options
    optionSelect: 'اختر',
    categoryApp: 'تطبيق',
    categoryWeb: 'منصة ويب',
    categoryO2O: 'O2O',
    categoryGame: 'لعبة',
    categoryOther: 'أخرى',
    
    // Buttons
    btnSave: 'حفظ',
    btnCancel: 'إلغاء',
    btnEdit: 'تعديل',
    btnDelete: 'حذف',
    btnClose: 'إغلاق',
    
    // Messages
    msgSaved: 'تم الحفظ بنجاح',
    msgDeleted: 'تم الحذف بنجاح',
    msgUpdated: 'تم التحديث بنجاح',
    msgConfirmDelete: 'هل أنت متأكد من أنك تريد حذف هذا؟',
    msgRequired: 'هذا الحقل مطلوب',
    
    // Footer
    footerTagline: 'حيث تلتقي المشاريع برأس المال',
    footerCopyright: '© 2024 OpenFunding IT Hub. جميع الحقوق محفوظة.',
    
    // Language Selector
    languageLabel: 'اللغة',
    selectLanguage: 'اختر اللغة'
  }
};

// Language names for the selector
const languageNames = {
  ko: '한국어',
  en: 'English',
  zh: '中文',
  ja: '日本語',
  de: 'Deutsch',
  es: 'Español',
  fr: 'Français',
  ar: 'العربية'
};

// Get current language from localStorage or default to Korean
function getCurrentLanguage() {
  return localStorage.getItem('iqherb_language') || 'ko';
}

// Set current language
function setCurrentLanguage(lang) {
  if (translations[lang]) {
    localStorage.setItem('iqherb_language', lang);
    return true;
  }
  return false;
}

// Get translation for a key
function t(key) {
  const lang = getCurrentLanguage();
  return translations[lang][key] || translations['ko'][key] || key;
}

// Export for browser (global scope)
if (typeof window !== 'undefined') {
  window.translations = translations;
  window.languageNames = languageNames;
  window.getCurrentLanguage = getCurrentLanguage;
  window.setCurrentLanguage = setCurrentLanguage;
  window.t = t;
}

// Export for Node.js (module)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { translations, languageNames, getCurrentLanguage, setCurrentLanguage, t };
}
