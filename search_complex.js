const elas = require('./connection');
const addDocument = require('./document_add');
const book = require('./model/book');

//TODO : To complex search, we need to configure Analyzer and Mapping Fields 

function createIndex (index) { 
		this.elas.indices.create ({
			index : index,
			body  : {
				"settings" : config_Analyzer(),
				"mappings" : config_Mapping_Fields()
			}
		}, (err, result, status) => {
			cb (null, `Index ${result} was created`);
		});
	}


/* Configure Analyzer */

function config_Analyzer() {
    return {
        "analysis": {
            "filter": {
                "my_filter": {
                    "type": "nGram",
                    "min_gram": 2,
                    "max_gram": 15,
                    "token_chars": ["letter", "digit", "punctuation", "symbol"]
                }
            },
            "analyzer": {
                "my_analyzer": {
                    "type": "custom",
                    "char_filter": ["html_strip"],
                    "tokenizer": "whitespace",
                    "filter": ['lowercase', "stop", "my_filter"]
                }
            }
        }
    }
}

/* Configure Mapping Fields */

function config_Mapping_Fields() {
    return {
        "book_all": {
            "include_in_all": false,
            "properties": {
                "book_name": {
                    "type": "text",
                    "include_in_all": true,
                    "analyzer": "my_analyzer",
                    "search_analyzer": "whitespace"
                },
                "author": {
                    "type": "text",
                    "index" : "not_analyzed",
                    "include_in_all": true,
                    "search_analyzer": "whitespace"
                }
            }
        }
    }
}

/* Search with analyzer */

function complex_search (index, type, term){
    elas.search ({
        index : index,
        type  : type,
        body  : {
            query : {
                match: { 
                    'book_name' : {
                        'query'    : term,
                        'operator' :  "AND"
                    } 
                }
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

//TODO : Demo search complex

let index = 'book_store';
let type  = 'all_book';
let books = [
    new book('B01', 'Sherklock Homels', 'Conan', 50.4),
    new book('B02', 'Docker In Action', 'Jeff Nickolof', 50.4),
    new book('B03', 'Postgres In Action', 'Conan', 50.4),
    new book('B04', 'Nodejs In Action', 'Conan', 50.4),
    new book('B05', 'Socket In Action', 'Conan', 50.4),
];

//TODO 
createIndex ('book_store');

books.forEach( (book) => {
    addDocument(index, type, book);
});

book.complex_search(index, type, 'Sherk');
