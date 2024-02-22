const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { createToken, verifyToken } = require("../utils/auth");
const { verify } = require("jsonwebtoken");

router.get("/user/:userEmail", async (req, res, next) => {
  console.log(req.params.userEmail);
  User.findById(req.params.userEmail)
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/signup", async (req, res, next) => {
  try {
    const { userEmail, userPassword, nickName, phoneNumber, birthDay } =
      req.body;
    console.log(req.body);

    const user = await User.signUp(
      userEmail,
      userPassword,
      nickName,
      phoneNumber,
      birthDay
    );
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(400);
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { userEmail, userPassword } = req.body;
    const user = await User.login(userEmail, userPassword);
    const tokenMaxAge = 60 * 60 * 24 * 3;
    const token = createToken(user, tokenMaxAge);

    user.token = token;

    res.cookie("authToken", token, {
      httpOnly: true,
      maxAge: tokenMaxAge * 1000,
    });
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(400);
    next(err);
  }
});

router.all("/logout", async (req, res, next) => {
  res.cookie("authToken", "", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.json({ message: "로그아웃 완료" });
});

async function authenticate(req, res, next) {
  let token = req.cookies.authToken;
  let headerToken = req.headers.authentication;
  if (!token && headerToken) {
    token = headerToken.split(" ")[1];
  }
  const user = verifyToken(token);
  req.user = user;

  if (!user) {
    const error = new Error("Authorization Failed");
    error.status = 403;

    next(error);
  }
  next();
}

router.get("/protected", authenticate, async (req, res, next) => {
  console.log(res.user);
  res.json({ data: "민감한 데이터" });
});

module.exports = router;
