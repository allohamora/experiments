export const app = document.querySelector('#app');
export const forms = app.querySelector('.forms');
export const result = app.querySelector('.result');
export const resultContainer = result.querySelector('.result__container');

export const setResult = (text) => {
  resultContainer.innerText = text;
}