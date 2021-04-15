import * as yup from 'yup';

const schema = yup.string().url('Строка должна быть валидным URL').required();

const validate = (state, value) => {
  schema.validateSync(value);

  const isRssAlreadyExist = state.rssFeeds.map((rss) => rss.url).find((url) => url === value);
  if (isRssAlreadyExist) {
    throw new Error('RSS уже существует');
  }
};

export default validate;
