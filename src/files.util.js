import fs from 'fs';

const read = path => new Promise((resolve, reject) => {
  fs.readFile(path, (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(data);
    }
  });
});

const remove = path => new Promise((resolve, reject) => {
  fs.unlink(path, (err) => {
    if (err) {
      reject(err);
    } else {
      resolve();
    }
  });
});undefined

export default ({
  remove,
  read,
});
undefined