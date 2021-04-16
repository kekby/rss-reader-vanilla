import * as yup from 'yup';

const schema = yup.string().url('errors.urlInvalid').required();

const validate = (state, value) => {
  schema.validateSync(value);

  const isRssAlreadyExist = state.rssFeeds.map((rss) => rss.url).find((url) => url === value);
  if (isRssAlreadyExist) {
    throw new Error('errors.rssExist');
  }
};

export default validate;
