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

  EN: 'English',
  FR: 'Français',
  ES: 'Español',
  JA: '日本語'
};

type I18NMessages = {
  en: Messages,
  fr: Messages,
  es: Messages,
  ja: Messages
};

export const i18nMessages: I18NMessages = {
  en,
  fr,
  es,
  ja
};
