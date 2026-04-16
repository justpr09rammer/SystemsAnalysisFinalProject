import api from '../api/axios';

// ---- Quiz Service ----

export const quizService = {
    getAll: (page = 0, size = 20) =>
        api.get(`/quizzes?page=${page}&size=${size}`).then(r => r.data),

    getById: (quizId) =>
        api.get(`/quizzes/${quizId}`).then(r => r.data),

    getForBook: (bookId, page = 0) =>
        api.get(`/quizzes/book/${bookId}?page=${page}`).then(r => r.data),

    getMyQuizzes: (page = 0) =>
        api.get(`/quizzes/my-quizzes?page=${page}`).then(r => r.data),

    getMyAttempts: () =>
        api.get('/quizzes/my-attempts').then(r => r.data),

    getAttemptsForQuiz: (quizId) =>
        api.get(`/quizzes/${quizId}/attempts`).then(r => r.data),

    create: (data) =>
        api.post('/quizzes', data).then(r => r.data),

    submit: (quizId, answers) =>
        api.post(`/quizzes/${quizId}/submit`, { answers }).then(r => r.data),

    delete: (quizId) =>
        api.delete(`/quizzes/${quizId}`),
};

// ---- Discussion Service ----

export const discussionService = {
    getAll: (page = 0, size = 20, sortBy = 'createdAt', dir = 'desc') =>
        api.get(`/discussions?page=${page}&size=${size}&sortBy=${sortBy}&dir=${dir}`).then(r => r.data),

    getById: (discussionId) =>
        api.get(`/discussions/${discussionId}`).then(r => r.data),

    getByBook: (bookId, page = 0) =>
        api.get(`/discussions/book/${bookId}?page=${page}`).then(r => r.data),

    getByTopicType: (topicType, page = 0) =>
        api.get(`/discussions/topic/${topicType}?page=${page}`).then(r => r.data),

    search: (q, page = 0) =>
        api.get(`/discussions/search?q=${encodeURIComponent(q)}&page=${page}`).then(r => r.data),

    create: (data) =>
        api.post('/discussions', data).then(r => r.data),

    update: (discussionId, data) =>
        api.put(`/discussions/${discussionId}`, data).then(r => r.data),

    delete: (discussionId) =>
        api.delete(`/discussions/${discussionId}`),

    toggleClose: (discussionId) =>
        api.post(`/discussions/${discussionId}/close`).then(r => r.data),

    voteDiscussion: (discussionId, value) =>
        api.post(`/discussions/${discussionId}/vote?value=${value}`).then(r => r.data),

    // Posts
    createPost: (discussionId, data) =>
        api.post(`/discussions/${discussionId}/posts`, data).then(r => r.data),

    updatePost: (postId, data) =>
        api.put(`/discussions/posts/${postId}`, data).then(r => r.data),

    deletePost: (postId) =>
        api.delete(`/discussions/posts/${postId}`),

    markAccepted: (discussionId, postId) =>
        api.post(`/discussions/${discussionId}/posts/${postId}/accept`).then(r => r.data),

    votePost: (postId, value) =>
        api.post(`/discussions/posts/${postId}/vote?value=${value}`).then(r => r.data),
};
