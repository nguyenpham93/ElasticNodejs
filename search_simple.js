const elas = require("./connection");

function simple_search (index, type, term){
    elas.search ({
        index : index,
        type  : type,
        body  : {
            query : {
                match: { 'book_name' : term }
            }
        }
    }, (err, res, status) => {
        let books = res.hits.hits;
        console.log ("Found : ", books.length);
        books.forEach ( (book) => {
            consold.log (book);
        });
    });
}

//TODO : demo search
simple_search ('book_store', 'all_book', 'SherkLock Homels');