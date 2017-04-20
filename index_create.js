const elas = require("./connection");

// Index is like database
function createIndex (index) { 
    elas.indices.create ({
        index : index
    }, (err, res, status) => {
        console.log ("Created ", res);
    });        
}

createIndex ('book_store');