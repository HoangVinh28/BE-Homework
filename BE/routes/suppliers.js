const yup = require("yup");
const express = require("express");
const router = express.Router();
const passport = require("passport");

const { Supplier } = require("../models/index");
const ObjectId = require("mongodb").ObjectId;
const {
  validateSchema,
  loginSupplierSchema,
} = require("../validation/employee");

const { CONNECTION_STRING } = require("../constants/dbSettings");
const { default: mongoose } = require("mongoose");

const encodeToken = require("../helpers/supplierHelper");

mongoose.set("strictQuery", false);
mongoose.connect(CONNECTION_STRING);
/* const data = [
  { id: 1, name: "Apple", email: "apple@apple.com", country: "USA" },
  { id: 2, name: "Sony", email: "sony@sony.com", country: "JAPAN" },
  { id: 3, name: "Xiaomi", email: "xiaomi@xiaomi.com", country: "CHINA" },
]; */
/* const { write } = require("../helpers/FileHelper");
let data = require("../data/suppliers.json");
const fileName = "./data/suppliers.json"; */
// Methods: POST / PATCH / GET / DELETE / PUT

/* router.get("/", function (req, res, next) {
  res.send(data);
}); */

//GET ALL
router.get("/", async (req, res, next) => {
  try {
    let results = await Supplier.find();
    res.json(results);
  } catch (error) {
    res.status(500).json({ ok: false, error });
  }
});

//GET ID VALIDATE
router.get("/:id", async function (req, res, next) {
  // Validate
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
      const id = req.params.id;

      let found = await Supplier.findById(id);

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

//POST TOKEN
router.post(
  "/login",
  validateSchema(loginSupplierSchema),
  async (req, res, next) => {
   
    try {
      const { email } = req.body;
      const supplier = await Supplier.findOne({ email });

       /* console.log(supplier) */

      if (!supplier) return res.status(404).send("khong tim thay");

      const token = encodeToken(
        supplier._id,
        supplier.name,
        supplier.email,
        supplier.address,
      );

      res.send({
        token,
        payload: supplier,
      });
    } catch {
      res.send("error");
    }
  }
);

//GET TOKEN
router.get(
    "/profile/:id",
    passport.authenticate("jwt", { session: false }),
    async (req, res, next) => {
      try {
        console.log("sssss");
        const supplier = await Supplier.findById(req.user._id);

        if (!supplier) return res.status(404).send({ message: "Not found" });
  
        res.status(200).json(supplier);
      } catch (err) {
        console.log(err);
        res.sendStatus(500);
      }
    }
  );

// Create new data FILE
/* router.post("/", function (req, res, next) {
  // Validate
  const validationSchema = yup.object({
    body: yup.object({
      name: yup.string().required(),
      email: yup.string().email(),
      phoneNumber: yup.string(),
      address: yup.string(),
    }),
  });

  validationSchema
    .validate({ body: req.body }, { abortEarly: false })
    .then(() => {
      const newItem = req.body;

      // Get max id
      let max = 0;
      data.forEach((item) => {
        if (max < item.id) {
          max = item.id;
        }
      });
      
      newItem.id = max + 1;

      data.push(newItem);
     
      // Write data to file
      write(fileName, data);
     
      res.send({ ok: true, message: "Created" });
    })
    .catch((err) => {
      return res
        .status(400)
        .json({ type: err.name, errors: err.errors, provider: "yup" });
    });
   
}); */
router.post("/", async function (req, res, next) {
  // Validate
  const validationSchema = yup.object({
    body: yup.object({
      name: yup.string().required(),
      email: yup.string().email(),
      phoneNumber: yup.string(),
      address: yup.string(),
    }),
  });

  validationSchema
    .validate({ body: req.body }, { abortEarly: false })
    .then(async () => {
      try {
        const data = req.body;
        const newItem = new Supplier(data);
        let result = await newItem.save();

        return res.send({ ok: true, message: "Created", result });
      } catch (err) {
        return res.status(500).json({ error: err });
      }
    })
    .catch((err) => {
      return res
        .status(400)
        .json({ type: err.name, errors: err.errors, provider: "yup" });
    });
});

// DELETE DATA FILE
/* router.delete("/:id", function (req, res, next) {
  const id = req.params.id;
  data = data.filter((x) => x.id != id);

  res.send({ ok: true, message: "Deleted" });
}); */

// PATCH DATA FILE
/* router.patch("/:id", function (req, res, next) {
  const id = req.params.id;
  const patchData = req.body;

  let found = data.find((x) => x.id == id);

  if (found) {
    for (let propertyName in patchData) {
      found[propertyName] = patchData[propertyName];
    }
  }

  write(fileName, data);
  res.send({ ok: true, message: "Update" });
}); */

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

        let found = await Supplier.findByIdAndDelete(id);

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
    await Supplier.findByIdAndUpdate(id, patchData);

    res.send({ ok: true, message: "Updated" });
  } catch (error) {
    res.status(500).send({ ok: false, error });
  }
});

module.exports = router;
