require('dotenv/config');
const pg = require('pg');
const express = require('express');
const ClientError = require('./client-error');
const staticMiddleware = require('./static-middleware');
const uploadsMiddleware = require('./uploads-middleware');

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});

const app = express();

const jsonMiddleware = express.json();
app.use(jsonMiddleware);

app.post('/api/post-form', uploadsMiddleware, (req, res, next) => {
  const { title, content } = req.body;
  let { tags } = req.body;
  if (!title || !tags || !content) {
    throw new ClientError(400, 'A title, tags and content are required fields');
  }

  if (!Array.isArray(tags)) {
    tags = [tags];
  }

  const tagsArray = JSON.stringify(tags);
  const imageUrl = `images/${req.file.filename}`;

  const params = [title, tagsArray, content, imageUrl, 1];

  const sql = `
    insert into "Post" ("title", "tags", "content", "image", "userId")
         values  ($1, $2, $3, $4, $5)
      returning  *
  `;
  db.query(sql, params)
    .then(results => {
      res.json(results.rows[0]);
    })
    .catch(err => next(err));
});

app.get('/api/users-posts', (req, res, next) => {
  const { userId } = req.body;
  if (!userId) {
    throw new ClientError(400, 'UserId is a required fields');
  }

  const params = [userId];
  const sql = `
    select *
      from "Post"
     where "userId" = $1
  `;
  db.query(sql, params)
    .then(results => {
      res.json(results.rows[0]);
    })
    .catch(err => next(err));
});

app.use(staticMiddleware);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
