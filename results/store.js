import fs from 'fs';

const read = () => {
  if (fs.existsSync('results.json')) {
    const posts = fs.readFileSync('results.json');
    return JSON.parse(posts);
  } else {
    return {};
  }
};

const write = (results) => {
  fs.writeFileSync('results.json', JSON.stringify(results));
};

const drop = () => {
  if (fs.existsSync('results.json')) {
    fs.writeFileSync('results.json', JSON.stringify({}));
  }
};

export default {
  read,
  write,
  drop,
};
