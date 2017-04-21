# ElasticNodejs

## Khái niệm ElasticSearch
- ES là một Document Oriented Database, nó dùng các khái niệm khác với những database thông thường 
    * Index : chính là database
    * Shards : là một tập hợp các document của 1 index, một Index chia ra thành nhiều Shards để truy xuất , tìm kiếm nhanh hơn
    * Type : table
    * Document : là các record, hiển thị theo JSON format 
 #### Ưu điểm và nhược điểm :
  1. Ưu điểm :
    * ES có tốc độ thực thi rất tốt do có khả năng truy vấn song song (parallel) sử dụng các shards.
    * Support nhiều cơ chế searching 
    * Sắp xếp kết quả truy vấn theo Relevance dựa vào _score
  1. Nhược điểm :
    * Không thích hợp với môi trường database thường xuyên thay đổi dữ liệu
    * Không hỗ trợ Transaction => nên dùng song song với các database truyền thống khác
 ## Cài đặt
 ```
 yarn install elasticsearch
 ```
 ## Kết nối ES sever
 
 - Có 2 cách kết nối :
 + Cách 1 : String connection
 Kết nối tới ES sever với username : "root" , "password" : "changeme" , host : "localhost", port : 9200
 ```
const elasticsearch = require ('elasticsearch');

const elas = new elasticsearch.Client( {  
  hosts: [
    'https://root:changeme@localhost:9200/'
  ]
});
 ```
 Cách 2 : Object connection
 ```
const conf = {
    "protocol" : "http",
    "auth"     : "user:password", 
    "host"     : "localhost",
    "port"     : 9200
}

const client = new elasticsearch.Client ({  
    hosts: [conf]
});
 ```
 ## Tạo Index :
 Dùng Elasticsearch instance đã kết nối trước đó là "elas" để tạo Index với tên là "book_store"
 ```
    elas.indices.create ({
        index : "book_store"
    }, (err, res, status) => {
        console.log ("Created ", res);
    });
 ```
 => Kết quả : "Created book_store"
## Xoá Index
Xoá Index vừa tạo "book_store"
```
    elas.indices.delete ({
        index : "book_store"
    }, (err, res, status) => {
        console.log("Deleted ", res);
    });
```
=> Kết quả : "Deleted book_store"
## Thêm document vào index
- Ví dụ : thêm 1 object book có name là "Sherklock Homels", author là "Conan" vào Index là "book_store", và type là "all_books"  
```
let book = {
  name : "Sherklock Homels 2017",
  author : "Conan"
}

elas.index ({
        index : "book_store",
        type  : "all_books",
        id    : '1',
        body  : book
    }, (err, res, status) => {
        console.log ("Book added : " ,res);
    });
```
=> Kết quả : "Book added Sherklock Homels 2017"
Field "Id"  =  1 là id của document mới thêm vào, nếu ta không dùng id thì mặc định ES sẽ tạo một unique ID gồm một dãy ký tự cho chúng ta

## Searching
Giả sử để tìm book với name có chứa từ sherklock trong Index như đã tạo ở trên thì query như sau
```
elas.search ({
        index : "book_store",
        type  : "all_book",
        body  : {
            query : {
                match: { 'name' : "sherklock" }
            }
        }
    }, (err, res, status) => {
        let books = res.hits.hits;
        console.log ("Found : ", books.length);
        books.forEach ( (book) => {
            consold.log (book);
        });
    });
```
 => Kết quả : sẽ tìm được những sách có name chứa "sherklock" như book "SherkLock Homels 2017"
 
 ## Searching với operator (OR - AND)
* Operator : 
  * OR (default) : "name" có chứa "sherklock" hoặc "2017" đều được
  * AND : "name" phải chứa cả "sherklock" và "2017"
```
elas.search ({
        index : "book_store",
        type  : "all_book",
        body  : {
            query : {
                match: { 
                  'name' : {
                    'query' : "sherklock 2017",
                    'operator' : "AND"
                } }
            }
        }
    }, (err, res, status) => {
        let books = res.hits.hits;
        console.log ("Found : ", books.length);
        books.forEach ( (book) => {
            consold.log (book);
        });
    });

```

## Custom analyzer
- Để tìm kiếm linh hoặt hơn, chúng ta nên custom lại các analyzer của ES
* Một Index gồm 2 phần chính là :
  * "setting" : nơi để custom analyzer
  * "mapping" : mapping cấu trúc các document trong type của index, (setting "analyzer", "data type" cho fields )
  
 ```
  elas.indices.create({
     index: index,
     body: {
         "settings": {
             your custom analyzer
         },
         "mappings": {
             your mapping fields
         }
     }
 });
```
##### Custom analyzer gồm 3 parameters chính (chính là 3 bộ lọc theo tuần tự) : 
* "char_filter" : xử lý input ban đầu cho hợp lệ (ví dụ : xoá tất cả tag "html") trước khi chuyển qua "tokenizer" 
  * Các "Character Filters" thông dụng :
    * "html_strip" : xoá các ký tự html và decode html like "&amp" thành "&"
* "tokenizer" : Dựa vào input trả về từ "char-filter" , tách input string thành mảng chứa các terms 
  * Ví dụ : "Sport is good" => [ "Sport" , "is" , "good"]
  * Các tokenizer thông dụng : 
    * "standard" : mặc định
    * "whitespace" : tách các terms trong input string khi thấy "space" ký tự
* "filter" : xử lý các terms trả về từ "tokenizer"
  * Các filter thông dụng :
    * "lowercase" : đổi thành chữ thường hết 
    * "stop" : khi search bỏ qua những từ thông dụng như "is", "the", "are" ..
Ví dụ :
```
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
```
 
* Sau khi set Analysis xong thì mapping fields

```
"book_all": {
            "include_in_all": false,
            "properties": {
                "name": {
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
```
- "type" : kiểu dữ liệu của field (text, date, number)
- "include_in_all" : do đã set include_in_all : false , nên chỉ những field có "include_in_all" : true mới có thể searchable
- "analyzer" : analyzer dùng cho indexing time (khi lưu data nên lưu theo kiểu nào, mặc định là "standard")
- "search_analyzer" : analyzer dùng cho search time 
- "index" : gồm 2 giá trị "analyzed" và "not_analyzed"
  * "analyzed" (default) : mặc định dùng analyzer "standard"
  * "not_analyzer " : không analyse mà lưu và tìm chính xác giá trị
