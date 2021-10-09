const express = require('express');
const multer = require('multer');
const path = require('path');
const mime = require('mime-types');
const { nanoid } = require('nanoid');

const PORT = 3000;
const app = express();

const storage = new multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const id = nanoid();
    const ext = mime.extension(file.mimetype);
    const name = `${id}.${ext}`;

    cb(null, name);
  },
});

const upload = multer({ storage: storage });

app.use(express.urlencoded({ extended: true }))

app.post('/file', upload.single('file'), (req, res) => {
  const { file, files, body } = req;

  console.log({ file, files, body });
  
  res.status(200);
  res.send('OK!');
});

app.get('/', (req, res) => res.sendFile(path.resolve('index.html')));

app.listen(PORT, () => console.log(`server started on http://localhost:${PORT}`));