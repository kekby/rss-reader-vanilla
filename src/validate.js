import * as yup from 'yup';
import i18next from 'i18next';

const schema = yup.string().url(i18next.t('errors.urlInvalid')).required();

const validate = (state, value) => {
  schema.validateSync(value);

  const isRssAlreadyExist = state.rssFeeds.map((rss) => rss.url).find((url) => url === value);
  if (isRssAlreadyExist) {
    throw new Error(i18next.t('errors.rssExist'));
  }
};

export default validate;
