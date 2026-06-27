// ============================================
// tests/api.test.js — Integration tests
// ============================================

const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const request = require('supertest');

const TEST_DB = path.join(__dirname, '../data/test.sqlite');
const TEST_SESSION = path.join(__dirname, '../data/test-sessions.sqlite');

process.env.NODE_ENV = 'test';
process.env.DATABASE_PATH = TEST_DB;
process.env.SESSION_DB_PATH = TEST_SESSION;
process.env.SESSION_SECRET = 'test_session_secret_at_least_32_chars!!';
process.env.LOG_LEVEL = 'silent';

function cleanup() {
  [TEST_DB, TEST_SESSION, `${TEST_DB}-wal`, `${TEST_DB}-shm`].forEach((f) => {
    try { if (fs.existsSync(f)) fs.unlinkSync(f); } catch { /* ignore */ }
  });
}

describe('Doraemon Wiki API', () => {
  let app;
  let agent;

  before(() => {
    cleanup();
    // eslint-disable-next-line global-require
    app = require('../src/server');
    // eslint-disable-next-line global-require
    const { runSeed } = require('../src/db/seed');
    runSeed();
    agent = request.agent(app);
  });

  after(() => {
    const { close } = require('../src/db/connection');
    close();
    cleanup();
  });

  it('GET /api/health returns ok', async () => {
    const res = await request(app).get('/api/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'ok');
    assert.equal(res.body.database, 'ok');
  });

  it('GET /api/movies returns 45 movies', async () => {
    const res = await request(app).get('/api/movies');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.equal(res.body.length, 45);
  });

  it('GET /api/movies?featured=true returns featured movies', async () => {
    const res = await request(app).get('/api/movies?featured=true');
    assert.equal(res.status, 200);
    assert.ok(res.body.every((m) => m.is_featured));
    assert.ok(res.body.length >= 6);
  });

  it('GET /api/movies?page=1&limit=10 returns pagination', async () => {
    const res = await request(app).get('/api/movies?page=1&limit=10');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.data));
    assert.equal(res.body.data.length, 10);
    assert.equal(res.body.pagination.total, 45);
  });

  it('GET /api/movies/:id returns movie detail', async () => {
    const res = await request(app).get('/api/movies/1');
    assert.equal(res.status, 200);
    assert.equal(res.body.id, 1);
    assert.ok(res.body.plot);
    assert.ok(res.body.box_office);
  });

  it('POST /api/auth/register and login flow', async () => {
    const reg = await agent
      .post('/api/auth/register')
      .send({ username: 'testuser1', email: 'test1@example.com', password: 'password123' });
    assert.equal(reg.status, 201);

    const login = await agent
      .post('/api/auth/login')
      .send({ usernameOrEmail: 'testuser1', password: 'password123' });
    assert.equal(login.status, 200);
    assert.equal(login.body.user.username, 'testuser1');

    const me = await agent.get('/api/auth/me');
    assert.equal(me.body.user.username, 'testuser1');
  });

  it('POST /api/comments requires login', async () => {
    const res = await request(app)
      .post('/api/comments')
      .send({ movie_id: 1, body: 'Great movie!' });
    assert.equal(res.status, 401);
  });

  it('comments CRUD with authenticated user', async () => {
    const userAgent = request.agent(app);
    await userAgent.post('/api/auth/register').send({
      username: 'commenter', email: 'c@example.com', password: 'password123',
    });
    await userAgent.post('/api/auth/login').send({
      usernameOrEmail: 'commenter', password: 'password123',
    });

    const create = await userAgent.post('/api/comments').send({
      movie_id: 1, body: 'Hello from test!',
    });
    assert.equal(create.status, 201);
    const commentId = create.body.comment.id;

    const list = await request(app).get('/api/comments?movie_id=1&page=1&limit=10');
    assert.equal(list.status, 200);
    assert.ok(list.body.data.some((c) => c.id === commentId));

    const del = await userAgent.delete(`/api/comments/${commentId}`);
    assert.equal(del.status, 200);
  });

  it('rejects non-https external URLs on update', async () => {
    const editorAgent = request.agent(app);
    await editorAgent.post('/api/auth/register').send({
      username: 'editor1', email: 'editor1@example.com', password: 'password123',
    });

    const { getDb } = require('../src/db/connection');
    getDb().prepare("UPDATE users SET role = 'editor' WHERE username = 'editor1'").run();

    await editorAgent.post('/api/auth/login').send({
      usernameOrEmail: 'editor1', password: 'password123',
    });

    const res = await editorAgent.patch('/api/movies/1/update').send({
      field: 'wiki_url', value: 'http://insecure.example.com',
    });
    assert.equal(res.status, 400);
  });

  it('POST /api/feedbacks submits feedback successfully', async () => {
    const res = await request(app)
      .post('/api/feedbacks')
      .send({
        name: 'Nguyen Van A',
        email: 'a@example.com',
        subject: 'Gop y thiet ke',
        message: 'Giao dien rat dep va hien dai.'
      });
    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.equal(res.body.feedback.name, 'Nguyen Van A');
  });

  it('admin routes require admin role', async () => {
    const userAgent = request.agent(app);
    // 1. Đăng ký tài khoản
    await userAgent.post('/api/auth/register').send({
      username: 'user2', email: 'user2@example.com', password: 'password123'
    });

    // Thử đăng nhập và gọi API (sẽ là role user bình thường)
    await userAgent.post('/api/auth/login').send({
      usernameOrEmail: 'user2', password: 'password123'
    });
    const statsRes = await userAgent.get('/api/admin/stats');
    assert.equal(statsRes.status, 403);

    // Đăng xuất tài khoản
    await userAgent.post('/api/auth/logout');

    // 2. Cập nhật role thành admin trong DB
    const { getDb } = require('../src/db/connection');
    getDb().prepare("UPDATE users SET role = 'admin' WHERE username = 'user2'").run();

    // 3. Đăng nhập lại (lúc này session sẽ chứa role admin mới)
    await userAgent.post('/api/auth/login').send({
      usernameOrEmail: 'user2', password: 'password123'
    });

    // 4. Kiểm tra lại quyền truy cập stats
    const statsRes2 = await userAgent.get('/api/admin/stats');
    assert.equal(statsRes2.status, 200);
    assert.ok('total_views' in statsRes2.body);
  });

  it('POST /api/movies permissions and creation', async () => {
    // 1. Chỉnh sửa vai trò thành user thường để test bị từ chối
    const { getDb } = require('../src/db/connection');
    getDb().prepare("UPDATE users SET role = 'user' WHERE username = 'user2'").run();

    // 2. Không đăng nhập -> bị chặn 401
    const anonAgent = request(app);
    const resAnon = await anonAgent.post('/api/movies').send({ title_vi: 'Phim test 1', release_year: 2024 });
    assert.equal(resAnon.status, 401);

    // 3. Đăng nhập quyền user thường -> bị chặn 403
    const userAgent = request.agent(app);
    await userAgent.post('/api/auth/login').send({ usernameOrEmail: 'user2', password: 'password123' });
    const resUser = await userAgent.post('/api/movies').send({ title_vi: 'Phim test 2', release_year: 2024 });
    assert.equal(resUser.status, 403);

    // 4. Đăng nhập quyền editor -> thành công 201
    getDb().prepare("UPDATE users SET role = 'editor' WHERE username = 'user2'").run();
    // Đăng nhập lại để cập nhật session
    await userAgent.post('/api/auth/logout');
    await userAgent.post('/api/auth/login').send({ usernameOrEmail: 'user2', password: 'password123' });

    const resEditor = await userAgent.post('/api/movies').send({
      title_vi: 'Phim Test Editor',
      title_jp: 'テスト映画',
      release_year: 2026,
      release_date: '2026-03-05',
      director: 'Kazuaki Imai',
      plot: 'Tóm tắt nội dung phim test.',
      is_featured: true
    });
    assert.equal(resEditor.status, 201);
    assert.equal(resEditor.body.success, true);
    assert.equal(resEditor.body.movie.title_vi, 'Phim Test Editor');
    assert.equal(resEditor.body.movie.release_year, 2026);
  });

  it('DELETE /api/movies/:id permissions and deletion', async () => {
    const { getDb } = require('../src/db/connection');
    const userAgent = request.agent(app);
    await userAgent.post('/api/auth/login').send({ usernameOrEmail: 'user2', password: 'password123' });

    // 1. Insert a temp movie for testing
    const dbInstance = getDb();
    const insertRes = dbInstance.prepare("INSERT INTO movies (title_vi, release_year) VALUES ('Temp Movie for Deletion', 2026)").run();
    const tempMovieId = insertRes.lastInsertRowid;

    // 2. Try deleting as anon user -> 401
    const anonAgent = request(app);
    const resAnon = await anonAgent.delete(`/api/movies/${tempMovieId}`);
    assert.equal(resAnon.status, 401);

    // 3. Try deleting as normal user -> 403
    dbInstance.prepare("UPDATE users SET role = 'user' WHERE username = 'user2'").run();
    await userAgent.post('/api/auth/logout');
    await userAgent.post('/api/auth/login').send({ usernameOrEmail: 'user2', password: 'password123' });
    const resUser = await userAgent.delete(`/api/movies/${tempMovieId}`);
    assert.equal(resUser.status, 403);

    // 4. Try deleting as editor -> 200 Success
    dbInstance.prepare("UPDATE users SET role = 'editor' WHERE username = 'user2'").run();
    await userAgent.post('/api/auth/logout');
    await userAgent.post('/api/auth/login').send({ usernameOrEmail: 'user2', password: 'password123' });
    const resEditor = await userAgent.delete(`/api/movies/${tempMovieId}`);
    assert.equal(resEditor.status, 200);
    assert.equal(resEditor.body.success, true);
    assert.equal(resEditor.body.deleted_id, tempMovieId);

    // Verify it is deleted
    const checkMovie = dbInstance.prepare("SELECT * FROM movies WHERE id = ?").get(tempMovieId);
    assert.ok(!checkMovie);
  });
});

