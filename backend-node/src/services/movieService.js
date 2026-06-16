// ============================================
// services/movieService.js
// ============================================

const movieRepository = require('../repositories/movieRepository');
const { validateHttpsUrl } = require('../utils/urlValidation');

const ALLOWED_FIELDS = ['trailer_url', 'wiki_url', 'streaming_url'];

function parsePagination(query) {
  const page = parseInt(query.page, 10);
  const limit = parseInt(query.limit, 10);
  if (!page || !limit || page < 1 || limit < 1) return null;
  return {
    page,
    limit: Math.min(limit, 100),
    offset: (page - 1) * Math.min(limit, 100),
  };
}

function buildPaginationMeta(page, limit, total) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 0,
  };
}

function listMovies(query) {
  const q = (query.q || '').trim();
  const featured = query.featured === 'true' || query.featured === '1';
  const pagination = parsePagination(query);

  const result = movieRepository.findAll({
    q: q || undefined,
    featured: featured || undefined,
    page: pagination?.page,
    limit: pagination?.limit,
    offset: pagination?.offset,
  });

  if (pagination) {
    return {
      data: result.rows,
      pagination: buildPaginationMeta(pagination.page, pagination.limit, result.total),
    };
  }

  return result.rows;
}

function getMovieById(id) {
  const movieId = parseInt(id, 10);
  if (!movieId || movieId <= 0) {
    return { error: 'Invalid ID', status: 400 };
  }

  const movie = movieRepository.findById(movieId);
  if (!movie) {
    return { error: 'Movie not found', status: 404 };
  }
  return { movie };
}

function parseTrailerValue(value) {
  const trimmed = (value || '').trim();
  if (!trimmed) return null;

  const fullMatch = trimmed.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  const idOnly = /^[a-zA-Z0-9_-]{11}$/.test(trimmed);

  if (fullMatch) return fullMatch[1];
  if (idOnly) return trimmed;
  return { error: 'Invalid YouTube URL', status: 400 };
}

function updateMovieField(movieId, field, value) {
  const id = parseInt(movieId, 10);
  if (!id || id <= 0) {
    return { error: 'Invalid movie ID', status: 400 };
  }

  if (!ALLOWED_FIELDS.includes(field)) {
    return { error: `Field '${field}' is not allowed`, status: 400 };
  }

  if (!movieRepository.exists(id)) {
    return { error: 'Movie not found', status: 404 };
  }

  let dbValue = (value || '').trim() || null;

  if (field === 'trailer_url') {
    if (dbValue === null) {
      // allow clear
    } else {
      const parsed = parseTrailerValue(dbValue);
      if (parsed?.error) return parsed;
      dbValue = parsed;
    }
  }

  if ((field === 'wiki_url' || field === 'streaming_url') && dbValue) {
    const check = validateHttpsUrl(dbValue);
    if (!check.valid) {
      return { error: check.error, status: 400 };
    }
    dbValue = check.normalized;
  }

  movieRepository.updateField(id, field, dbValue);

  return {
    success: true,
    field,
    value: dbValue,
    message: `Updated ${field} successfully`,
  };
}

function updateMovie(id, data) {
  const movieId = parseInt(id, 10);
  if (!movieId || movieId <= 0) return { error: 'Invalid movie ID', status: 400 };
  if (!movieRepository.exists(movieId)) return { error: 'Movie not found', status: 404 };

  const title_vi = (data.title_vi || '').trim();
  if (!title_vi) return { error: 'Tiêu đề tiếng Việt không được để trống', status: 400 };

  const updated = movieRepository.updateMovie(movieId, {
    title_vi,
    title_jp: (data.title_jp || '').trim() || null,
    release_year: parseInt(data.release_year, 10) || 0,
    release_date: (data.release_date || '').trim() || null,
    director: (data.director || '').trim() || null,
    plot: (data.plot || '').trim() || null,
    box_office: (data.box_office || '').trim() || null,
    theme_song: (data.theme_song || '').trim() || null,
    is_featured: Boolean(data.is_featured),
  });

  return { success: true, movie: updated };
}

function createMovie(data) {
  const title_vi = (data.title_vi || '').trim();
  if (!title_vi) return { error: 'Tiêu đề tiếng Việt không được để trống', status: 400 };

  const release_year = parseInt(data.release_year, 10);
  if (!release_year || release_year < 1970) {
    return { error: 'Năm phát hành không hợp lệ (phải từ 1970 trở đi)', status: 400 };
  }

  const movie = movieRepository.create({
    title_vi,
    title_jp: (data.title_jp || '').trim() || null,
    release_year,
    release_date: (data.release_date || '').trim() || null,
    director: (data.director || '').trim() || null,
    plot: (data.plot || '').trim() || null,
    box_office: (data.box_office || '').trim() || null,
    theme_song: (data.theme_song || '').trim() || null,
    is_featured: Boolean(data.is_featured),
    image_url: '/assets/images/movies/poster.svg' // default poster
  });

  return { success: true, movie };
}

function deleteMovie(id) {
  const movieId = parseInt(id, 10);
  if (!movieId || movieId <= 0) return { error: 'Invalid movie ID', status: 400 };
  if (!movieRepository.exists(movieId)) return { error: 'Movie not found', status: 404 };

  movieRepository.remove(movieId);
  return { success: true, deleted_id: movieId };
}

module.exports = {
  listMovies,
  getMovieById,
  updateMovieField,
  updateMovie,
  createMovie,
  deleteMovie,
  ALLOWED_FIELDS,
};


