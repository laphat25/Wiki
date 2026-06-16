// ============================================
// repositories/movieRepository.js
// ============================================

const db = require('../db/connection');

function normalizeMovie(row) {
  if (!row) return null;
  return {
    ...row,
    is_featured: Boolean(row.is_featured),
  };
}

function findAll({ q, featured, page, limit, offset }) {
  const conditions = [];
  const params = [];

  if (featured) {
    conditions.push('is_featured = 1');
  }

  if (q) {
    conditions.push(`(
      title_vi LIKE $1 COLLATE NOCASE
      OR title_jp LIKE $2 COLLATE NOCASE
      OR CAST(release_year AS TEXT) LIKE $3
      OR director LIKE $4 COLLATE NOCASE
    )`);
    const like = `%${q}%`;
    params.push(like, like, like, like);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  if (page && limit != null) {
    const { rows: countRows } = db.query(`SELECT COUNT(*) AS total FROM movies ${where}`, params);
    const total = countRows[0]?.total || 0;

    const limitIdx = params.length + 1;
    const offsetIdx = params.length + 2;
    const dataSql = `SELECT * FROM movies ${where} ORDER BY id ASC LIMIT $${limitIdx} OFFSET $${offsetIdx}`;
    const { rows } = db.query(dataSql, [...params, limit, offset]);

    return {
      rows: rows.map(normalizeMovie),
      total,
    };
  }

  const { rows } = db.query(`SELECT * FROM movies ${where} ORDER BY id ASC`, params);
  return { rows: rows.map(normalizeMovie), total: rows.length };
}

function findById(id) {
  const row = db.queryOne('SELECT * FROM movies WHERE id = $1', [id]);
  return normalizeMovie(row);
}

function exists(id) {
  const row = db.queryOne('SELECT id FROM movies WHERE id = $1 LIMIT 1', [id]);
  return Boolean(row);
}

function updateField(id, field, value) {
  const sql = `UPDATE movies SET ${field} = $1 WHERE id = $2`;
  db.query(sql, [value, id]);
  return findById(id);
}

function updateMovie(id, { title_vi, title_jp, release_year, release_date, director, plot, box_office, theme_song, is_featured }) {
  const sql = `
    UPDATE movies
    SET title_vi = $1, title_jp = $2, release_year = $3, release_date = $4,
        director = $5, plot = $6, box_office = $7, theme_song = $8, is_featured = $9
    WHERE id = $10
  `;
  db.query(sql, [
    title_vi, title_jp, parseInt(release_year, 10), release_date,
    director, plot, box_office, theme_song, is_featured ? 1 : 0, id
  ]);
  return findById(id);
}

function create({ title_vi, title_jp, release_year, release_date, director, plot, box_office, theme_song, is_featured, image_url = null }) {
  const sql = `
    INSERT INTO movies (title_vi, title_jp, release_year, release_date, director, plot, box_office, theme_song, is_featured, image_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  `;
  const result = db.query(sql, [
    title_vi, title_jp, parseInt(release_year, 10), release_date,
    director, plot, box_office, theme_song, is_featured ? 1 : 0, image_url
  ]);
  return findById(result.lastInsertRowid);
}

function remove(id) {
  db.query('DELETE FROM movies WHERE id = $1', [id]);
}

module.exports = {
  findAll,
  findById,
  exists,
  updateField,
  updateMovie,
  create,
  remove,
};


