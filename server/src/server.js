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

// ----------------------------
// 日本語カスタムソート関数
// 漢字→ひらがな→カタカナ→英字 の順で比較
// ----------------------------
function customJapaneseSort(a, b) {
  const getTypePriority = str => {
    if (!str) return 4; // 空は最後
    const ch = str[0];
    if (ch.match(/[一-龯]/)) return 0; // 漢字
    if (ch.match(/[ぁ-ん]/)) return 1; // ひらがな
    if (ch.match(/[ァ-ヴー]/)) return 2; // カタカナ
    if (ch.match(/[A-Za-z]/)) return 3; // 英字
    return 4; // その他
  };

  const pa = getTypePriority(a);
  const pb = getTypePriority(b);

  if (pa !== pb) return pa - pb;
  return a.localeCompare(b, 'ja'); // 同じタイプなら日本語順
}

// ----------------------------
// 俳優検索（keyword/性別/年齢）
// ----------------------------
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
      a.image_path,
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

  connection.query(actorQuery, values, (err, actorRows) => {
    if (err) return res.status(500).json({ error: "俳優検索失敗" });

    const actors = {};
    actorRows.forEach(r => {
      if (!actors[r.actor_no]) {
        actors[r.actor_no] = {
          actor_no: r.actor_no,
          name: r.name,
          date_of_birth: r.date_of_birth ? r.date_of_birth.toISOString().split("T")[0] : null,
          gender_no: r.gender_no,
          gender: r.gender,
          nationality_no: r.nationality_no,
          image_path: r.image_path,
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
    // ★俳優名でソート
    actorList.sort((a, b) => customJapaneseSort(a.name, b.name));

    const actorNos = actorList.map(a => a.actor_no);
    if (actorNos.length === 0) return res.json([]);

    // 出演映画ID取得
    const actorMovieQuery = `SELECT actor_no, movie_no FROM movie_actor WHERE actor_no IN (?)`;
    connection.query(actorMovieQuery, [actorNos], (err2, rows2) => {
      if (err2) return res.status(500).json({ error: "出演映画ID取得失敗" });

      rows2.forEach(r => {
        if (actors[r.actor_no]) actors[r.actor_no].movies.push(r.movie_no);
      });

      const movieNos = [...new Set(rows2.map(r => r.movie_no))];
      if (movieNos.length === 0) return res.json(actorList);

      // 出演映画詳細取得
      const movieQuery = `
        SELECT
          m.movie_no,
          m.title,
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
      `;
      connection.query(movieQuery, [movieNos], (err3, movieRows) => {
        if (err3) return res.status(500).json({ error: "出演映画詳細取得失敗" });

        const movieMap = {};
        movieRows.forEach(r => {
          if (!movieMap[r.movie_no]) {
            movieMap[r.movie_no] = {
              movie_no: r.movie_no,
              title: r.title,
              category: r.category,
              relese_date: r.relese_date ? r.relese_date.toISOString().split("T")[0] : null,
              age_limit: r.age_limit,
              genres: [],
            };
          }
          if (r.genre && !movieMap[r.movie_no].genres.includes(r.genre)) {
            movieMap[r.movie_no].genres.push(r.genre);
          }
        });

        const movieList = Object.values(movieMap);
        // ★映画タイトルでソート
        movieList.sort((a, b) => customJapaneseSort(a.title, b.title));

        // 俳優ごとに映画詳細を割り当て
        actorList.forEach(actor => {
          actor.movieDetails = movieList
            .filter(m => actor.movies.includes(m.movie_no))
            .sort((a, b) => customJapaneseSort(a.title, b.title)); // 念のため
        });

        res.json(actorList);
      });
    });
  });
});

// ----------------------------
// 映画検索
// ----------------------------
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
  if (keyword) { sql += " AND m.title LIKE ?"; values.push(`%${keyword}%`); }
  if (categories && categories.length) { sql += " AND m.category_no IN (?)"; values.push(categories); }
  if (genres && genres.length) { sql += ` AND m.movie_no IN (SELECT movie_no FROM movie_genre WHERE genre_no IN (?))`; values.push(genres); }

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
          relese_date: r.relese_date ? r.relese_date.toISOString().split("T")[0] : null,
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

    let movieResults = Object.values(moviesMap);
    // ★映画タイトルでソート
    movieResults.sort((a, b) => customJapaneseSort(a.title, b.title));

    const movieIds = movieResults.map(m => m.movie_no);
    if (movieIds.length === 0) return res.json([]);

    // 出演俳優ID取得
    const actorSql = `SELECT movie_no, actor_no FROM movie_actor WHERE movie_no IN (?)`;
    connection.query(actorSql, [movieIds], (err2, actorRows) => {
      if (err2) return res.status(500).json({ error: "俳優取得失敗" });

      actorRows.forEach(r => {
        if (moviesMap[r.movie_no] && !moviesMap[r.movie_no].actors.includes(r.actor_no)) {
          moviesMap[r.movie_no].actors.push(r.actor_no);
        }
      });

      res.json(movieResults);
    });
  });
});

// ----------------------------
// ここからは一覧取得系（俳優・映画・カテゴリ・ジャンル）
// ----------------------------
app.get("/api/actor", (req, res) => {
  const actorQuery = `
    SELECT a.actor_no, a.name, a.date_of_birth, a.gender_no, g.gender,
           a.nationality_no, a.image_path, n.nationality, w.awards
    FROM actor a
    LEFT JOIN awards w ON a.actor_no = w.actor_no
    LEFT JOIN gender g ON a.gender_no = g.gender_no
    LEFT JOIN nationality n ON a.nationality_no = n.nationality_no
  `;

  connection.query(actorQuery, (err, rows) => {
    if (err) return res.status(500).json({ error: "俳優情報取得失敗" });

    const actors = {};
    rows.forEach(r => {
      if (!actors[r.actor_no]) {
        actors[r.actor_no] = {
          actor_no: r.actor_no,
          name: r.name,
          date_of_birth: r.date_of_birth ? r.date_of_birth.toISOString().split("T")[0] : null,
          gender_no: r.gender_no,
          gender: r.gender,
          nationality_no: r.nationality_no,
          image_path: r.image_path,
          nationality: r.nationality,
          awards: r.awards ? [r.awards] : [],
          movies: []
        };
      } else if (r.awards) actors[r.actor_no].awards.push(r.awards);
    });

    let actorList = Object.values(actors);
    actorList.sort((a, b) => customJapaneseSort(a.name, b.name));

    const actorIds = actorList.map(a => a.actor_no);
    if (!actorIds.length) return res.json([]);

    const actorMovieQuery = `SELECT actor_no, movie_no FROM movie_actor WHERE actor_no IN (?)`;
    connection.query(actorMovieQuery, [actorIds], (err2, rows2) => {
      if (err2) return res.status(500).json({ error: "出演映画取得失敗" });

      rows2.forEach(r => {
        if (actors[r.actor_no]) actors[r.actor_no].movies.push(r.movie_no);
      });

      res.json(actorList);
    });
  });
});

app.get('/api/movie', (req, res) => {
  const sql = `
    SELECT m.movie_no, m.title, m.image_path, c.category, m.relese_date, a.age_limit, g.genre
    FROM movie m
    JOIN category c ON m.category_no = c.category_no
    JOIN age_limit a ON m.age_limit_no = a.age_limit_no
    LEFT JOIN movie_genre mg ON m.movie_no = mg.movie_no
    LEFT JOIN genre g ON mg.genre_no = g.genre_no
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
          relese_date: r.relese_date ? r.relese_date.toISOString().split("T")[0] : null,
          age_limit: r.age_limit,
          genres: [],
          actors: []
        };
      }
      if (r.genre && !movies[r.movie_no].genres.includes(r.genre)) {
        movies[r.movie_no].genres.push(r.genre);
      }
    });

    let movieResults = Object.values(movies);
    movieResults.sort((a, b) => customJapaneseSort(a.title, b.title));

    const movieIds = movieResults.map(m => m.movie_no);
    if (!movieIds.length) return res.json([]);

    const actorSql = `SELECT movie_no, actor_no FROM movie_actor WHERE movie_no IN (?)`;
    connection.query(actorSql, [movieIds], (err2, actorRows) => {
      if (err2) return res.status(500).json({ error: err2.message });

      actorRows.forEach(r => {
        if (movies[r.movie_no] && !movies[r.movie_no].actors.includes(r.actor_no)) {
          movies[r.movie_no].actors.push(r.actor_no);
        }
      });

      res.json(movieResults);
    });
  });
});

app.get('/api/movie/categories', (req, res) => {
  const query = `SELECT * FROM category`;
  connection.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: '取得に失敗しました' });
    res.json(results.map(r => ({ id: r.category_no, name: r.category })));
  });
});

app.get('/api/movie/genre', (req, res) => {
  const query = `SELECT * FROM genre`;
  connection.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: '取得に失敗しました' });
    res.json(results.map(r => ({ id: r.genre_no, name: r.genre })));
  });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
