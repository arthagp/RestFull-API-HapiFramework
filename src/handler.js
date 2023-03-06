const { nanoid } = require("nanoid");
const notes = require("./notes.js");

const addNoteHandler = (request, h) => {
  // menginisialisasi request.body => client mengisi (title,tags,body)
  const { title, tags, body } = request.payload;

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  //membuat object
  const newNote = {
    title,
    tags,
    body,
    id,
    createdAt,
    updatedAt,
  };

  notes.push(newNote);
  // 1. object notes di tambahkan ke dalam notes, sehingga notes mempunyai objet (key, dan value);
  // 2. bagaimana cara mengetahui bawha apakah notes sudah berhasil masuk;
  // 3. membuat sebuah filter yang mana note.id sama dengan id = nanoid(16). panjang lebih dari 0

  //jika tidak ada kurawal di filter tersebut maka hanya berikut
  // const isSucces = notes.filter((note) => note.id === id).length > 0;
  const isSuccess =
    notes.filter((note) => {
      return note.id === id;
    }).length > 0;

  console.log(isSuccess);

  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Catatan berhasil ditambahkan",
      data: {
        noteId: id,
      },
    });
    response.code(201);
    // response.header('Access-Control-Allow-Origin', '*');
    return response;
  }
  const response = h.response({
    status: "fail",
    message: "Catatan gagal ditambahkan",
  });
  response.code(500);
  return response;
};

const getAllNotesHandler = () => ({
  status: "Succes",
  data: {
    notes,
  },
});

// jika kode di bawah sama saja dengan kode diatas
// const getAllNotesHandlerr = () => {
//   return {
//     status: "Succes",
//     data: {
//       notes,
//     },
//   };
// };

const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const note = notes.filter((n) => n.id === id)[0];

  if (note !== undefined) {
    return {
      status: "success",
      data: {
        note,
      },
    };
  }
  const response = h.response({
    status: "fail",
    message: "Catatan tidak ditemukan",
  });
  response.code(404);
  return response;
};

const editNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  //membuat req body
  const { title, tags, body } = request.payload;
  const updatedAt = new Date().toISOString();

  //menggunakan method findIndex
  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      //dibawah ini req.body
      title,
      tags,
      body,
      updatedAt,
    };
    const response = h.response({
      status: "success",
      message: "Catatan berhasil diperbarui",
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui catatan. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler
};
