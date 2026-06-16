// ============================================
// services/commentService.js
// ============================================

const commentRepository = require('../repositories/commentRepository');
const movieRepository = require('../repositories/movieRepository');

const MAX_BODY_LENGTH = 1000;
const DEFAULT_PAGE_LIMIT = 20;

function stripHtml(text) {
  return (text || '').trim().replace(/<[^>]*>/g, '');
}

function parsePagination(query) {
  const page = parseInt(query.page, 10) || 1;
  const limit = Math.min(parseInt(query.limit, 10) || DEFAULT_PAGE_LIMIT, 100);
  return {
    page: Math.max(page, 1),
    limit,
    offset: (Math.max(page, 1) - 1) * limit,
  };
}

function listComments(movieId, query) {
  const id = parseInt(movieId, 10);
  if (!id || id <= 0) {
    return { error: 'Invalid movie_id', status: 400 };
  }

  const paginate = query.page || query.limit;
  if (paginate) {
    const { page, limit, offset } = parsePagination(query);
    const result = commentRepository.findByMovieId(id, { limit, offset });
    return {
      data: result.rows,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit) || 0,
      },
    };
  }

  const result = commentRepository.findByMovieId(id);
  return result.rows;
}

function createComment(user, { movie_id, body, rating, name, email }) {
  const movieId = parseInt(movie_id, 10);
  const cleanBody = stripHtml(body);

  if (!movieId || movieId <= 0) {
    return { error: 'Invalid movie_id', status: 400 };
  }
  if (!cleanBody) {
    return { error: 'Comment body cannot be empty', status: 400 };
  }
  if (cleanBody.length > MAX_BODY_LENGTH) {
    return { error: `Comment max ${MAX_BODY_LENGTH} characters`, status: 400 };
  }
  if (!movieRepository.exists(movieId)) {
    return { error: 'Movie not found', status: 404 };
  }

  let parsedRating = parseInt(rating, 10);
  if (isNaN(parsedRating)) {
    parsedRating = null;
  } else if (parsedRating < 1 || parsedRating > 5) {
    return { error: 'Rating score must be between 1 and 5', status: 400 };
  }

  const cleanName = (name || '').trim() || user.username;
  const cleanEmail = (email || '').trim() || user.email || 'no-email@example.com';

  const comment = commentRepository.create({
    movieId,
    userId: user.id,
    body: cleanBody,
    rating: parsedRating,
    name: cleanName,
    email: cleanEmail,
  });

  return { success: true, comment, status: 201 };
}


function deleteComment(user, commentId) {
  const id = parseInt(commentId, 10);
  if (!id || id <= 0) {
    return { error: 'Invalid id', status: 400 };
  }

  const comment = commentRepository.findById(id);
  if (!comment) {
    return { error: 'Comment not found', status: 404 };
  }

  const isOwner = comment.user_id === user.id;
  const isAdmin = user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return { error: 'Not authorized to delete this comment', status: 403 };
  }

  commentRepository.remove(id);
  return { success: true, deleted_id: id };
}

module.exports = {
  listComments,
  createComment,
  deleteComment,
};
