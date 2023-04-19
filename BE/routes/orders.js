const yup = require("yup");
const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
    validateSchema,
    loginProductSchema,
  } = require("../validation/employee");
const { Order } = require("../models/index");
const ObjectId = require("mongodb").ObjectId;
const { CONNECTION_STRING } = require("../constants/dbSettings");
const { default: mongoose } = require("mongoose");

const encodeToken = require("../helpers/orderHelper");

mongoose.set("strictQuery", false);
mongoose.connect(CONNECTION_STRING);

//POST TOKEN LOGIN ID
router.post(
    "/login/:id",
    validateSchema(loginProductSchema),
    async (req, res, next) => {
      try {
        const { _id } = req.body;
        const order = await Order.findById({ _id });
  
        console.log(order);
  
        if (!order) return res.status(404).send("khong tim thay");
  
        const token = encodeToken(order._id, order.status, order.description);
  
        res.send({
          token,
          payload: order,
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
        const order = await Order.findById(req.user._id);
  
        if (!order) return res.status(404).send({ message: "Not found" });
  
        res.status(200).json(order);
      } catch (err) {
        res.sendStatus(500);
      }
    }
  );



// Methods: POST / PATCH / GET / DELETE / PUT
// Get all
router.get("/", async (req, res, next) => {
  try {
    let results = await Order.find()
      .populate("customer")
      .populate("employee")
      .populate("orderDetails.product");
    res.send(results);
  } catch (err) {
    res.sendStatus(500);
  }
});

// Create new data
router.post("/", async function (req, res, next) {
  try {
    const data = req.body;
    const newItem = new Order(data);
    let result = await newItem.save();

    return res.send({ ok: true, message: "Created", result });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

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

        let found = await Order.findByIdAndDelete(id);

        if (found) {
          return res.send({ ok: true, result: found });
        }

        return res.status(410).send({ ok: false, message: "Object not found" });
      } catch (err) {
        return res.status(500).json({ error: err });
      }
    })
    .catch((err) => {
      return res
        .status(400)
        .json({
          type: err.name,
          errors: err.errors,
          message: err.message,
          provider: "yup",
        });
    });
});

router.patch("/:id", async function (req, res, next) {
  try {
    const id = req.params.id;
    const patchData = req.body;
    await Order.findByIdAndUpdate(id, patchData);

    res.send({ ok: true, message: "Updated" });
  } catch (error) {
    res.status(500).send({ ok: false, error });
  }
});



module.exports = router;
