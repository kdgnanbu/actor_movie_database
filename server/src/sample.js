const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

let searchKey = "";

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log(searchKey);
  next(); // 次の処理に進む
});

app.post('/api/search', (req, res) => {
  searchKey = req.body;
  res.json(searchKey);
});

app.get('/api/search', (req, res) => {
  res.json(searchKey);
});


// DB 接続設定
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

connection.connect(err => {
  if (err) {
    console.error('接続エラー:', err);
    return;
  }
  console.log('MySQLに接続できました');
});


// ------------------------------
// 映画をマップ化して genre をまとめる共通関数
// ------------------------------
function groupMovies(rows, typeName = "movie") {
  const map = {};

  rows.forEach(row => {
    const id = row.movie_no;

    if (!map[id]) {
      map[id] = {
        movie_no: row.movie_no,
        title: row.title,
        category: row.category,
        relese_date: row.relese_date ? row.relese_date.toISOString().split("T")[0] : null,
        age_limit: row.age_limit,
        genres: [],
        type: typeName
      };
    }

    if (row.genre) {
      map[id].genres.push(row.genre);
    }
  });

  return Object.values(map);
}





// app.get('/api/search/result', (req, res) => {
//   const keyword = searchKey.keyword || "";
//   const genres = searchKey.genres || [];
//   const categories = searchKey.categories || [];

//   // ------------------------------
//   // 映画検索（キーワード, ジャンル, カテゴリー）
//   // ------------------------------
//   let movieQuery = `
//     SELECT
//       m.movie_no,
//       m.title,
//       c.category,
//       m.relese_date,
//       a.age_limit,
//       g.genre,
//       'movie' AS type
//     FROM movie m
//     JOIN category c ON m.category_no = c.category_no
//     JOIN age_limit a ON m.age_limit_no = a.age_limit_no
//     LEFT JOIN movie_genre mg ON m.movie_no = mg.movie_no
//     LEFT JOIN genre g ON mg.genre_no = g.genre_no
//     WHERE 1=1
//   `;
//   const values = [];

//   if (keyword) {
//     movieQuery += " AND m.title LIKE ?";
//     values.push(`%${keyword}%`);
//   }

//   if (categories.length > 0) {
//     movieQuery += " AND m.category_no IN (?)";
//     values.push(categories);
//   }

//   if (genres.length > 0) {
//     movieQuery += `
//       AND m.movie_no IN (
//         SELECT movie_no FROM movie_genre WHERE genre_no IN (?)
//       )
//     `;
//     values.push(genres);
//   }

//   movieQuery += " ORDER BY m.movie_no, g.genre_no";

//   connection.query(movieQuery, values, (err, movieRows) => {
//     if (err) return res.status(500).json({ error: "映画検索に失敗しました" });

//     const movieResults = groupMovies(movieRows, "movie");

//     // ------------------------------
//     // キーワードなし → 映画のみ返す
//     // ------------------------------
//     if (!keyword) {
//       return res.json(movieResults);
//     }

//     // ------------------------------
//     // 俳優検索
//     // ------------------------------
//     const actorQuery = `
//       SELECT 
//         a.actor_no,
//         a.name,
//         a.date_of_birth,
//         a.gender_no,
//         g.gender,
//         a.nationality_no,
//         n.nationality,
//         w.count_no,
//         w.awards,
//         'actor' AS type
//       FROM actor a
//       LEFT JOIN awards w ON a.actor_no = w.actor_no
//       LEFT JOIN gender g ON a.gender_no = g.gender_no
//       LEFT JOIN nationality n ON a.nationality_no = n.nationality_no
//       WHERE a.name LIKE ?
//       ORDER BY a.actor_no, w.count_no;
//     `;

//     connection.query(actorQuery, [`%${keyword}%`], (err2, actorRows) => {
//       if (err2) return res.status(500).json({ error: "俳優検索に失敗しました" });

//       // 俳優データまとめ
//       const actors = {};
//       actorRows.forEach(row => {
//         const id = row.actor_no;
//         if (!actors[id]) {
//           actors[id] = {
//             id: row.actor_no,
//             name: row.name,
//             date_of_birth: row.date_of_birth ? row.date_of_birth.toISOString().split("T")[0] : null,
//             gender_no: row.gender_no,
//             gender: row.gender,
//             nationality_no: row.nationality_no,
//             nationality: row.nationality,
//             awards: [],
//             type: "actor"
//           };
//         }
//         if (row.awards) actors[id].awards.push(row.awards);
//       });

//       const actorResults = Object.values(actors);
//       const actorIds = actorResults.map(a => a.id);

//       // 俳優がいなければ映画＋空俳優
//       if (actorIds.length === 0) {
//         return res.json([...movieResults, ...actorResults]);
//       }

//       // ------------------------------
//       // 俳優出演映画の movie_no を取得
//       // ------------------------------
//       const actorMovieQuery = `
//         SELECT movie_no
//         FROM movie_actor
//         WHERE actor_no IN (?)
//       `;

//       connection.query(actorMovieQuery, [actorIds], (err3, actorMovieRows) => {
//         if (err3) return res.status(500).json({ error: "出演映画の検索に失敗しました" });

//         const actorMovieNos = actorMovieRows.map(r => r.movie_no);

//         if (actorMovieNos.length === 0) {
//           return res.json([...movieResults, ...actorResults]);
//         }

//         // ------------------------------
//         // 出演映画の詳細取得（ジャンル含む）
//         // ------------------------------
//         const fullMovieQuery = `
//           SELECT
//             m.movie_no,
//             m.title,
//             c.category,
//             m.relese_date,
//             a.age_limit,
//             g.genre,
//             'movie' AS type
//           FROM movie m
//           JOIN category c ON m.category_no = c.category_no
//           JOIN age_limit a ON m.age_limit_no = a.age_limit_no
//           LEFT JOIN movie_genre mg ON m.movie_no = mg.movie_no
//           LEFT JOIN genre g ON mg.genre_no = g.genre_no
//           WHERE m.movie_no IN (?)
//           ORDER BY m.movie_no, g.genre_no;
//         `;

//         connection.query(fullMovieQuery, [actorMovieNos], (err4, fullRows) => {
//           if (err4) return res.status(500).json({ error: "出演映画の詳細取得に失敗しました" });

//           const actorMovies = groupMovies(fullRows, "movie");

//           // ------------------------------
//           // 映画検索結果と出演映画の重複を除外してマージ
//           // ------------------------------
//           const movieMap = {};
//           console.log(actorMovies);
//           console.log(movieResults);

//           movieResults.forEach(m => movieMap[m.movie_no] = m);
//           actorMovies.forEach(m => movieMap[m.movie_no] = m);

//           const finalMovies = Object.values(movieMap);
//           console.log(finalMovies);
//           console.log(actorResults);
//           res.json([...finalMovies, ...actorResults]);
//         });
//       });
//     });
//   });
// });




app.get("/api/search/result", (req, res) => {
  const keyword = searchKey.keyword || "";
  const genres = searchKey.genres || [];
  const categories = searchKey.categories || [];

  //=====================================================
  // 映画検索（keyword / genre / category）
  //=====================================================
  let movieQuery = `
    SELECT
      m.movie_no,
      m.title,
      c.category,
      m.relese_date,
      a.age_limit,
      g.genre,
      'movie' AS type
    FROM movie m
    JOIN category c ON m.category_no = c.category_no
    JOIN age_limit a ON m.age_limit_no = a.age_limit_no
    LEFT JOIN movie_genre mg ON m.movie_no = mg.movie_no
    LEFT JOIN genre g ON mg.genre_no = g.genre_no
    WHERE 1=1
  `;

  const movieValues = [];

  if (keyword) {
    movieQuery += " AND m.title LIKE ?";
    movieValues.push(`%${keyword}%`);
  }

  if (categories.length > 0) {
    movieQuery += " AND m.category_no IN (?)";
    movieValues.push(categories);
  }

  if (genres.length > 0) {
    movieQuery += `
      AND m.movie_no IN (
        SELECT movie_no FROM movie_genre WHERE genre_no IN (?)
      )
    `;
    movieValues.push(genres);
  }

  movieQuery += " ORDER BY m.movie_no, g.genre_no";

  connection.query(movieQuery, movieValues, (err, movieRows) => {
    if (err) return res.status(500).json({ error: "映画検索に失敗しました" });

    // 映画整形
    const movies = {};
    movieRows.forEach(r => {
      if (!movies[r.movie_no]) {
        movies[r.movie_no] = {
          movie_no: r.movie_no,
          title: r.title,
          category: r.category,
          relese_date: r.relese_date ? r.relese_date.toISOString().split("T")[0] : null,
          age_limit: r.age_limit,
          genres: [],
          type: "movie",
        };
      }
      if (r.genre) movies[r.movie_no].genres.push(r.genre);
    });

    const movieResults = Object.values(movies);

    // キーワードなし → 映画のみ返す
    if (!keyword) return res.json(movieResults);

    //=====================================================
    // 俳優検索
    //=====================================================
    const actorQuery = `
      SELECT 
        a.actor_no,
        a.name,
        a.date_of_birth,
        a.gender_no,
        g.gender,
        a.nationality_no,
        n.nationality,
        w.count_no,
        w.awards,
        'actor' AS type
      FROM actor a
      LEFT JOIN awards w ON a.actor_no = w.actor_no
      LEFT JOIN gender g ON a.gender_no = g.gender_no
      LEFT JOIN nationality n ON a.nationality_no = n.nationality_no
      WHERE a.name LIKE ?
      ORDER BY a.actor_no, w.count_no;
    `;

    connection.query(actorQuery, [`%${keyword}%`], (err2, actorRows) => {
      if (err2) return res.status(500).json({ error: "俳優検索に失敗しました" });

      // 俳優整形
      const actors = {};
      actorRows.forEach(r => {
        if (!actors[r.actor_no]) {
          actors[r.actor_no] = {
            id: r.actor_no,
            name: r.name,
            date_of_birth: r.date_of_birth ? r.date_of_birth.toISOString().split("T")[0] : null,
            gender_no: r.gender_no,
            gender: r.gender,
            nationality_no: r.nationality_no,
            nationality: r.nationality,
            awards: [],
            movies: [],         // ← 俳優ごとの出演映画IDを持つ
            movieDetails: [],   // ← 俳優ごとの出演映画の詳細
            type: "actor",
          };
        }
        if (r.awards) actors[r.actor_no].awards.push(r.awards);
      });

      const actorResults = Object.values(actors);

      // 俳優ID一覧
      const actorIds = actorResults.map(a => a.id);

      if (actorIds.length === 0) {
        return res.json([...movieResults, ...actorResults]);
      }

      //=====================================================
      // 俳優が出演している映画IDの取得
      //=====================================================
      const actorMovieQuery = `
        SELECT actor_no, movie_no
        FROM movie_actor
        WHERE actor_no IN (?)
      `;

      connection.query(actorMovieQuery, [actorIds], (err3, actorMovieRows) => {
        if (err3) return res.status(500).json({ error: "俳優出演映画の取得に失敗しました" });

        // 俳優ごとに出演映画IDを紐付け
        actorMovieRows.forEach(r => {
          const actor = actors[r.actor_no];
          if (actor) actor.movies.push(r.movie_no);
        });

        const allMovieNos = [...new Set(actorMovieRows.map(r => r.movie_no))];

        if (allMovieNos.length === 0) {
          return res.json([...movieResults, ...actorResults]);
        }

        //=====================================================
        // 出演映画の詳細データを取得
        //=====================================================
        let fullMovieQuery = `
          SELECT
            m.movie_no,
            m.title,
            c.category,
            m.relese_date,
            a.age_limit,
            g.genre,
            'actor_movie' AS type
          FROM movie m
          JOIN category c ON m.category_no = c.category_no
          JOIN age_limit a ON m.age_limit_no = a.age_limit_no
          LEFT JOIN movie_genre mg ON m.movie_no = mg.movie_no
          LEFT JOIN genre g ON mg.genre_no = g.genre_no
          WHERE m.movie_no IN (?)
        `;

        connection.query(fullMovieQuery, [allMovieNos], (err4, fullRows) => {
          if (err4) return res.status(500).json({ error: "出演映画詳細の取得に失敗しました" });

          const actorMovies = {};
          fullRows.forEach(r => {
            if (!actorMovies[r.movie_no]) {
              actorMovies[r.movie_no] = {
                movie_no: r.movie_no,
                title: r.title,
                category: r.category,
                relese_date: r.relese_date ? r.relese_date.toISOString().split("T")[0] : null,
                age_limit: r.age_limit,
                genres: [],
                type: "actor_movie",
              };
            }
            if (r.genre) actorMovies[r.movie_no].genres.push(r.genre);
          });

          const fullMovieList = Object.values(actorMovies);

          // 俳優ごとに映画詳細を割り当てる
          actorResults.forEach(actor => {
            actor.movieDetails = fullMovieList.filter(m =>
              actor.movies.includes(m.movie_no)
            );
          });

          // 映画（検索分）＋ 俳優（movieDetails付き）
          res.json([...movieResults, ...actorResults]);
        });
      });
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


// =======================
// 俳優データ API
// =======================







// 俳優情報取得
// app.get("/api/actor", (req, res) => {
//   const actorQuery = `
//     SELECT 
//       a.actor_no,
//       a.name,
//       a.date_of_birth,
//       a.gender_no,
//       g.gender,
//       a.nationality_no,
//       n.nationality,
//       w.awards
//     FROM actor a
//     LEFT JOIN awards w ON a.actor_no = w.actor_no
//     LEFT JOIN gender g ON a.gender_no = g.gender_no
//     LEFT JOIN nationality n ON a.nationality_no = n.nationality_no
//   `;

//   connection.query(actorQuery, (err, actorRows) => {
//     if (err) return res.status(500).json({ error: "俳優情報取得失敗" });

//     const actors = {};
//     actorRows.forEach(r => {
//       if (!actors[r.actor_no]) {
//         actors[r.actor_no] = {
//           actor_no: r.actor_no,
//           name: r.name,
//           date_of_birth: r.date_of_birth ? r.date_of_birth.toISOString().split("T")[0] : null,
//           gender_no: r.gender_no,
//           gender: r.gender,
//           nationality_no: r.nationality_no,
//           nationality: r.nationality,
//           awards: r.awards ? [r.awards] : [],
//           movies: [],
//           movieDetails: []
//         };
//       } else if (r.awards) {
//         actors[r.actor_no].awards.push(r.awards);
//       }
//     });

//     const actorIds = Object.keys(actors).map(id => Number(id));
//     if (actorIds.length === 0) return res.json([]);

//     // 俳優の出演映画IDを取得
//     const actorMovieQuery = `SELECT actor_no, movie_no FROM movie_actor WHERE actor_no IN (?)`;
//     connection.query(actorMovieQuery, [actorIds], (err2, actorMovieRows) => {
//       if (err2) return res.status(500).json({ error: "出演映画取得失敗" });

//       actorMovieRows.forEach(r => {
//         if (actors[r.actor_no]) actors[r.actor_no].movies.push(r.movie_no);
//       });

//       const allMovieNos = [...new Set(actorMovieRows.map(r => r.movie_no))];
//       if (allMovieNos.length === 0) return res.json(Object.values(actors));

//       // 映画詳細を取得
//       const movieQuery = `
//         SELECT 
//           m.movie_no,
//           m.title,
//           c.category,
//           m.relese_date,
//           a.age_limit,
//           g.genre
//         FROM movie m
//         JOIN category c ON m.category_no = c.category_no
//         JOIN age_limit a ON m.age_limit_no = a.age_limit_no
//         LEFT JOIN movie_genre mg ON m.movie_no = mg.movie_no
//         LEFT JOIN genre g ON mg.genre_no = g.genre_no
//         WHERE m.movie_no IN (?)
//         ORDER BY m.movie_no, g.genre_no
//       `;
//       connection.query(movieQuery, [allMovieNos], (err3, movieRows) => {
//         if (err3) return res.status(500).json({ error: "映画詳細取得失敗" });

//         const movies = {};
//         movieRows.forEach(r => {
//           if (!movies[r.movie_no]) {
//             movies[r.movie_no] = {
//               movie_no: r.movie_no,
//               title: r.title,
//               category: r.category,
//               relese_date: r.relese_date ? r.relese_date.toISOString().split("T")[0] : null,
//               age_limit: r.age_limit,
//               genres: [],
//             };
//           }
//           if (r.genre && !movies[r.movie_no].genres.includes(r.genre)) {
//             movies[r.movie_no].genres.push(r.genre);
//           }
//         });

//         // 俳優ごとに movieDetails を割り当て
//         Object.values(actors).forEach(actor => {
//           actor.movieDetails = actor.movies.map(mNo => movies[mNo]).filter(Boolean);
//         });

//         res.json(Object.values(actors));
//       });
//     });
//   });
// });
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
          date_of_birth: r.date_of_birth ? r.date_of_birth.toISOString().split("T")[0] : null,
          gender_no: r.gender_no,
          gender: r.gender,
          nationality_no: r.nationality_no,
          nationality: r.nationality,
          awards: r.awards ? [r.awards] : [],
          movies: []  // 出演映画IDだけ
        };
      } else if (r.awards) {
        actors[r.actor_no].awards.push(r.awards);
      }
    });

    const actorIds = Object.keys(actors).map(id => Number(id));
    if (actorIds.length === 0) return res.json([]);

    // 俳優の出演映画IDを取得
    const actorMovieQuery = `SELECT actor_no, movie_no FROM movie_actor WHERE actor_no IN (?)`;
    connection.query(actorMovieQuery, [actorIds], (err2, actorMovieRows) => {
      if (err2) return res.status(500).json({ error: "出演映画取得失敗" });

      actorMovieRows.forEach(r => {
        if (actors[r.actor_no]) actors[r.actor_no].movies.push(r.movie_no);
      });

      res.json(Object.values(actors)); // movieDetails は返さない
    });
  });
});




// =======================
// 映画データ API
// =======================
// app.get('/api/movie', (req, res) => {
//   const sql = `
// SELECT
//   m.movie_no,
//   m.title,
//   c.category,
//   m.relese_date,
//   a.age_limit,
//   g.genre
// FROM movie m
// JOIN category c ON m.category_no = c.category_no
// JOIN age_limit a ON m.age_limit_no = a.age_limit_no
// LEFT JOIN movie_genre mg ON m.movie_no = mg.movie_no
// LEFT JOIN genre g ON mg.genre_no = g.genre_no
// ORDER BY m.movie_no, g.genre_no;
//   `;

//   connection.query(sql, (err, rows) => {
//     if (err) return res.status(500).json({ error: err.message });

//     const result = {};

//     rows.forEach(row => {
//       const id = row.movie_no;

//       if (!result[id]) {
//         result[id] = {
//           movie_no: row.movie_no,
//           title: row.title,
//           category: row.category,
//           relese_date: row.relese_date
//             ? row.relese_date.toISOString().split("T")[0]
//             : null,
//           age_limit: row.age_limit,
//           genres: []
//         };
//       }

//       if (row.genre) {
//         result[id].genres.push(row.genre);
//       }
//     });

//     res.json(Object.values(result));
//   });

  
// });

app.get('/api/movie', (req, res) => {
  // 映画＋ジャンルを取得
  const sql = `
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
    ORDER BY m.movie_no, g.genre_no;
  `;

  connection.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const movies = {};

    rows.forEach(row => {
      const id = row.movie_no;

      if (!movies[id]) {
        movies[id] = {
          movie_no: row.movie_no,
          title: row.title,
          category: row.category,
          relese_date: row.relese_date
            ? row.relese_date.toISOString().split("T")[0]
            : null,
          age_limit: row.age_limit,
          genres: [],
          actors: []  // ← 追加
        };
      }

      if (row.genre && !movies[id].genres.includes(row.genre)) {
        movies[id].genres.push(row.genre);
      }
    });

    const movieIds = Object.keys(movies).map(id => Number(id));
    if (movieIds.length === 0) return res.json([]);

    // 映画ごとの出演俳優IDを取得
    const actorSql = `
      SELECT movie_no, actor_no
      FROM movie_actor
      WHERE movie_no IN (?)
    `;
    connection.query(actorSql, [movieIds], (err2, actorRows) => {
      if (err2) return res.status(500).json({ error: err2.message });

      actorRows.forEach(r => {
        if (movies[r.movie_no] && !movies[r.movie_no].actors.includes(r.actor_no)) {
          movies[r.movie_no].actors.push(r.actor_no);
        }
      });

      res.json(Object.values(movies));
    });
  });
});


// =======================
// サーバー起動
// =======================
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
