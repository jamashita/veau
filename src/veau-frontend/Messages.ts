export type Messages = {
  GREETING: string;

  YES: string;
  NO: string;
  SUBMIT: string;
  CANCEL: string;
  NAME: string;
  LOCALE: string;

  LOADING: string;

  LOGIN: string;
  LOGOUT: string;

  ACCOUNT_ID: string;
  ACCOUNT_NAME: string;
  ORGANIZATION_NAME: string;
  PASSWORD: string;

  VEAU: string;
  VEAU_DESCRIPTION: string;

  STATS_LIST: string;

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
  NAME: 'Name',
  LOCALE: 'Location/Language',

  LOADING: 'Loading',

  LOGIN: 'Login',
  LOGOUT: 'Logout',

  ACCOUNT_ID: 'Account ID',
  ACCOUNT_NAME: 'Account',
  ORGANIZATION_NAME: 'Organisation Name',
  PASSWORD: 'Password',

  VEAU: 'Veau',
  VEAU_DESCRIPTION: 'Veau is the young of domestic cattle.',

  STATS_LIST: 'Statistics list',

  AUTHENTICATION_FAILED: 'Authentication failed',
  AUTHENTICATION_FAILED_DESCRIPTION: 'Account or Password is incorrect. Please check your them again.',
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
  NAME: 'Le nom',
  LOCALE: 'Lieu/Langue',

  LOADING: 'Chargement',

  LOGIN: 'Se connecter',
  LOGOUT: 'Connectez-out',

  ACCOUNT_ID: 'Identifiant de compte',
  ACCOUNT_NAME: 'Compte',
  ORGANIZATION_NAME: 'Nom de l\'organisation',
  PASSWORD: 'Mot de passe',

  VEAU: 'Veau',
  VEAU_DESCRIPTION: 'Veau est le bétail jeune domestique.',

  STATS_LIST: 'Liste de statistiques',

  AUTHENTICATION_FAILED: 'Authentification échouée',
  AUTHENTICATION_FAILED_DESCRIPTION: 'Compte ou mot de passe est incorrect. Vérifier votre nouveau s\'il vous plaît.',
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
  SUBMIT: 'Submit',
  CANCEL: 'Cancel',
  NAME: 'Nombre',
  LOCALE: 'Ubicación/Idioma',

  LOADING: 'Cargando',

  LOGIN: 'Iniciar sesión',
  LOGOUT: 'Cerrar sesión',

  ACCOUNT_ID: 'Identidad de la cuenta',
  ACCOUNT_NAME: 'Cuenta',
  ORGANIZATION_NAME: 'Nombre de la organización',
  PASSWORD: 'Contraseña',

  VEAU: 'Veau',
  VEAU_DESCRIPTION: 'Veau es la cría de toro doméstico.',

  STATS_LIST: 'Lista de estadísticas',

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
  NAME: '名前',
  LOCALE: '地域/言語',

  LOADING: '読み込み中',

  LOGIN: 'ログイン',
  LOGOUT: 'ログアウト',

  ACCOUNT_ID: 'アカウントID',
  ACCOUNT_NAME: 'アカウント名',
  ORGANIZATION_NAME: '組織名',
  PASSWORD: 'パスワード',

  VEAU: 'ヴォ',
  VEAU_DESCRIPTION: 'ヴォとは牛の子供のことです。',

  STATS_LIST: '統計の一覧',

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
