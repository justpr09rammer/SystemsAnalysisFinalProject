// import api from '../api/axios';
//
// export const bookService = {
//   // Corresponds to @GetMapping in BookController
//   getAllBooks: async (page = 0, size = 20) => {
//     const response = await api.get(`/books?page=${page}&size=${size}`);
//     return response.data;
//   },
//
//   // Corresponds to @GetMapping("/{bookId}")
//   getBookById: async (id) => {
//     const response = await api.get(`/books/${id}`);
//     return response.data;
//   },
//
//   // Corresponds to @GetMapping("/search")
//   searchBooks: async (query) => {
//     const response = await api.get(`/books/search?q=${query}`);
//     return response.data;
//   }
// };