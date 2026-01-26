const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

connection.connect(err => {
  if (err) return console.error('DB接続失敗', err);
  console.log('MySQL接続成功');
});

// ==============================
// POST /api/actor/search
// ==============================
app.post("/api/actor/search", (req, res) => {
  const { keyword, gender, ageRange } = req.body;

  let actorQuery = `
    SELECT
      a.actor_no,
      a.name,
      a.date_of_birth,
      a.gender_no,
      g.gender,
      a.nationality_no,
      n.nationality,
      w.count_no,
      w.awards
    FROM actor a
    LEFT JOIN awards w ON a.actor_no = w.actor_no
    LEFT JOIN gender g ON a.gender_no = g.gender_no
    LEFT JOIN nationality n ON a.nationality_no = n.nationality_no
    WHERE 1=1
  `;

  const values = [];

  if (keyword) {
    actorQuery += " AND a.name LIKE ?";
    values.push(`%${keyword}%`);
  }

  if (gender) {
    actorQuery += " AND a.gender_no = ?";
    values.push(gender);
  }

  if (ageRange) {
    const ranges = {
      "10s": [10, 19],
      "20s": [20, 29],
      "30s": [30, 39],
      "40s": [40, 49],
      "50s": [50, 59],
      "60s": [60, 200],
    };
    const [min, max] = ranges[ageRange];
    actorQuery += `
      AND TIMESTAMPDIFF(YEAR, a.date_of_birth, CURDATE())
      BETWEEN ? AND ?
    `;
    values.push(min, max);
  }

  actorQuery += " ORDER BY a.actor_no, w.count_no";

  connection.query(actorQuery, values, (err, actorRows) => {
    if (err) return res.status(500).json({ error: "俳優検索失敗" });

    const actors = {};

    actorRows.forEach(r => {
      if (!actors[r.actor_no]) {
        actors[r.actor_no] = {
          actor_no: r.actor_no,
          name: r.name,
          date_of_birth: r.date_of_birth
            ? r.date_of_birth.toISOString().split("T")[0]
            : null,
          gender_no: r.gender_no,
          gender: r.gender,
          nationality_no: r.nationality_no,
          nationality: r.nationality,
          awards: [],
          movies: [],
          movieDetails: [],
          type: "actor",
        };
      }
      if (r.awards) actors[r.actor_no].awards.push(r.awards);
    });

    const actorList = Object.values(actors);
    const actorNos = actorList.map(a => a.actor_no);
    if (actorNos.length === 0) return res.json([]);

    const actorMovieQuery = `
      SELECT actor_no, movie_no
      FROM movie_actor
      WHERE actor_no IN (?)
    `;

    connection.query(actorMovieQuery, [actorNos], (err2, rows2) => {
      if (err2) return res.status(500).json({ error: "出演映画ID取得失敗" });

      rows2.forEach(r => {
        actors[r.actor_no]?.movies.push(r.movie_no);
      });

      const movieNos = [...new Set(rows2.map(r => r.movie_no))];
      if (movieNos.length === 0) return res.json(actorList);

      const movieQuery = `
        SELECT
          m.movie_no,
          m.title,
          m.image_path,
          c.category,
          m.relese_date,
          a.age_limit,
          g.genre
        FROM movie m
        JOIN category c ON m.category_no = c.category_no
        JOIN age_limit a ON m.age_limit_no = a.age_limit_no
        LEFT JOIN movie_genre mg ON m.movie_no = mg.movie_no
        LEFT JOIN genre g ON mg.genre_no = g.genre_no
        WHERE m.movie_no IN (?)
        ORDER BY m.movie_no
      `;

      connection.query(movieQuery, [movieNos], (err3, movieRows) => {
        if (err3) return res.status(500).json({ error: "出演映画詳細取得失敗" });

        const movieMap = {};

        movieRows.forEach(r => {
          if (!movieMap[r.movie_no]) {
            movieMap[r.movie_no] = {
              movie_no: r.movie_no,
              title: r.title,
              image_path: r.image_path,
              category: r.category,
              relese_date: r.relese_date
                ? r.relese_date.toISOString().split("T")[0]
                : null,
              age_limit: r.age_limit,
              genres: [],
            };
          }
          if (r.genre) movieMap[r.movie_no].genres.push(r.genre);
        });

        const movieList = Object.values(movieMap);

        actorList.forEach(actor => {
          actor.movieDetails = movieList.filter(m =>
            actor.movies.includes(m.movie_no)
          );
        });

        res.json(actorList);
      });
    });
  });
});

// ==============================
// POST /api/movie/search
// ==============================
app.post('/api/movie/search', (req, res) => {
  const { keyword, genres, categories } = req.body;

  let sql = `
    SELECT
      m.movie_no,
      m.title,
      m.image_path,
      c.category,
      m.relese_date,
      a.age_limit,
      g.genre
    FROM movie m
    JOIN category c ON m.category_no = c.category_no
    JOIN age_limit a ON m.age_limit_no = a.age_limit_no
    LEFT JOIN movie_genre mg ON m.movie_no = mg.movie_no
    LEFT JOIN genre g ON mg.genre_no = g.genre_no
    WHERE 1=1
  `;

  const values = [];

  if (keyword) {
    sql += " AND m.title LIKE ?";
    values.push(`%${keyword}%`);
  }

  if (categories?.length) {
    sql += " AND m.category_no IN (?)";
    values.push(categories);
  }

  if (genres?.length) {
    sql += `
      AND m.movie_no IN (
        SELECT movie_no FROM movie_genre WHERE genre_no IN (?)
      )
    `;
    values.push(genres);
  }

  sql += " ORDER BY m.movie_no, g.genre_no";

  connection.query(sql, values, (err, rows) => {
    if (err) return res.status(500).json({ error: "映画検索失敗" });

    const moviesMap = {};

    rows.forEach(r => {
      if (!moviesMap[r.movie_no]) {
        moviesMap[r.movie_no] = {
          movie_no: r.movie_no,
          title: r.title,
          image_path: r.image_path,
          category: r.category,
          relese_date: r.relese_date
            ? r.relese_date.toISOString().split("T")[0]
            : null,
          age_limit: r.age_limit,
          genres: [],
          actors: [],
          type: "movie"
        };
      }
      if (r.genre && !moviesMap[r.movie_no].genres.includes(r.genre)) {
        moviesMap[r.movie_no].genres.push(r.genre);
      }
    });

    res.json(Object.values(moviesMap));
  });
});

// ==============================
// GET /api/movie
// ==============================
app.get('/api/movie', (req, res) => {
  const sql = `
    SELECT
      m.movie_no,
      m.title,
      m.image_path,
      c.category,
      m.relese_date,
      a.age_limit,
      g.genre
    FROM movie m
    JOIN category c ON m.category_no = c.category_no
    JOIN age_limit a ON m.age_limit_no = a.age_limit_no
    LEFT JOIN movie_genre mg ON m.movie_no = mg.movie_no
    LEFT JOIN genre g ON mg.genre_no = g.genre_no
    ORDER BY m.movie_no, g.genre_no;
  `;

  connection.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const movies = {};

    rows.forEach(r => {
      if (!movies[r.movie_no]) {
        movies[r.movie_no] = {
          movie_no: r.movie_no,
          title: r.title,
          image_path: r.image_path,
          category: r.category,
          relese_date: r.relese_date
            ? r.relese_date.toISOString().split("T")[0]
            : null,
          age_limit: r.age_limit,
          genres: [],
          actors: []
        };
      }
      if (r.genre && !movies[r.movie_no].genres.includes(r.genre)) {
        movies[r.movie_no].genres.push(r.genre);
      }
    });

    res.json(Object.values(movies));
  });
});

app.get("/api/actor", (req, res) => {
  const actorQuery = `
    SELECT 
      a.actor_no,
      a.name,
      a.date_of_birth,
      a.gender_no,
      g.gender,
      a.nationality_no,
      n.nationality,
      w.awards
    FROM actor a
    LEFT JOIN awards w ON a.actor_no = w.actor_no
    LEFT JOIN gender g ON a.gender_no = g.gender_no
    LEFT JOIN nationality n ON a.nationality_no = n.nationality_no
  `;

  connection.query(actorQuery, (err, actorRows) => {
    if (err) return res.status(500).json({ error: "俳優情報取得失敗" });

    const actors = {};
    actorRows.forEach(r => {
      if (!actors[r.actor_no]) {
        actors[r.actor_no] = {
          actor_no: r.actor_no,
          name: r.name,
          date_of_birth: r.date_of_birth
            ? r.date_of_birth.toISOString().split("T")[0]
            : null,
          gender_no: r.gender_no,
          gender: r.gender,
          nationality_no: r.nationality_no,
          nationality: r.nationality,
          awards: r.awards ? [r.awards] : [],
          movies: [] // { movie_no, image_path }
        };
      } else if (r.awards) {
        actors[r.actor_no].awards.push(r.awards);
      }
    });

    const actorIds = Object.keys(actors).map(id => Number(id));
    if (actorIds.length === 0) return res.json([]);

    // ★ movie.image_path を追加
    const actorMovieQuery = `
      SELECT 
        ma.actor_no,
        ma.movie_no,
        m.image_path
      FROM movie_actor ma
      LEFT JOIN movie m ON ma.movie_no = m.movie_no
      WHERE ma.actor_no IN (?)
    `;

    connection.query(actorMovieQuery, [actorIds], (err2, actorMovieRows) => {
      if (err2) return res.status(500).json({ error: "出演映画取得失敗" });

      actorMovieRows.forEach(r => {
        if (actors[r.actor_no]) {
          actors[r.actor_no].movies.push({
            movie_no: r.movie_no,
            image_path: r.image_path
          });
        }
      });

      res.json(Object.values(actors));
    });
  });
});




app.get('/api/movie/categories', (req, res) => {
  const query = `SELECT * FROM category`; // movie テーブルのカテゴリー列を取得
  connection.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: '取得に失敗しました' });
    // 結果を配列として返す
    const categories = results.map(r => ({ id: r.category_no, name: r.category }));
    res.json(categories);
  });
});

// ジャンルの表示用
app.get('/api/movie/genre', (req, res) => {
  const query = `SELECT * FROM genre`; // movie テーブルのカテゴリー列を取得
  connection.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: '取得に失敗しました' });
    // 結果を配列として返す
    const genres = results.map(r => ({ id: r.genre_no, name: r.genre }));
    res.json(genres);
  });
});

// サーバー起動
app.listen(3000, () =>
  console.log('Server running on http://localhost:3000')
);
