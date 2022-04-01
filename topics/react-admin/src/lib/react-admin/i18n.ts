import polyglotI18nProvider from 'ra-i18n-polyglot';
import ukrainianMessages from 'ra-language-ukrainian';

const uk = {
  ...ukrainianMessages,
  resources: {
    authors: {
      name: 'Автори',
      fields: {
        id: 'Ід',
        login: 'Логін',
        postsIds: 'Пости',
      },
    },
    posts: {
      name: 'Пости',
      fields: {
        title: 'Заголовок',
        body: 'Контент',
        authorIds: 'Автори',
      },
    },
  },
  dashboard: {
    menuTitle: 'Головна',
    title: 'Ласкаво просимо в Адмін Панель',
    todayIs: 'сьогодні',
  },
};

const content = {
  uk,
};

export const getI18nProvider = () => {
  return polyglotI18nProvider((locale) => content[locale as keyof typeof content], 'uk');
};
