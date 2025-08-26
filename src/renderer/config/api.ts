const API_BASE_DEV = 'http://localhost:8080/api';
const API_BASE_PROD = 'https://tax-calculator-be.onrender.com/api';

const IS_DEV = false;

export const API_BASE_URL = IS_DEV ? API_BASE_DEV : API_BASE_PROD;
export const SHOW_MENUBAR = IS_DEV ? true : false;
