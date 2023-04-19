const yup = require("yup");
const passport = require("passport");
const express = require("express");

const { Employee } = require("../models/index");
const { CONNECTION_STRING } = require("../constants/dbSettings");
const { default: mongoose } = require("mongoose");
const { validateSchema, loginSchema } = require("../validation/employee");

const encodeToken = require("../helpers/jwtHelper");

mongoose.set("strictQuery", false);
mongoose.connect(CONNECTION_STRING);

const router = express.Router();
/* const data = [
  { id: 1, name: "Mary", email: "mary@gmail.com", gender: "female" },
  { id: 2, name: "Honda", email: "honda@gmail.com", gender: "male" },
  { id: 3, name: "Suzuki", email: "suzuki@gmail.com", gender: "male" },
]; */
// Methods: POST / PATCH / GET / DELETE / PUT
/* const { write } = require("../helpers/FileHelper");
let data = require("../data/employees.json");
const fileName = "./data/employees.json"; */

/* router.get("/", function (req, res, next) {
  res.send(data);
});
router.get("/:id", function (req, res, next) {
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

      return res.sendStatus(410);
    })
    .catch((err) => {
      return res
        .status(400)
        .json({ type: err.name, errors: err.errors, provider: "yup" });
    });
}); */

//post login token
router.post(
  "/login",
  validateSchema(loginSchema),
  passport.authenticate("local", { session: false }),
  async (req, res, next) => {
    try {
      const { email } = req.body;
      const employee = await Employee.findOne({ email });

      /*  console.log(employee) */

      if (!employee) return res.status(404).send("khong tim thay");

      const token = encodeToken(
        employee._id,
        employee.email,
        employee.birthday
      );

      res.send({
        token,
        payload: employee,
      });
    } catch {
      res.send("error");
    }
  }
);

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      console.log("sssss");
      const employee = await Employee.findById(req.user._id);

      if (!employee) return res.status(404).send({ message: "Not found" });

      res.status(200).json(employee);
    } catch (err) {
      res.sendStatus(500);
    }
  }
);

router.get("/", async (req, res, next) => {
  /*  res.send(data); */
  try {
    let results = await Employee.find();
    res.send(results);
  } catch (err) {
    res.sendStatus(500);
  }
});

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

      let found = await Employee.findById(id);

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

// Create new data
/* router.post("/", function (req, res, next) {
  const validationSchema = yup.object({
    body: yup.object({
      firstName: yup.string().required(),
      lastName: yup.string(),
      phoneNumber: yup.string(),
      address: yup.string(),
      email: yup.string().email(),
      birthday: yup.date(),
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
});
 */

router.post("/", async function (req, res, next) {
  // Validate
  const validationSchema = yup.object({
    body: yup.object({
      firstName: yup.string().required(),
      lastName: yup.string(),
      phoneNumber: yup.string(),
      address: yup.string(),
      email: yup.string().email(),
      birthday: yup.date(),
    }),
  });

  validationSchema
    .validate({ body: req.body }, { abortEarly: false })
    .then(async () => {
      try {
        console.log('req.body', req.body);

        const data = req.body;
        const newItem = new Employee(data);
        let result = newItem.save();

        console.log('result', result)

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

// Delete data
/* router.delete('/:id', function (req, res, next) {
    const id = req.params.id;
    data = data.filter((x) => x.id != id);
  
    res.send({ ok: true, message: 'Deleted' });
  }); */

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
    res.send({ ok: true, message: "Updated" });
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

        let found = await Employee.findByIdAndDelete(id);

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

router.patch("/:id", async function (req, res, next) {
  try {
    const id = req.params.id;
    const patchData = req.body;
    await Employee.findByIdAndUpdate(id, patchData);

    res.send({ ok: true, message: "Updated" });
  } catch (error) {
    res.status(500).send({ ok: false, error });
  }
});
module.exports = router;
