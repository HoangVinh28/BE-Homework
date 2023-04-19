unwind : dữ liệu trả về là 1 object
group : trả về các object có dữ liệu không trùng nhau
match : tìm kiếm điều kiện thỏa mãn ( ví dụ : không có đơn đặt hàng : $size :0)
lookup : tìm kiếm dữ liệu từ bảng nào và các trường nào
project : "gọi dữ liệu ra theo các trường được liệt kê", lọc biến và gọi tên biến

subtract : trừ
multiply : nhân
divide : chia

$eq	So khớp các giá trị bằng với một giá trị đã chỉ định.
$gt Khớp các giá trị lớn hơn một giá trị đã chỉ định.
$gte	So khớp các giá trị lớn hơn hoặc bằng một giá trị đã chỉ định.
$in Khớp với bất kỳ giá trị nào được chỉ định trong một mảng.
$lt	Khớp các giá trị nhỏ hơn một giá trị đã chỉ định.
$lte So khớp các giá trị nhỏ hơn hoặc bằng một giá trị đã chỉ định.
$ne	So khớp với tất cả các giá trị không bằng một giá trị đã chỉ định.
$nin Không khớp với bất kỳ giá trị nào được chỉ định trong một mảng.

from: "products",  //bảng cần lấy dữ liệu
localField: "_id", // lấy id của bảng đang được gọi aggregate
foreignField: "categoryId", // lấy id trong cái bảng from tới
as: "products", //đặt tên

skip : vị trí bắt đầu lấy
push : nối thêm dữ liệu

.group({
        _id: "$total", //lấy các dữ liệu có total giống nhau
        orders: { $push: "$$ROOT" },  //$$ROOT : đại diện cho các object
      }) // nối thêm dữ liệu các object theo total giống nhau 

git fetch
git branch -r //kiem tra xem co bao nhieu nhanh
git checkout phuong2 // di chuyen qua nhanh phuong2
git checkout --b <name> //tao nhanh moi


page
search
debounce search

SSG : Server side generation
SSR : server side render
CSR : client side render //react

Build time | run time