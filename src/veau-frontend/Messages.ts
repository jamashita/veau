export type Messages = {
  GREETING: string;

  YES: string;
  NO: string;
  SUBMIT: string;
  CANCEL: string;
  OPEN: string;
  CLOSE: string;
  SAVE: string;

  NAME: string;
  LOCALE: string;
  LANGUAGE: string;
  REGION: string;
  TERM: string;
  UPDATED_AT: string;
  UNIT: string;

  DAILY: string;
  WEEKLY: string;
  MONTHLY: string;
  QUARTERLY: string;
  ANNUAL: string;

  LOADING: string;

  LOGIN: string;
  LOGOUT: string;

  ACCOUNT_NAME: string;
  PASSWORD: string;

  VEAU: string;
  VEAU_DESCRIPTION: string;

  STATS_LIST: string;
  CREATE_NEW_STATS: string;
  FAILED_TO_SAVE_NEW_STATS: string;
  FAILED_TO_SAVE_NEW_STATS_DESCRIPTION: string;

  STATS_INFO: string;
  STATS_ITEM_INFO: string;
  ADD_ITEM: string;
  REMOVE_ITEM: string;
  CREATE_NEW_ITEM: string;
  START_DATE: string;
  DETERMINE_START_DATE: string;
  INVALID_INPUT_VALUE: string;
  INVALID_INPUT_DATE: string;
  STATS_SAVE_FAILURE: string;
  STATS_SAVE_FAILURE_DESCRIPTION: string;
  STATS_NOT_FOUND: string;
  STATS_OVERVIEW_NOT_FOUND: string;

  SAVE_SUCCESS: string;

  AUTHENTICATION_FAILED: string;
  AUTHENTICATION_FAILED_DESCRIPTION: string;
  CONNECTION_ERROR: string;
  CONNECTION_ERROR_DESCRIPTION: string;

  EN: string;
  FR: string;
  ES: string;
  JA: string;
};

const en: Messages = {
  GREETING: 'Hello',

  YES: 'Yes',
  NO: 'No',
  SUBMIT: 'Submit',
  CANCEL: 'Cancel',
  OPEN: 'Open',
  CLOSE: 'Close',
  SAVE: 'Save',

  NAME: 'Name',
  LOCALE: 'Location/Language',
  LANGUAGE: 'Language',
  REGION: 'Region',
  TERM: 'Term',
  UPDATED_AT: 'Updated at',
  UNIT: 'Unit',

  DAILY: 'Daily',
  WEEKLY: 'Weekly',
  MONTHLY: 'Monthly',
  QUARTERLY: 'Quarterly',
  ANNUAL: 'Annual',

  LOADING: 'Loading',

  LOGIN: 'Log in',
  LOGOUT: 'Log out',

  ACCOUNT_NAME: 'Account',
  PASSWORD: 'Password',

  VEAU: 'Veau',
  VEAU_DESCRIPTION: 'Veau is the young of domestic cattle.',

  STATS_LIST: 'Statistics list',
  CREATE_NEW_STATS: 'Create new statistics',
  FAILED_TO_SAVE_NEW_STATS: 'Failed to save the statistics',
  FAILED_TO_SAVE_NEW_STATS_DESCRIPTION: 'Failed to save the statistics to the server. Please try again.',

  STATS_INFO: 'Statistics information',
  STATS_ITEM_INFO: 'Item information',
  ADD_ITEM: 'Add an item',
  REMOVE_ITEM: 'Remove',
  CREATE_NEW_ITEM: 'Create new statistics item',
  START_DATE: 'Start date',
  DETERMINE_START_DATE: 'Determine start date',
  INVALID_INPUT_VALUE: 'The input value was not a number',
  INVALID_INPUT_DATE: 'The input date was invalid',
  STATS_SAVE_FAILURE: 'Save failure',
  STATS_SAVE_FAILURE_DESCRIPTION: 'Failed to save statistics to the server. Please try again.',
  STATS_NOT_FOUND: 'Statistics not found',
  STATS_OVERVIEW_NOT_FOUND: 'List of statistics could not find',

  SAVE_SUCCESS: 'Succeeded to save',

  AUTHENTICATION_FAILED: 'Authentication failed',
  AUTHENTICATION_FAILED_DESCRIPTION: 'Account or Password is incorrect. Please check them again.',
  CONNECTION_ERROR: 'Connection error',
  CONNECTION_ERROR_DESCRIPTION: 'Failed to connect the server. Please get in touch the person in charge.',

  EN: 'English',
  FR: 'Français',
  ES: 'Español',
  JA: '日本語'
};

const fr: Messages = {
  GREETING: 'Salut',

  YES: 'Oui',
  NO: 'Non',
  SUBMIT: 'Soumettre',
  CANCEL: 'Annuler',
  OPEN: 'Ouvrir',
  CLOSE: 'Fermer',
  SAVE: 'Sauver',

  NAME: 'Nom',
  LOCALE: 'Lieu/Langue',
  LANGUAGE: 'Langue',
  REGION: 'Région',
  TERM: 'Terme',
  UPDATED_AT: 'Mis à jour à',
  UNIT: 'Unité',

  DAILY: 'Quotidien',
  WEEKLY: 'Hebdomadaire',
  MONTHLY: 'Mensuel',
  QUARTERLY: 'Trimestriel',
  ANNUAL: 'Annuelle',

  LOADING: 'Chargement',

  LOGIN: 'Se connecter',
  LOGOUT: 'Connecter-out',

  ACCOUNT_NAME: 'Compte',
  PASSWORD: 'Mot de passe',

  VEAU: 'Veau',
  VEAU_DESCRIPTION: 'Veau est le bétail jeune domestique.',

  STATS_LIST: 'Liste de statistiques',
  CREATE_NEW_STATS: 'Créer de nouvelles statistiques',
  FAILED_TO_SAVE_NEW_STATS: 'Échec de la sauvegarde des statistiques',
  FAILED_TO_SAVE_NEW_STATS_DESCRIPTION: 'Échec de l\'enregistrement des statistiques sur le serveur. Veuillez réessayer.',

  STATS_INFO: 'Informations statistiques',
  STATS_ITEM_INFO: 'Informations de l\'élément',
  ADD_ITEM: 'Ajouter un élément',
  REMOVE_ITEM: 'Éliminer',
  CREATE_NEW_ITEM: 'Créer un nouvel élément de statistiques',
  START_DATE: 'Date de début',
  DETERMINE_START_DATE: 'Déterminer la date de début',
  INVALID_INPUT_VALUE: 'La valeur d\'entrée n\'était pas un nombre',
  INVALID_INPUT_DATE: 'La date d\'entrée était invalide',
  STATS_SAVE_FAILURE: 'Enregistrer l\'échec',
  STATS_SAVE_FAILURE_DESCRIPTION: 'Échec de l\'enregistrement des statistiques sur le serveur. Veuillez réessayer.',
  STATS_NOT_FOUND: 'Statistiques non trouvées',
  STATS_OVERVIEW_NOT_FOUND: 'Liste des statistiques n\'a pas pu trouver',

  SAVE_SUCCESS: 'Réussi à sauver',

  AUTHENTICATION_FAILED: 'Authentification échouée',
  AUTHENTICATION_FAILED_DESCRIPTION: 'Compte ou mot de passe est incorrect. Les vérifier à nouveau s\'il vous plaît.',
  CONNECTION_ERROR: 'Erreur de connexion',
  CONNECTION_ERROR_DESCRIPTION: 'Impossible de connecter le serveur. Entrer en contact avec la personne en charge s\'il vous plaît.',

  EN: 'English',
  FR: 'Français',
  ES: 'Español',
  JA: '日本語'
};

const es: Messages = {
  GREETING: 'Hola',

  YES: 'Sí',
  NO: 'No',
  SUBMIT: 'Enviar',
  CANCEL: 'Cancelar',
  OPEN: 'Abrir',
  CLOSE: 'Cerrar',
  SAVE: 'Guardar',

  NAME: 'Nombre',
  LOCALE: 'Ubicación/Idioma',
  LANGUAGE: 'Idioma',
  REGION: 'Región',
  TERM: 'Término',
  UPDATED_AT: 'Actualizado en',
  UNIT: 'Unidad',

  DAILY: 'Diario',
  WEEKLY: 'Semanal',
  MONTHLY: 'Mensual',
  QUARTERLY: 'Trimestral',
  ANNUAL: 'Anual',

  LOADING: 'Cargando',

  LOGIN: 'Iniciar sesión',
  LOGOUT: 'Cerrar sesión',

  ACCOUNT_NAME: 'Cuenta',
  PASSWORD: 'Contraseña',

  VEAU: 'Veau',
  VEAU_DESCRIPTION: 'Veau es la cría de toro doméstico.',

  STATS_LIST: 'Lista de estadísticas',
  CREATE_NEW_STATS: 'Crear nuevas estadísticas',
  FAILED_TO_SAVE_NEW_STATS: 'Error al guardar las estadísticas.',
  FAILED_TO_SAVE_NEW_STATS_DESCRIPTION: 'Error al guardar las estadísticas en el servidor. Inténtalo de nuevo',

  STATS_INFO: 'Información estadística',
  STATS_ITEM_INFO: 'Información del item',
  ADD_ITEM: 'Añadir un ítem',
  REMOVE_ITEM: 'Eliminar',
  CREATE_NEW_ITEM: 'Crear nuevo ítem de estadísticas',
  START_DATE: 'Fecha de inicio',
  DETERMINE_START_DATE: 'Determinar la fecha de inicio',
  INVALID_INPUT_VALUE: 'El valor de entrada no era un número',
  INVALID_INPUT_DATE: 'La fecha de entrada no fue válida',
  STATS_SAVE_FAILURE: 'Guarde el fracaso',
  STATS_SAVE_FAILURE_DESCRIPTION: 'Error al guardar las estadísticas en el servidor. Inténtalo de nuevo.',
  STATS_NOT_FOUND: 'Estadísticas no encontradas',
  STATS_OVERVIEW_NOT_FOUND: 'Lista de estadísticas que no pudo encontrar',

  SAVE_SUCCESS: 'Consiguió salvar',

  AUTHENTICATION_FAILED: 'Autenticación fallida',
  AUTHENTICATION_FAILED_DESCRIPTION: 'La cuenta o contraseña es incorrecta. Revísalos nuevamente por favor.',
  CONNECTION_ERROR: 'Error de conexión',
  CONNECTION_ERROR_DESCRIPTION: 'Error al conectar el servidor. Póngase en contacto con la persona a cargo, por favor.',

  EN: 'English',
  FR: 'Français',
  ES: 'Español',
  JA: '日本語'
};

const ja: Messages = {
  GREETING: 'こんにちは',

  YES: 'はい',
  NO: 'いいえ',
  SUBMIT: '投稿する',
  CANCEL: 'やめる',
  OPEN: '開く',
  CLOSE: '閉じる',
  SAVE: '保存する',

  NAME: '名前',
  LOCALE: '地域/言語',
  LANGUAGE: '言語',
  REGION: '地域',
  TERM: '期間',
  UPDATED_AT: '更新日',
  UNIT: '単位',

  DAILY: '日次',
  WEEKLY: '週次',
  MONTHLY: '月次',
  QUARTERLY: '四半期',
  ANNUAL: '年次',

  LOADING: '読み込み中',

  LOGIN: 'ログイン',
  LOGOUT: 'ログアウト',

  ACCOUNT_NAME: 'アカウント',
  PASSWORD: 'パスワード',

  VEAU: 'ヴォ',
  VEAU_DESCRIPTION: 'ヴォとは牛の子供のことです。',

  STATS_LIST: '統計の一覧',
  CREATE_NEW_STATS: '新しい統計を作成する',
  FAILED_TO_SAVE_NEW_STATS: '統計情報の保存に失敗しました。',
  FAILED_TO_SAVE_NEW_STATS_DESCRIPTION: '統計情報をサーバーに保存できませんでした。もう一度やり直してください',

  STATS_INFO: '統計情報',
  STATS_ITEM_INFO: '項目情報',
  ADD_ITEM: '項目を追加',
  REMOVE_ITEM: '削除',
  CREATE_NEW_ITEM: '新しい統計項目を作成する',
  START_DATE: '開始日',
  DETERMINE_START_DATE: '開始日を決定する',
  INVALID_INPUT_VALUE: '入力値が数値ではありませんでした',
  INVALID_INPUT_DATE: '入力日が無効です',
  STATS_SAVE_FAILURE: '保存失敗',
  STATS_SAVE_FAILURE_DESCRIPTION: 'サーバーへの統計情報の保存に失敗しました。 もう一度やり直してください。',
  STATS_NOT_FOUND: '統計が見つかりません',
  STATS_OVERVIEW_NOT_FOUND: '統計の一覧が見つかりませんでした',

  SAVE_SUCCESS: '保存成功',

  AUTHENTICATION_FAILED: '認証に失敗しました',
  AUTHENTICATION_FAILED_DESCRIPTION: 'アカウントまたはパスワードが正しくありません。もう一度確認してください。',
  CONNECTION_ERROR: '接続できませんでした',
  CONNECTION_ERROR_DESCRIPTION: 'サーバーに接続できませんでした。担当者に連絡してください。',

  EN: 'English',
  FR: 'Français',
  ES: 'Español',
  JA: '日本語'
};

type I18NMessages = {
  en: Messages;
  fr: Messages;
  es: Messages;
  ja: Messages;
};

export const i18nMessages: I18NMessages = {
  en,
  fr,
  es,
  ja
};
