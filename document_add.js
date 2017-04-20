const elas = require("./connection");

function addDocument (index, type, dcment) {
    elas.index ({
        index : index,
        type  : type,
        id    : '1',
        body  : dcment
    }, (err, res, status) => {
        console.log (res);
    });
}

//TODO : demo add document

let database = 'book_store';
let table    = 'all_book'
let book     = {
    'book_id' : 'B01',
    'book_name' : 'SherkLock Homels',
    'price'     : 50.4,
    'author'    : 'Arthur Conan Doyle'
};

// addDocument(database,table,book);

module.export = addDocument;