const yup = require("yup");
const express = require("express");
const router = express.Router();
const passport = require("passport");

const { validateSchema, getProductsSchema } = require("../validation/product");
const { Product } = require("../models/index");
const ObjectId = require("mongodb").ObjectId;
const { CONNECTION_STRING } = require("../constants/dbSettings");
const { default: mongoose } = require("mongoose");

const encodeToken = require("../helpers/productHelper");

mongoose.set("strictQuery", false);
mongoose.connect(CONNECTION_STRING);

// Methods: POST / PATCH / GET / DELETE / PUT

// ------------------------------------------------------------------------------------------------
// GET ALL data
router.get("/", validateSchema(getProductsSchema), async (req, res, next) => {
  try {
    const {
      category,
      sup,
      product,
      skip,
      limit = 10,
      stockStart,
      stockEnd,
      priceStart,
      priceEnd,
      discountStart,
      discountEnd,
    } = req.query;

    const conditionFind = {};

    if (category) conditionFind.categoryId = category;
    if (sup) conditionFind.supplierId = sup;
    if (product) {
      conditionFind.name = new RegExp(`${product}`);
    }

    if (stockStart || stockEnd) {
      const stockGte = stockStart ? { $gte: stockStart } : {};
      const stockLte = stockEnd ? { $lte: stockEnd } : {};
      conditionFind.stock = {
        ...stockGte,
        ...stockLte,
        $exists: true,
      };
    }
    if (priceStart || priceEnd) {
      const priceGte = priceStart ? { $gte: priceStart } : {};
      const priceLte = priceEnd ? { $lte: priceEnd } : {};
      conditionFind.stock = {
        ...priceGte,
        ...priceLte,
        $exists: true,
      };
    }
    if (discountStart || discountEnd) {
      const discountGte = discountStart ? { $gte: discountStart } : {};
      const discountLte = discountEnd ? { $lte: discountEnd } : {};
      conditionFind.stock = {
        ...discountGte,
        ...discountLte,
        $exists: true,
      };
    }
    console.log("conditionFind", conditionFind);

    let results = await Product.find(conditionFind)
      .populate("category")
      .populate("supplier")
      .skip(skip)
      .limit(limit)
      .lean({ virtuals: true });

    const totalResults = await Product.countDocuments(conditionFind);

    res.json({
      payload: results,
      total: totalResults,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ ok: false, error });
  }
});

// GET ID data
router.get("/:id", function (req, res, next) {
  // Validate
  const validationSchema = yup.object().shape({
    params: yup.object({
      id: yup.number(),
    }),
  });

  validationSchema
    .validate({ params: req.params }, { abortEarly: false })
    .then(() => {
      const id = req.params.id;

      let found = data.find((x) => x.id == id);

      if (found) {
        return res.send({ ok: true, result: found });
      }

      return res.send({ ok: false, message: "Object not found" });
    })
    .catch((err) => {
      return res.status(400).json({
        type: err.name,
        errors: err.errors,
        message: err.message,
        provider: "yup",
      });
    });
});

//POST TOKEN LOGIN ID
router.post(
  "/login/:id",
  validateSchema(loginProductSchema),
  async (req, res, next) => {
    try {
      const { _id } = req.body;
      const product = await Product.findById({ _id });

      console.log(product);

      if (!product) return res.status(404).send("khong tim thay");

      const token = encodeToken(product._id, product.name, product.price);

      res.send({
        token,
        payload: product,
      });
    } catch {
      res.send("error");
    }
  }
);

//GET TOKEN PROFILE
router.get(
  "/profile/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const product = await Product.findById(req.user._id);

      if (!product) return res.status(404).send({ message: "Not found" });

      res.status(200).json(product);
    } catch (err) {
      res.sendStatus(500);
    }
  }
);

// ------------------------------------------------------------------------------------------------
//POST
router.post("/", function (req, res, next) {
  // Validate
  const validationSchema = yup.object({
    body: yup.object({
      name: yup.string().required(),
      price: yup.number().positive().required(),
      discount: yup.number().positive().max(50).required(),
      categoryId: yup
        .string()
        .required()
        .test("Validate ObjectID", "${path} is not valid ObjectID", (value) => {
          return ObjectId.isValid(value);
        }),
      supplierId: yup
        .string()
        .required()
        .test("Validate ObjectID", "${path} is not valid ObjectID", (value) => {
          return ObjectId.isValid(value);
        }),
      description: yup.string(),
    }),
  });

  validationSchema
    .validate({ body: req.body }, { abortEarly: false })
    .then(async () => {
      const data = req.body;
      let newItem = new Product(data);
      await newItem.save();
      res.send({ ok: true, message: "Created", result: newItem });
    })
    .catch((err) => {
      return res.status(400).json({
        type: err.name,
        errors: err.errors,
        message: err.message,
        provider: "yup",
      });
    });
});

// ------------------------------------------------------------------------------------------------
// Delete data
router.delete("/:id", function (req, res, next) {
  const validationSchema = yup.object().shape({
    params: yup.object({
      id: yup
        .string()
        .test("Validate ObjectID", "${path} is not valid ObjectID", (value) => {
          return ObjectId.isValid(value);
        }),
    }),
  });

  validationSchema
    .validate({ params: req.params }, { abortEarly: false })
    .then(async () => {
      try {
        const id = req.params.id;

        let found = await Product.findByIdAndDelete(id);

        if (found) {
          return res.send({ ok: true, result: found });
        }

        return res.status(410).send({ ok: false, message: "Object not found" });
      } catch (err) {
        return res.status(500).json({ error: err });
      }
    })
    .catch((err) => {
      return res.status(400).json({
        type: err.name,
        errors: err.errors,
        message: err.message,
        provider: "yup",
      });
    });
});

//--------------------------------------------------------------------------------------------------
// patch data
router.patch("/:id", async function (req, res, next) {
  try {
    const id = req.params.id;
    const data = req.body;
    await Product.findByIdAndUpdate(id, data);
    res.send({ ok: true, message: "Updated" });
  } catch (error) {
    res.status(500).send({ ok: false, error });
  }
});

module.exports = router;
