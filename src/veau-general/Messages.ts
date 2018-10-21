export type message = {
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

  EN: string;
  FR: string;
  ES: string;
  JA: string;
};

const en: message = {
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

  EN: 'English',
  FR: 'Français',
  ES: 'Español',
  JA: '日本語'
};

const fr: message = {
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

  EN: 'English',
  FR: 'Français',
  ES: 'Español',
  JA: '日本語'
};

const es: message = {
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

  EN: 'English',
  FR: 'Français',
  ES: 'Español',
  JA: '日本語'
};

const ja: message = {
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

  EN: 'English',
  FR: 'Français',
  ES: 'Español',
  JA: '日本語'
};

type messageType = {
  [key: string]: message;
};

export const Messages: messageType = {
  en,
  fr,
  es,
  ja
};
