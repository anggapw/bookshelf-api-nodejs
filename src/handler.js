const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, reading, finished, insertedAt, updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const params = request.query;

  const filterBookKeys = (data) => Object.values(data).map(({ id, name, publisher }) => ({ id, name, publisher }));

  if (params.name !== undefined) {
    const filterName = books.filter((book) => book.name.toLowerCase().includes(params.name.toLowerCase()));

    const response = h.response({
      status: 'success',
      data: {
        books: filterBookKeys(filterName),
      },
    });
    response.code(200);
    return response;
  }

  if (params.reading !== undefined) {
    if (params.reading === '0') {
      const readingFalse = books.filter((book) => book.reading === false);

      const response = h.response({
        status: 'success',
        data: {
          books: filterBookKeys(readingFalse),
        },
      });
      response.code(200);
      return response;
    }

    if (params.reading === '1') {
      const readingTrue = books.filter((book) => book.reading === true);

      const response = h.response({
        status: 'success',
        data: {
          books: filterBookKeys(readingTrue),
        },
      });
      response.code(200);
      return response;
    }
  }

  if (params.finished !== undefined) {
    if (params.finished === '0') {
      const finishedFalse = books.filter((book) => book.finished === false);

      const response = h.response({
        status: 'success',
        data: {
          books: filterBookKeys(finishedFalse),
        },
      });
      response.code(200);
      return response;
    }

    if (params.finished === '1') {
      const finishedTrue = books.filter((book) => book.finished === true);

      const response = h.response({
        status: 'success',
        data: {
          books: filterBookKeys(finishedTrue),
        },
      });
      response.code(200);
      return response;
    }
  }

  const response = h.response({
    status: 'success',
    data: {
      books: filterBookKeys(books),
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHGandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((x) => x.id === bookId)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler, getAllBooksHandler, getBookByIdHGandler, editBookByIdHandler, deleteBookByIdHandler,
};
