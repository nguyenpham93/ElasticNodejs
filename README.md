# ElasticNodejs

## Khái niệm ElasticSearch
- ES là một Document Oriented Database, nó dùng các khái niệm khác với những database thông thường
  * Ví dụ : 
    * Index : chính là database
    * Shards : là một tập hợp các document của 1 index, một Index chia ra thành nhiều Shards để truy xuất , tìm kiếm nhanh hơn
    * Type : table
    * Document : là các record, hiển thị theo JSON format 
 #### Ưu điểm và nhược điểm :
  * Ưu điểm :
    * ES có tốc độ thực thi rất tốt do có khả năng truy vấn song song (parallel) sử dụng các shards.
    * Support nhiều cơ chế searching 
    * Sắp xếp kết quả truy vấn theo Relevance dựa vào _score
  * Nhược điểm :
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
  elas.indices.create ({
			index : index,
			body  : {
				"settings" : {your custom analyzer},
				"mappings" : {your mapping fields}
			}
		}, (err, result, status) => {
			cb (null, `Index ${result} was created`);
		});
  ```
  * Custom analyzer gồm những parameters chính : 
    * char_filter : thêm, sửa,xoá ký tự vào searching text để transform thành string hợp lệ trước khi chuyển qua "tokenizer" 
      * Vi
    * tokenizer : Dùng để tách 1 đoạn text thành một mảng các terms, 
      * Ví dụ : "Sport is good" => [ "Sport" , "is" , "good"]
      * Các tokenizer thông dụng : 
        * "standard" : mặc định
        * "whitespace" : tách các term trong text khi thấy "space" ký tự
  ```
  
  ```
 
