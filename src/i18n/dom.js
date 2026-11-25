import { t } from './index.js';

/**
 * Applies translations declared via data-i18n* attributes.
 * @param {ParentNode} [root=document]
 */
export function applyStaticTranslations(root = document) {
  if (typeof document === 'undefined') return;

  root.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  root.querySelectorAll('[data-i18n-html]').forEach((el) => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });
  root.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  root.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
    el.setAttribute('aria-label', t(el.dataset.i18nAriaLabel));
  });
  root.querySelectorAll('[data-i18n-title]').forEach((el) => {
    el.title = t(el.dataset.i18nTitle);
  });

  document.title = t('app.title');
}
