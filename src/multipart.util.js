import multiparty from 'multiparty';

const parse = req => new Promise((resolve, reject) => {
  const form = new multiparty.Form();
  form.parse(req, (err, fields, result) => {
    if (err) {
      reject(err);
    } else {
      const file = result.files[0];

      let info;
      if (fields.info) {
        info = JSON.parse(fields.info[0]);
      }

      resolve({ file, info });
    }
  });
});

export default ({
  parse,
});
