const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const Documents = require("./models/Documents");
const { Items } = require("./models/Items");
const Orders = require("./models/Orders");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const multer = require("multer");
const app = express();
const bcrypt = require("bcrypt");
var corsOptions = {
  origin: "http://localhost:3001",
};
app.use;
app.use(express.json());
app.use(cors(corsOptions));
const dbURL =
  "mongodb+srv://rania03shelbayeh:rania_2003@minimart.cisnyiw.mongodb.net/MiniMart?retryWrites=true&w=majority";
mongoose
  .connect(dbURL, { useNewURLParser: true, useUnifiedTopology: true })
  .then((result) => {
    app.listen(3000);
    console.log("connected");
  })
  .catch((error) => {
    console.log(error);
  });
const verifyJWT = (req, res, next) => {
  const token = req.body.token;
  if (!token) {
    res.send("You need a token");
  } else {
    jwt.verify(token, "jwtSecret", (err, decoded) => {
      if (err) {
        res.json({ auth: false, msg: "you failed to authenticate" });
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  }
};
app.post("/isUserAuth", verifyJWT, (req, res) => {
  User.findById(req.userId).then((result) => {
    res.send({ status: true, msg: "You are authenticated", data: result });
  });
});

app.post("/addUser", (req, res) => {
  User.find({ email: req.body.email }).then((result) => {
    if (result.length === 0) {
      bcrypt.hash(req.body.pass, 10, (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({
            status: false,
            msg: "Error hashing password",
          });
        }

        const user = new User({
          role: "user",
          fullName: req.body.fullName,
          username: req.body.username,
          email: req.body.email,
          password: hashedPassword,
          profilePhoto: null,
        });

        user.save();
        res.send({
          status: true,
        });
      });
    } else {
      res.send({
        status: false,
        msg: "User with the same Email already exists",
      });
    }
  });
});
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync("./public", { recursive: true });
    cb(null, "./public");
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.replace(/\s+/g, "-");
    cb(null, fileName);
  },
});
const upload = multer({ storage }).single("file");
app.post("/uploads", upload, (req, res) => {
  const { file } = req;
  const newDocument = new Documents({ path: `./public/${file.originalname}` });
  newDocument
    .save()
    .then((document) => {
      res.json({ status: true, document });
    })
    .catch((error) => {
      res.status(500).json({ status: false, error: error.message });
    });
});
app.post("/update", (req, res) => {
  console.log(req.body);
  req.body.user.profilePhoto = req.body.fileId;
  User.findByIdAndUpdate(req.body.user._id, req.body.user).then((result) => {
    res.send(result);
    // console.log(result);
  });
});
app.post("/login", (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (!user) {
      return res.send({
        status: false,
        msg: "User not found !!",
      });
    }

    bcrypt.compare(req.body.pass, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({
          status: false,
          msg: "Error comparing passwords",
        });
      }

      if (isMatch) {
        const id = user._id;
        const token = jwt.sign({ id }, "jwtSecret", {
          expiresIn: 1800,
        });

        res.send({
          status: true,
          data: user,
          msg: "",
          token: token,
        });
      } else {
        res.send({
          status: false,
          msg: "Check your password",
        });
      }
    });
  });
});
app.post("/add-item", (req, res) => {
  Items.find({ itemName: req.body.itemName }).then((result) => {
    if (result.length === 0) {
      const newItem = new Items(req.body);
      newItem.save();
      res.send({
        status: true,
      });
    } else {
      res.send({
        status: false,
        msg: "Item with the same name already exists",
      });
    }
  });
});
app.post("/items/:category", (req, res) => {
  // console.log(req.body.nav);
  // console.log(req.params.category);
  Items.find({ itemCategory: req.params.category })
    .then((result) => {
      // console.log(result);
      res.send(result);
    })
    .catch((error) => {
      console.log(error);
    });
  // console.log(req.body);
});
app.post("/update-info", async (req, res) => {
  let uEmail = true,
    same = false;
  const currentUser = await User.findById(req.body._id);
  if (!currentUser) {
    return res.send({ status: false, msg: "User not found" });
  }
  if (req.body.email === currentUser.email) {
    same = true;
  }
  const usersWithNewEmail = await User.find({ email: req.body.email });
  if (!same) {
    if (usersWithNewEmail.length) {
      uEmail = false;
    }
    if (uEmail) {
      User.findByIdAndUpdate(req.body._id, req.body).then((result2) => {
        res.send({ status: true, result: req.body });
      });
    } else {
      res.send({
        status: false,
        msg: "User with the same Email already exists",
      });
    }
  } else {
    User.findByIdAndUpdate(req.body._id, req.body).then((result2) => {
      res.send({ status: true, result: req.body });
    });
  }
});
app.post("/order", (req, res) => {
  const orderItems = req.body.cartItems.map((cartItem) => ({
    itemPrice: cartItem.itemPrice,
    itemName: cartItem.itemName,
    img: cartItem.img,
    itemCounter: cartItem.itemCounter,
  }));

  const order = new Orders({
    userId: req.body.userId,
    items: orderItems,
    orderDate: new Date(),
    orderStatus: "Pending",
    total: req.body.total,
  });
  order.save();
});
app.post("/user-orders", (req, res) => {
  Orders.find({
    userId: req.body.id,
  }).then((result) => {
    if (!result.length) {
      res.send({ status: false, msg: "No Orders Yet!" });
    } else {
      res.send({ status: true, result });
    }
  });
});
app.get("/all-orders", (req, res) => {
  Orders.find().then((result) => {
    // console.log(result);
    if (!result.length) {
      res.send({ status: false, msg: "No Orders Yet!" });
    } else {
      res.send({ status: true, result });
    }
  });
});
app.post("/update-order-status", (req, res) => {
  const { orderId, newStatus } = req.body;
  Orders.findByIdAndUpdate(orderId, { $set: { orderStatus: newStatus } })
    .then((updatedOrder) => {
      if (!updatedOrder) {
        return res.send({ status: false, message: "Order not found" });
      }

      res.send({ status: true, result: updatedOrder });
    })
    .catch((error) => {
      res.send({ status: false, error: error.message });
    });
});

app.post("/download", (req, res) => {
  Documents.findById(req.body.id)
    .then((result) => {
      if (!result) {
        return res.status(404).send("Document not found");
      }
      res.download(result.path);
    })
    .catch((error) => {
      console.error("Error downloading document:", error);
      res.status(500).send("Internal Server Error");
    });
});
