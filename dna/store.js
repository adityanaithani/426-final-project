import fs from 'fs';

const read = () => {
  if (fs.existsSync('stagedSeqs.json')) {
    const posts = fs.readFileSync('stagedSeqs.json');
    return JSON.parse(posts);
  } else {
    return {};
  }
};

const write = (stagedSeqs) => {
  fs.writeFileSync('stagedSeqs.json', JSON.stringify(stagedSeqs));
};

const drop = () => {
  if (fs.existsSync('stagedSeqs.json')) {
    fs.unlinkSync('stagedSeqs.json');
  }
};

export default {
  read,
  write,
  drop,
};
