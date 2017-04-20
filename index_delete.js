const elas = require('./connection');

function deleteIndex (index){
    elas.indices.delete ({
        index : index
    }, (err, res, status) => {
        console.log("Deleted ", res);
    });
}

//TODO : demo delete index
deleteIndex('book_store');