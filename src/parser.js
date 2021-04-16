const extractContent = (el, fields) => fields.map((field) => el.querySelector(field).textContent);

const parse = (xml) => {
  try {
    const dom = new DOMParser().parseFromString(xml, 'text/xml');
    const [title, description] = extractContent(dom, ['title', 'description']);

    const items = dom.querySelectorAll('item');
    const posts = Array.from(items).map((item) => {
      const [postTitle, postDescription, id, link, date] = extractContent(item, ['title', 'description', 'guid', 'link', 'pubDate']);

      return {
        title: postTitle,
        description: postDescription,
        id,
        link,
        date,
      };
    });

    return {
      title,
      description,
      posts,
    };
  } catch (err) {
    throw new Error('errors.rssInvalid');
  }
};

export default parse;
