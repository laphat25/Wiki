// ============================================
// db/seed.js — Seed movies and metadata
// ============================================

const { getDb, close } = require('./connection');
const { runMigrations } = require('./migrate');
const { getMoviesSeedData } = require('./seeds/movies-data');
const logger = require('../utils/logger');

function seedMovies() {
  const database = getDb();
  const movies = getMoviesSeedData();

  const upsert = database.prepare(`
    INSERT INTO movies (
      id, title_vi, title_jp, release_year, release_date, director,
      plot, image_url, trailer_url, wiki_url, streaming_url,
      box_office, theme_song, is_featured
    ) VALUES (
      @id, @title_vi, @title_jp, @release_year, @release_date, @director,
      @plot, @image_url, @trailer_url, @wiki_url, @streaming_url,
      @box_office, @theme_song, @is_featured
    )
    ON CONFLICT(id) DO UPDATE SET
      title_vi = excluded.title_vi,
      title_jp = excluded.title_jp,
      release_year = excluded.release_year,
      release_date = excluded.release_date,
      director = excluded.director,
      plot = excluded.plot,
      image_url = excluded.image_url,
      trailer_url = excluded.trailer_url,
      wiki_url = excluded.wiki_url,
      streaming_url = excluded.streaming_url,
      box_office = excluded.box_office,
      theme_song = excluded.theme_song,
      is_featured = excluded.is_featured
  `);

  const run = database.transaction(() => {
    for (const movie of movies) {
      upsert.run(movie);
    }
  });
  run();

  logger.info({ count: movies.length }, 'Movies seeded');
  return movies.length;
}

function runSeed() {
  runMigrations();
  return seedMovies();
}

if (require.main === module) {
  try {
    const count = runSeed();
    console.log(`✅ Seeded ${count} movies`);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  } finally {
    close();
  }
}

module.exports = { runSeed, seedMovies };
