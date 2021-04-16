import axios from 'axios';

// eslint-disable-next-line import/prefer-default-export
export const getRss = (url) => axios.get(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(url)}`);
