const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
    const { title, tags, body } = request.payload;

    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();

    const newNote = {
        title, tags, body, id, createdAt, updatedAt,
    };

    notes.push(newNote);

    const isSuccess = notes.filter((note) => note.id === id).length > 0;
    let response;

    if (isSuccess) {
        response = h.response({
            status: 'success',
            message: 'Catatan berhasil ditambahkan',
            data: {
                noteId: id,
            },
        });
        response.code(201);
    } else {
        response = h.response({
            status: 'fail',
            message: 'Catatan gagal ditambahkan',
        });
        response.code(500);                
    }

    return response;
};

const getAllNotesHandler = (request, h) => ({
    status: 'success',
    data: {
        notes,
    },
});

const getNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const note = notes.filter((note) => note.id === id)[0];
    let response;

    if (note !== undefined) {
        response = h.response({
            status: 'success',
            data: {
                note,
            },
        });
    } else {
        response = h.response({
            status: 'fail',
            message: 'Catatan tidak ditemukan',
        });
        response.code(404);
    }

    return response;
};

const editNoteByIdHandler = (request, h) => {
    const { id } = request.params;
    const { title, tags, body } = request.payload;
    const updatedAt = new Date().toISOString();

    const index = notes.findIndex((note) => note.id === id);
    let response;

    if (index !== -1) {
        notes[index] = {
            ...notes[index],
            title,
            tags,
            body,
            updatedAt,
        };

        response = h.response({
            status: 'success',
            message: 'Catatan berhasil diperbarui',
        });
        response.code(200);
    } else {
        response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui catatan. Id tidak ditemukan',
        });
        response.status(404);
    }

    return response;
};

const deleteNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const index = notes.findIndex((note) => note.id === id);
    let response;

    if (index !== -1) {
        notes.splice(index, 1);
        response = h.response({
            status: 'success',
            message: 'Catatan berhasil dihapus',
        });
        response.code(200);
    } else {
        response = h.response({
            status: 'fail',
            message: 'Catatan gagal dihapus. Id tidak ditemukan',
        });
        response.code(404);
    }

    return response;
};

module.exports = { 
    addNoteHandler,
    getAllNotesHandler,
    getNoteByIdHandler,
    editNoteByIdHandler,
    deleteNoteByIdHandler,
};