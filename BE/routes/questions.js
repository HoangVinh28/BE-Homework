const express = require("express");
const router = express.Router();
const {
  Product,
  Customer,
  Order,
  Category,
  Supplier,
} = require("../models/index");

//cau1a
// http://localhost:9000/questions/1a?discount=10
router.get("/1a", function (req, res, next) {
  try {
    let param = req.query.discount;
    let query = { discount: { $lte: param } };
    Product.find(query)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

//cau1b
//http://localhost:9000/questions/1b?discount=10
router.get("/1b", function (req, res, next) {
  try {
    let param = req.query.discount;
    let query = { discount: { $lte: param } };
    Product.find(query)
      .populate("category")
      .populate("supplier")
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

//cau2a
//http://localhost:9000/questions/2a?stock=2000
router.get("/2a", function (req, res, next) {
  try {
    let stock = req.query.stock;
    let query = { stock: { $lte: stock } };
    Product.find(query)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

//cau2b
// http://localhost:9000/questions/2b?stock=2000
router.get("/2b", function (req, res, next) {
  try {
    let stock = req.query.stock;
    let query = { stock: { $lte: stock } };
    Product.find(query)
      .populate("category")
      .populate("supplier")
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

//cau3
//http://localhost:9000/questions/?price=40000000
router.get("/3", function (req, res, next) {
  try {
    const s = { $subtract: [100, "$discount"] }; //:-
    const m = { $multiply: ["$price", s] }; //:*
    const d = { $divide: [m, 100] }; //:/
    const { price } = req.query;
    let query = { $expr: { $lte: [d, parseFloat(price)] } };
    Product.find(query)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

//cau4
//http://localhost:9000/questions/4?address=Quang nam
router.get("/4", function (req, res, next) {
  try {
    const text = "Quang nam";
    const query = { address: new RegExp(`${text}`) };
    Customer.find(query)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

//cau5
//http://localhost:9000/questions/5?year=2002
router.get("/5", function (req, res, next) {
  try {
    const year = req.query.year;
    const query = {
      $expr: {
        $eq: [{ $year: "$birthday" }, year],
      },
    };

    Customer.find(query)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    res.sendStatus(500);
  }
});

//cau6
//http://localhost:9000/questions/6?date=2002-04-02
router.get("/6", function (req, res, next) {
  try {
    const date = req.query.date;
    const today = new Date(date);
    const eqDay = {
      $eq: [{ $dayOfMonth: "$birthday" }, { $dayOfMonth: today }],
    };
    const eqMonth = { $eq: [{ $month: "$birthday" }, { $month: today }] };

    const query = {
      $expr: {
        $and: [eqDay, eqMonth],
      },
    };

    Customer.find(query)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    res.sendStatus(500);
  }
});

//cau7
//http://localhost:9000/questions/7?status=WAITING
router.get("/7", function (req, res, next) {
  try {
    const { status } = req.query;
    /*   let status = "WAITING"; */
    Order.find({ status: status })
      .populate({
        path: "orderDetails.product",
        select: { name: 1, price: 1, discount: 1, stock: 1 },
      })
      .populate({ path: "customer", select: "firstName lastName" })
      .populate("employee")

      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

//cau8a

router.get("/8a", function (req, res, next) {
  try {
    let { status, date } = req.query;
    const fromDate = new Date(date);
    fromDate.setHours(0, 0, 0, 0);
    const toDate = new Date(new Date().setDate(fromDate.getDate() + 1));
    toDate.setHours(0, 0, 0, 0);

    const compareStatus = { $eq: ["$status", status] };
    const compareFromDate = { $gte: ["$shippedDate", fromDate] };
    const compareToDate = { $lt: ["$createdDate", toDate] };

    const query = {
      $expr: { $and: [compareStatus, compareFromDate, compareToDate] },
    };
    Order.find({ status: status })
      .populate({
        path: "orderDetails.product",
        select: { name: 1, price: 1, discount: 1, stock: 1 },
      })
      .populate({ path: "customer", select: "firstName lastName" })
      .populate("employee")

      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

//cau 9
//http://localhost:9000/questions/9?status=CANCELED
router.get("/9", function (req, res, next) {
  try {
    const { status } = req.query;
    Order.find({ status: status })
      .populate({
        path: "orderDetails.product",
        select: { name: 1, price: 1, discount: 1, stock: 1 },
      })
      .populate({
        path: "customers",
        select: "fistName, lastName",
      })
      .populate("employees")
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

//cau10
//http://localhost:9000/questions/10?status=CANCELED
router.get("/10", function (req, res, next) {
  try {
    let { status, date } = req.query;
    const fromDate = new Date(date);
    fromDate.setHours(0, 0, 0, 0);

    const toDate = new Date(new Date().setDate(fromDate.getDate() + 1));
    toDate.setHours(0, 0, 0, 0);

    const compareStatus = { $eq: ["$status", status] };
    const compareFromDate = { $gte: ["$createdDate", fromDate] };
    const compareToDate = { $lt: ["$createdDate", toDate] };

    const query = {
      $expr: { $and: [compareStatus, compareFromDate, compareToDate] },
    };

    Order.find(query)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

//cau 11
//http://localhost:9000/questions/11?paymentType=CASH
router.get("/11", function (req, res, next) {
  try {
    const { paymentType } = req.query;

    Order.find({ paymentType: paymentType })
      .populate({
        path: "orderDetails.product",
        select: { name: 1, price: 1, discount: 1, stock: 1 },
      })
      .populate({
        path: "customers",
        select: "fistName, lastName",
      })
      .populate("employees")
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400).send({ message: err.message });
      });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

//cau12

//cau 13
//http://localhost:9000/questions/13?address=Quang nam
router.get("/13", function (req, res, next) {
  try {
    let address = req.query.address;

    Order.aggregate()
      .lookup({
        from: "customers",
        localField: "customerId",
        foreignField: "_id",
        as: "customer",
      })
      .unwind("customer")
      .match({
        "customer.address": new RegExp(address),
      })
      .project({
        customerId: 0,
      })
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    res.sendStatus(500);
  }
});

//cau13
//http://localhost:9000/questions/13?address=Quang nam
router.get("/13", function (res, req, next) {
  try {
    const { address } = req.query;
    Order.aggregate()
      .lookup({
        from: "customers",
        localField: "customerId",
        foreignField: "_id",
        as: "customer",
      })
      .unwind("customer")
      .match({
        "customer.address": new RegExp(address),
      })
      .project({
        customerId: 0,
      })
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// cau 14
//http://localhost:9000/questions/14?birthday=2000-02-14T00:00:00.000Z
router.get("/14", function (req, res, next) {
  try {
    const { birthday } = res.query;
    Employee.find({ birthday: birthday })
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

//cau 15
//http://localhost:9000/questions/15?supplierNames=Apple&supplierNames=SONY
router.get("/15", function (req, res, next) {
  try {
    const { supplierName } = req.query;
    const query = {
      name: { $in: supplierName },
    };
    Supplier.find(query)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// cau 16
//http://localhost:9000/questions/16
router.get("/16", function (req, res, next) {
  try {
    Order.aggregate()
      .lookup({
        from: "customers",
        localField: "customerId",
        foreignField: "_id",
        as: "customer",
      })
      .unwind("customer")
      .project({
        customerId: 0,
      })
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

//cau17
router.get("/17", function (req, res, next) {
  try {
    Product.find()
      .populate("category")
      .populate("supplier")
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

//cau18
router.get("/18", function (req, res, next) {
  try {
    Category.aggregate()
      .lookup({
        from: "products",
        localField: "_id",
        foreignField: "categoryId",
        as: "products",
      })
      .unwind("products")
      .group({
        _id: "$_id",
        name: { $first: "$name" },
        description: { $first: "$description" },
        total: {
          $sum: "$products.stock",
        },
      })
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    res.sendStatus(500);
  }
});

//cau 19
router.get("/19", function (req, res, next) {
  try {
    Supplier.aggregate()
      .lookup({
        from: "products",
        localField: "_id",
        foreignField: "supplierId",
        as: "products",
      })
      .unwind("products")
      .group({
        _id: "$_id",
        name: "$first : $name",
        email: "$first : $email",
        phoneNumber: "$first : $phoneNumber",

        total: {
          $sum: "$products.stock",
        },
      })
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    res.sendStatus(500);
  }
});

//cau20
//http://localhost:9000/questions/20?fromDate=2023-03-22&toDate=2023-03-29
router.get("/20", function (req, res, next) {
  try {
    let { date } = req.query;
    const fromDate = new Date(date);
    fromDate.setHours(0, 0, 0, 0);
    const toDate = new Date(new Date().setDate(fromDate.getDate() + 1));
    toDate.setHours(0, 0, 0, 0);

    const compareFromDate = { $gte: ["$createdDate", fromDate] };
    const compareToDate = { $lt: ["$createdDate", toDate] };

    const query = {
      $expr: { $and: [compareFromDate, compareToDate] },
    };
    Order.aggregate()
      .match(query)
      /*  .unwind("orderDetails")
      .lookup({
        from: "products",
        localField: "_id",
        foreignField: "orderDetails.ProductId",
        as: "orderDetails.products",
      })

      .unwind("orderDetails.products")
      .group({
        _id: "$orderDetails.ProductId",
      }) */

      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    res.sendStatus(500);
  }
});

//cau 21
router.get("/21", function (req, res, next) {
  try {
    let { date } = req.query;
    const fromDate = new Date(date);
    fromDate.setHours(0, 0, 0, 0);
    const toDate = new Date(new Date().setDate(fromDate.getDate() + 1));
    toDate.setHours(0, 0, 0, 0);

    const compareFromDate = { $gte: ["$createdDate", fromDate] };
    const compareToDate = { $lt: ["$createdDate", toDate] };

    const query = {
      $expr: { $and: [compareFromDate, compareToDate] },
    };
    Order.aggregate()
      .match(query)
      .lookup({
        from: "customers",
        localField: "customerId",
        foreignField: "_id",
        as: "customer",
      })
      .unwind("customer")
      .group({
        _id: "$customer._id",
        firstName: { $first: "$customer.firstName" },
        lastName: { $first: "$customer.lastName" },
        email: { $first: "$customer.email" },
        phoneNumber: { $first: "$customer.phoneNumber" },
        address: { $first: "$customer.address" },
        birthday: { $first: "$customer.birthday" },
      })
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    res.sendStatus(500);
  }
});

//cau22
//http://localhost:9000/questions/22?fromDate=2023-03-27&toDate=2023-03-29
router.get("/22", async (req, res, next) => {
  try {
    let { date } = req.query;
    const fromDate = new Date(date);
    fromDate.setHours(0, 0, 0, 0);
    const toDate = new Date(new Date().setDate(fromDate.getDate() + 1));
    toDate.setHours(0, 0, 0, 0);

    const compareFromDate = { $gte: ["$createdDate", fromDate] };
    const compareToDate = { $lt: ["$createdDate", toDate] };

    const query = {
      $expr: { $and: [compareStatus, compareFromDate, compareToDate] },
    };
    Order.aggregate()
      .lookup({
        from: "customers",
        localField: "_id",
        foreignField: "customerId",
        as: "customer",
      })
      .match(query)
      .unwind("customer")
      .unwind("orderDetails")
      .addFields({
        originalPrice: {
          $divide: [
            {
              $multiply: [
                "$orderDetails.price",
                { $subtract: [100, "$orderDetails.discount"] },
              ],
            },
            100,
          ],
        },
      })
      .group({
        _id: "$customer._id",
        firstName: { $first: "$customer.firstName" },
        lastName: { $first: "$customer.lastName" },
        email: { $first: "$customer.email" },
        phoneNumber: { $first: "$customer.phoneNumber" },
        address: { $first: "$customer.address" },
        birthday: { $first: "$customer.birthday" },
        total_sales: {
          $sum: { $multiply: ["$originalPrice", "$orderDetails.quantity"] },
        },
      })
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (error) {
    res.sendStatus(500);
  }
});

//cau23 Hiển thị tất cả đơn hàng với tổng số tiền
router.get("/23", function (req, res, next) {
  try {
    Order.aggregate()
      .lookup({
        from: "orders",
        localField: "_id",
        foreignField: "orderDetails.productId",
        as: "orders",
      })
      .unwind("orderDetails")
      .addFields({
        originalPrice: {
          $divide: [
            {
              $multiply: [
                "$orderDetails.price",
                { $subtract: [100, "$orderDetails.discount"] },
              ],
            },
            100,
          ],
        },
      })
      .group({
        _id: "$orderDetails.productId",
        total_sales: {
          $sum: { $multiply: ["$originalPrice", "$orderDetails.quantity"] },
        },
      })
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    res.sendStatus(500);
  }
});

//cau 24 Hiển thị tất cả các nhân viên bán hàng với tổng số tiền bán được
router.get("/24", function (req, res, next) {
  try {
    Order.aggregate()
      .lookup({
        from: "employees",
        localField: "employeeId",
        foreignField: "_id",
        as: "employee",
      })
      .unwind("employee")
      .unwind("orderDetails")
      .addFields({
        originalPrice: {
          $divide: [
            {
              $multiply: [
                "$orderDetails.price",
                { $subtract: [100, "$orderDetails.discount"] },
              ],
            },
            100,
          ],
        },
      })
      .group({
        _id: "$employee._id",
        firstName: { $first: "$employee.firstName" },
        lastName: { $first: "$employee.lastName" },
        email: { $first: "$employee.email" },
        phoneNumber: { $first: "$employee.phoneNumber" },
        address: { $first: "$employee.address" },
        birthday: { $first: "$employee.birthday" },
        total_sales: {
          $sum: { $multiply: ["$originalPrice", "$orderDetails.quantity"] },
        },
      })
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    res.sendStatus(500);
  }
});

//cau25
//http://localhost:9000/questions/25
router.get("/25", async (req, res, next) => {
  try {
    Product.aggregate()
      .lookup({
        from: "orders",
        localField: "_id",
        foreignField: "orderDetails.productId",
        as: "orders",
      })
      .match({
        orders: { $size: 0 },
      })
      .project({
        id: 1,
        name: 1,
        price: 1,
        stock: 1,
      })
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (error) {
    res.sendStatus(500);
  }
});

//cau25b
//http://localhost:9000/questions/25b
router.get("/25b", async (req, res, next) => {
  try {
    Product.aggregate()
      .lookup({
        from: "orders",
        localField: "_id",
        foreignField: "orderDetails.productId",
        as: "orders",
      })
      .match({
        orders: { $size: 0 },
      })
      .project({
        id: 1,
        name: 1,
        price: 1,
        stock: 1,
      })
      .then((result) => {
        res.send({
          payload: result,
          total: result.length,
        });
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (error) {
    res.sendStatus(500);
  }
});

//cau 26a
// http://localhost:9000/questions/26a

router.get("/26a", async (req, res, next) => {
  try {
    Product.aggregate()
      .lookup({
        from: "orders",
        localField: "_id",
        foreignField: "orderDetails.productId",
        as: "orders",
      })
      .match({ orders: { $size: 0 } })
      .lookup({
        from: "suppliers",
        localField: "supplierId",
        foreignField: "_id",
        as: "suppliers",
      })
      .project({
        _id: 0,
        suppliers: 1,
      })
      .unwind({
        path: "$suppliers",
        preserveNullAndEmptyArrays: true,
      })
      .project({
        _id: "$suppliers._id",
        name: "$suppliers.name",
        email: "$suppliers.email",
        phoneNumber: "$suppliers.phoneNumber",
        address: "$suppliers.address",
      })
      .group({
        _id: "$_id",
        name: { $first: "$name" },
        phoneNumber: { $first: "$phoneNumber" },
        email: { $first: "$email" },
        address: { $first: "$address" },
      })

      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (error) {
    res.sendStatus(500);
  }
});

// Hiển thị tất cả các nhà cung cấp không bán được hàng (cú pháp khác)

router.get("/26b", async (req, res, next) => {
  try {
    Product.aggregate()
      .lookup({
        from: "orders",
        localField: "_id",
        foreignField: "orderDetails.productId",
        as: "orders",
      })
      .match({
        orders: { $size: 0 },
      })
      .lookup({
        from: "suppliers",
        localField: "supplierId",
        foreignField: "_id",
        as: "suppliers",
      })
      .project({
        _id: 0,
        suppliers: 1,
      })
      .unwind({
        path: "$suppliers",
        preserveNullAndEmptyArrays: true,
      })
      .addFields({
        _id: "$suppliers._id",
        name: "$suppliers.name",
        email: "$suppliers.email",
        phoneNumber: "$suppliers.phoneNumber",
        address: "$suppliers.address",
      })
      .project({
        suppliers: 0,
      })
      .group({
        _id: "$_id",
        name: { $first: "$name" },
        phoneNumber: { $first: "$phoneNumber" },
        email: { $first: "$email" },
        address: { $first: "$address" },
      })

      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (error) {
    res.sendStatus(500);
  }
});

// cau 26c
// http://localhost:9000/questions/26c?fromDate=2023-03-27&toDate=2023-03-29
router.get("/26c", async (req, res, next) => {
  try {
    let { fromDate, toDate } = req.query;
    fromDate = new Date(fromDate);

    const tmpToDate = new Date(toDate);
    toDate = new Date(tmpToDate.setDate(tmpToDate.getDate() + 1));

    Product.aggregate()
      .lookup({
        from: "orders",
        localField: "_id",
        foreignField: "orderDetails.productId",
        as: "orders",
      })
      .unwind({
        path: "$orders",
        preserveNullAndEmptyArrays: true,
      })
      .match({
        $or: [
          {
            $and: [
              { orders: { $ne: null } },
              {
                $or: [
                  { "orders.createdDate": { $lte: fromDate } },
                  { "orders.createdDate": { $gte: toDate } },
                ],
              },
            ],
          },
          {
            orders: null,
          },
        ],
      })
      .lookup({
        from: "suppliers",
        localField: "supplierId",
        foreignField: "_id",
        as: "suppliers",
      })
      .project({
        _id: 0,
        suppliers: 1,
      })
      .unwind({
        path: "$suppliers",
        preserveNullAndEmptyArrays: true,
      })
      .project({
        _id: "$suppliers._id",
        name: "$suppliers.name",
        email: "$suppliers.email",
        phoneNumber: "$suppliers.phoneNumber",
        address: "$suppliers.address",
      })
      .group({
        _id: "$_id",
        name: { $first: "$name" },
        phoneNumber: { $first: "$phoneNumber" },
        email: { $first: "$email" },
        address: { $first: "$address" },
      })

      .then((result) => {
        res.send({
          total: result.length,
          payload: result,
        });
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (error) {
    res.sendStatus(500);
  }
});

// cau 26d
//http://localhost:9000/questions/26d
router.get("/26b", async (req, res, next) => {
  try {
    Product.aggregate()
      .lookup({
        from: "orders",
        localField: "_id",
        foreignField: "orderDetails.productId",
        as: "orders",
      })
      .addFields({
        orders: { $size: "$orders" },
      })
      .match({
        orders: { $gt: 0 },
      })
      .lookup({
        from: "suppliers",
        localField: "supplierId",
        foreignField: "_id",
        as: "suppliers",
      })
      .project({
        _id: 0,
        suppliers: 1,
      })
      .unwind({
        path: "$suppliers",
        preserveNullAndEmptyArrays: true,
      })
      .project({
        _id: "$suppliers._id",
        name: "$suppliers.name",
        email: "$suppliers.email",
        phoneNumber: "$suppliers.phoneNumber",
        address: "$suppliers.address",
      })
      .group({
        _id: "$_id",
        name: { $first: "$name" },
        phoneNumber: { $first: "$phoneNumber" },
        email: { $first: "$email" },
        address: { $first: "$address" },
      })

      .then((result) => {
        res.send({ result });
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (error) {
    res.sendStatus(500);
  }
});

//cau 27
//http://localhost:9000/questions/27?fromDate=2023-03-20&toDate=2023-03-29
// hien thi top 3 nhan vien bans hang voi tong so tien ban duoc tu cao den thap
router.get("/27", function (req, res, next) {
  try {
    /* let { date } = req.query;
    const fromDate = new Date(date);
    fromDate.setHours(0, 0, 0, 0);
    const toDate = new Date(new Date().setDate(fromDate.getDate() + 1));
    toDate.setHours(0, 0, 0, 0);

    const compareFromDate = { $gte: ["$createdDate", fromDate] };
    const compareToDate = { $lt: ["$createdDate", toDate] };

    const query = {
      $expr: { $and: [compareFromDate, compareToDate] },
    }; */
    Order.aggregate()
      /*  .match(query) */
      .unwind("orderDetails")
      .lookup({
        from: "employees",
        localField: "employeeId",
        foreignField: "_id",
        as: "employees",
      })
      .unwind("employees")
      .addFields({
        originalPrice: {
          $divide: [
            {
              $multiply: [
                "$orderDetails.price",
                { $subtract: [100, "$orderDetails.discount"] },
              ],
            },
            100,
          ],
        },
      })
      .group({
        _id: "$employees._id",
        firstName: { $first: "$employees.firstName" },
        lastName: { $first: "$employees.lastName" },
        email: { $first: "$employees.email" },
        phoneNumber: { $first: "$employees.phoneNumber" },
        address: { $first: "$employees.address" },
        birthday: { $first: "$employees.birthday" },
        total: {
          $sum: { $multiply: ["$originalPrice", "$orderDetails.quantity"] },
        },
      })
      .sort({ total: -1 })
      .limit(2)
      .skip(0)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    res.sendStatus(500);
  }
});

//cau 28
//Hiển thị top 5 các khách hàng mua hàng với tổng số tiền mua được từ cao đến thấp trong khoảng từ ngày, đến ngày
//http://localhost:9000/questions/28?fromDate=2022-03-14&toDate=2023-03-29
router.get("/28", function (req, res, next) {
  try {
    /* let { date } = req.query;
    const fromDate = new Date(date);
    fromDate.setHours(0, 0, 0, 0);
    const toDate = new Date(new Date().setDate(fromDate.getDate() + 1));
    toDate.setHours(0, 0, 0, 0);

    const compareFromDate = { $gte: ["$createdDate", fromDate] };
    const compareToDate = { $lt: ["$createdDate", toDate] };

    const query = {
      $expr: { $and: [compareFromDate, compareToDate] },
    }; */
    Order.aggregate()
      /*  .match(query) */
      .unwind("orderDetails")
      .lookup({
        from: "customers",
        localField: "customerId",
        foreignField: "_id",
        as: "customers",
      })
      .unwind("customers")
      .addFields({
        originalPrice: {
          $divide: [
            {
              $multiply: [
                "$orderDetails.price",
                { $subtract: [100, "$orderDetails.discount"] },
              ],
            },
            100,
          ],
        },
      })
      .group({
        _id: "$customers._id",
        firstName: { $first: "$customers.firstName" },
        lastName: { $first: "$customers.lastName" },
        email: { $first: "$customers.email" },
        phoneNumber: { $first: "$customers.phoneNumber" },
        address: { $first: "$customers.address" },
        birthday: { $first: "$customers.birthday" },
        total: {
          $sum: { $multiply: ["$originalPrice", "$orderDetails.quantity"] },
        },
      })
      .sort({ total: -1 })
      .limit(5)
      .skip(0)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    res.sendStatus(500);
  }
});

//cau29
//Hiển thị danh sách các mức giảm giá của các sản phẩm
//http://localhost:9000/questions/29?discount=0
router.get("/29", function (req, res, next) {
  try {
    /*  let { discount } = req.query; */
    /*  Product.find({ discount: { $gt: discount } }) */
    Product.distinct("discount")
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    res.sendStatus(500);
  }
});

//cau30
//Hiển thị tất cả danh mục (Categories) với tổng số tiền bán được trong mỗi danh mục
//Neu lay trong product thi ko co so luong (quality)
// router.get("/30", function (req, res, next) {
//   try {
//     Order.aggregate()
//       .lookup({
//         from: "products",
//         localField: "orderDetails.productId",
//         foreignField: "_id",
//         as: "products",
//       })
//       .unwind("orderDetails")
//       .unwind("products")
//       .lookup({
//         from: "categories",
//         localField: "products.categoryId",
//         foreignField: "_id",
//         as: "categories",
//       })
//       .unwind("categories")
//       .addFields({
//         originalPrice: {
//           $divide: [
//             {
//               $multiply: [
//                 "$orderDetails.price",
//                 { $subtract: [100, "$orderDetails.discount"] },
//               ],
//             },
//             100,
//           ],
//         },
//       })
//       .group({
//         _id: "$categories._id",
//         name: { $first: "$categories.name" },
//         description: { $first: "$categories.description" },
//         total: {
//           $sum: { $multiply: ["$originalPrice", "$orderDetails.quantity"] },
//         },
//       })
//       .then((result) => {
//         res.send(result);
//       })
//       .catch((err) => {
//         res.status(400).send({ message: err.message });
//       });
//   } catch (err) {
//     res.sendStatus(500);
//   }
// });

router.get("/30", function (req, res, next) {
  try {
    Category.aggregate()
      .lookup({
        from: "products",
        localField: "_id",
        foreignField: "categoryId",
        as: "products",
      })
      .unwind({
        path: "$products",
        preserveNullAndEmptyArrays: true,
      })
      .lookup({
        from: "orders",
        localField: "products._id",
        foreignField: "orderDetails.productId",
        as: "orders",
      })
      .unwind({
        path: "$orders",
        preserveNullAndEmptyArrays: true,
      })
      .unwind({
        path: "$orders.orderDetails",
        preserveNullAndEmptyArrays: true,
      })
      .addFields({
        originalPrice: {
          $divide: [
            {
              $multiply: [
                "$orders.orderDetails.price",
                { $subtract: [100, "$orders.orderDetails.discount"] },
              ],
            },
            100,
          ],
        },
      })
      .group({
        _id: "$_id",
        name: { $first: "$name" },
        description: { $first: "$description" },
        total: {
          $sum: { $multiply: ["$originalPrice", "$orders.orderDetails.quantity"] },
        },
      })
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    res.sendStatus(500);
  }
});

// router.get("/30", function (req, res, next) {
//     try {
//       Order.aggregate()
//         .lookup({
//           from: "products",
//           localField: "orderDetails.productId",
//           foreignField: "_id",
//           as: "orderDetails.products",
//         })
//         .unwind("orderDetails")
//         .unwind("orderDetails.products")
//         .lookup({
//           from: "categories",
//           localField: "orderDetails.products.categoryId",
//           foreignField: "_id",
//           as: "orderDetails.products.categories",
//         })
//         .unwind("orderDetails.products.categories")
//         .addFields({
//           originalPrice: {
//             $divide: [
//               {
//                 $multiply: [
//                   "$orderDetails.price",
//                   { $subtract: [100, "$orderDetails.discount"] },
//                 ],
//               },
//               100,
//             ],
//           },
//         })
//         .group({
//           _id: "$orderDetails.products.categories._id",
//           name: { $first: "$orderDetails.products.categories.name" },
//           description: { $first: "$orderDetails.products.categories.description" },
//           total: {
//             $sum: { $multiply: ["$originalPrice", "$orderDetails.quantity"] },
//           },
//         })
//         .then((result) => {
//           res.send(result);
//         })
//         .catch((err) => {
//           res.status(400).send({ message: err.message });
//         });
//     } catch (err) {
//       res.sendStatus(500);
//     }
//   });

//cau31
//Hiển thị tất cả đơn hàng với tổng số tiền mà đã được giao hàng thành công trong khoảng từ ngày, đến ngày
//http://localhost:9000/questions/31??fromDate=2023-03-09T00:00:00.000Z&toDate=2023-04-02T00:00:00.000Z
router.get("/31", function (req, res, next) {
  try {
    /*  let { date } = req.query;
    const fromDate = new Date(date);
    fromDate.setHours(0, 0, 0, 0);
    const toDate = new Date(new Date().setDate(fromDate.getDate() + 1));
    toDate.setHours(0, 0, 0, 0);

    const compareFromDate = { $gte: ["$createdDate", fromDate] };
    const compareToDate = { $lt: ["$createdDate", toDate] };

    const query = {
      $expr: { $and: [compareFromDate, compareToDate] },
    }; */
    Order.aggregate()
      /*  .match(query) */
      .unwind("orderDetails")
      .match({ status: "WAITING" })
      .addFields({
        originalPrice: {
          $divide: [
            {
              $multiply: [
                "$orderDetails.price",
                { $subtract: [100, "$orderDetails.discount"] },
              ],
            },
            100,
          ],
        },
      })
      .group({
        _id: "$_id",
        createdDate: { $first: "$createdDate" },
        shippedDate: { $first: "$shippedDate" },
        status: { $first: "$status" },
        shippingAddress: { $first: "$shippingAddress" },
        description: { $first: "$description" },
        total: {
          $sum: { $multiply: ["$originalPrice", "$orderDetails.quantity"] },
        },
      })
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    res.sendStatus(500);
  }
});

//cau32
//Hiển thị tất cả đơn hàng có tổng số tiền bán hàng sắp xếp từ cao đến thấp trong khoảng từ ngày, đến ngày
router.get("/32", function (req, res, next) {
  try {
    /*  let { date } = req.query;
    const fromDate = new Date(date);
    fromDate.setHours(0, 0, 0, 0);
    const toDate = new Date(new Date().setDate(fromDate.getDate() + 1));
    toDate.setHours(0, 0, 0, 0);

    const compareFromDate = { $gte: ["$createdDate", fromDate] };
    const compareToDate = { $lt: ["$createdDate", toDate] };

    const query = {
      $expr: { $and: [compareFromDate, compareToDate] },
    }; */
    Order.aggregate()
      /*  .match(query) */
      .unwind("orderDetails")
      .addFields({
        originalPrice: {
          $divide: [
            {
              $multiply: [
                "$orderDetails.price",
                { $subtract: [100, "$orderDetails.discount"] },
              ],
            },
            100,
          ],
        },
      })
      .group({
        _id: "$_id",
        createdDate: { $first: "$createdDate" },
        shippedDate: { $first: "$shippedDate" },
        status: { $first: "$status" },
        shippingAddress: { $first: "$shippingAddress" },
        description: { $first: "$description" },
        total: {
          $sum: { $multiply: ["$originalPrice", "$orderDetails.quantity"] },
        },
      })
      .sort({ total: -1 })
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    res.sendStatus(500);
  }
});

//CAU33
//Hiển thị tất cả đơn hàng có tổng số tiền bán hàng ít nhất trong khoảng từ ngày, đến ngày
router.get("/33", function (req, res, next) {
  try {
    Order.aggregate()
      .unwind("orderDetails")
      .addFields({
        originalPrice: {
          $divide: [
            {
              $multiply: [
                "$orderDetails.price",
                { $subtract: [100, "$orderDetails.discount"] },
              ],
            },
            100,
          ],
        },
      })
      .group({
        _id: "$_id",
        createdDate: { $first: "$createdDate" },
        shippedDate: { $first: "$shippedDate" },
        status: { $first: "$status" },
        shippingAddress: { $first: "$shippingAddress" },
        description: { $first: "$description" },
        total: {
          $sum: { $multiply: ["$originalPrice", "$orderDetails.quantity"] },
        },
      })

      .group({
        _id: "$total",
        orders: { $push: "$$ROOT" },
      })

      .sort({ _id: 1 })
      .limit(1)

      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    res.sendStatus(500);
  }
});

//cau34
//Hiển thị trung bình cộng giá trị các đơn hàng trong khoảng từ ngày, đến ngày
router.get("/34", function (req, res, next) {
  try {
    Order.aggregate()
      .unwind("orderDetails")
      .addFields({
        originalPrice: {
          $divide: [
            {
              $multiply: [
                "$orderDetails.price",
                { $subtract: [100, "$orderDetails.discount"] },
              ],
            },
            100,
          ],
        },
      })
      .group({
        _id: "$_id",
        createdDate: { $first: "$createdDate" },
        shippedDate: { $first: "$shippedDate" },
        status: { $first: "$status" },
        shippingAddress: { $first: "$shippingAddress" },
        description: { $first: "$description" },
        total: {
          $sum: { $multiply: ["$originalPrice", "$orderDetails.quantity"] },
        },
      })
      .group({
        _id: null,
        avg: { $avg: "$total" },
      })
      .project({
        _id: 0,
        avg: 1,
      })

      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    res.sendStatus(500);
  }
});

module.exports = router;
