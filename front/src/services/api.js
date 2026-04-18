import api from '../api/axios';

// ── Books ──────────────────────────────────────────────
export const bookService = {
    getAll: (page = 0, size = 20, sortBy = 'averageRating', dir = 'desc') =>
        api.get(`/books?page=${page}&size=${size}&sortBy=${sortBy}&dir=${dir}`),
    getById: (id) => api.get(`/books/${id}`),
    search: (q) => api.get(`/books/search?q=${encodeURIComponent(q)}`),
    getTopRated: (page = 0, size = 20) => api.get(`/books/top-rated?page=${page}&size=${size}`),
    getByGenre: (genreId, page = 0) => api.get(`/books/genre/${genreId}?page=${page}`),
    getByAuthor: (authorId, page = 0) => api.get(`/books/author/${authorId}?page=${page}`),
    getSimilar: (id, limit = 6) => api.get(`/books/${id}/similar?limit=${limit}`),
    getRecommendations: (limit = 20) => api.get(`/books/recommendations?limit=${limit}`),
    importFromOpenLibrary: (query, limit = 10) => api.post(`/books/import?query=${encodeURIComponent(query)}&limit=${limit}`),
    create: (data) => api.post('/books', data),
    update: (id, data) => api.put(`/books/${id}`, data),
    delete: (id) => api.delete(`/books/${id}`),
};

// ── Authors ───────────────────────────────────────────
export const authorService = {
    getAll: (page = 0) => api.get(`/authors?page=${page}`),
    getById: (id) => api.get(`/authors/${id}`),
    search: (q) => api.get(`/authors/search?q=${encodeURIComponent(q)}`),
    create: (data) => api.post('/authors', data),
    update: (id, data) => api.put(`/authors/${id}`, data),
    delete: (id) => api.delete(`/authors/${id}`),
};

// ── Genres ────────────────────────────────────────────
export const genreService = {
    getAll: () => api.get('/genres'),
    getById: (id) => api.get(`/genres/${id}`),
    create: (data) => api.post('/genres', data),
    update: (id, data) => api.put(`/genres/${id}`, data),
    delete: (id) => api.delete(`/genres/${id}`),
};

// ── Shelves ───────────────────────────────────────────
export const shelfService = {
    getMyShelves: () => api.get('/shelves'),
    getUserShelves: (userId) => api.get(`/shelves/user/${userId}`),
    getById: (id) => api.get(`/shelves/${id}`),
    getBooks: (shelfId) => api.get(`/shelves/${shelfId}/books`),
    create: (data) => api.post('/shelves', data),
    rename: (id, data) => api.patch(`/shelves/${id}`, data),
    delete: (id) => api.delete(`/shelves/${id}`),
    addBook: (shelfId, bookId) => api.post(`/shelves/${shelfId}/books/${bookId}`),
    removeBook: (shelfId, bookId) => api.delete(`/shelves/${shelfId}/books/${bookId}`),
    addToWantToRead: (bookId) => api.post(`/shelves/want-to-read/${bookId}`),
    addToCurrentlyReading: (bookId) => api.post(`/shelves/currently-reading/${bookId}`),
    markAsRead: (bookId) => api.post(`/shelves/read/${bookId}`),
};

// ── Reading Progress ──────────────────────────────────
export const progressService = {
    getMyProgress: () => api.get('/reading/progress'),
    getProgressForBook: (bookId) => api.get(`/reading/progress/${bookId}`),
    upsertProgress: (bookId, data) => api.post(`/reading/progress/${bookId}`, data),
    deleteProgress: (bookId) => api.delete(`/reading/progress/${bookId}`),
    getMyChallenges: () => api.get('/reading/challenges'),
    getChallengeForYear: (year) => api.get(`/reading/challenges/${year}`),
    createOrUpdateChallenge: (data) => api.post('/reading/challenges', data),
    syncChallenge: (year) => api.post(`/reading/challenges/${year}/sync`),
    deleteChallenge: (year) => api.delete(`/reading/challenges/${year}`),
};

// ── Reviews ───────────────────────────────────────────
export const reviewService = {
    getForBook: (bookId, page = 0) => api.get(`/reviews/book/${bookId}?page=${page}&sort=createdAt,desc`),
    getByUser: (userId, page = 0) => api.get(`/reviews/user/${userId}?page=${page}`),
    getMyReviews: (page = 0) => api.get(`/reviews/my-reviews?page=${page}`),
    getFollowingReviews: (page = 0) => api.get(`/reviews/following?page=${page}`),
    getById: (id) => api.get(`/reviews/${id}`),
    create: (bookId, data) => api.post(`/reviews/book/${bookId}`, data),
    update: (id, data) => api.put(`/reviews/${id}`, data),
    delete: (id) => api.delete(`/reviews/${id}`),
    like: (id) => api.post(`/reviews/${id}/like`),
    unlike: (id) => api.delete(`/reviews/${id}/like`),
};

// ── Social ────────────────────────────────────────────
export const socialService = {
    follow: (userId) => api.post(`/social/follow/${userId}`),
    unfollow: (userId) => api.delete(`/social/follow/${userId}`),
    isFollowing: (userId) => api.get(`/social/following/${userId}`),
    getFollowers: (userId, page = 0) => api.get(`/social/followers/${userId}?page=${page}`),
    getFollowing: (userId, page = 0) => api.get(`/social/following-list/${userId}?page=${page}`),
    getStats: (userId) => api.get(`/social/stats/${userId}`),
    getFeed: (page = 0) => api.get(`/social/feed?page=${page}`),
};

// ── Users ─────────────────────────────────────────────
export const userService = {
    getMyProfile: () => api.get('/users/my-profile'),
    changePassword: (data) => api.patch('/users/my-profile/password', data),
    deleteAccount: () => api.delete('/users/my-profile'),
    // Admin
    getAll: (page = 0) => api.get(`/users?page=${page}`),
    getById: (id) => api.get(`/users/${id}`),
    getStats: () => api.get('/users/stats/count'),
};