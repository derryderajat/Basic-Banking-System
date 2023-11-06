const { PrismaClient, Prisma } = require(`@prisma/client`);
const { ResponseTemplate } = require("../../helper/template.helper");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();
const register = async (req, res, next) => {
  let { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json(ResponseTemplate(null, "Bad Request", "Incomplete data", false));
  }
  // Check if data is not duplicate
  try {
    let existUser = await prisma.users.findUnique({
      where: { email },
    });
    // check if email hasn't been used
    if (existUser) {
      return res
        .status(400)
        .json(
          ResponseTemplate(null, "Bad Request", "email already used!", false)
        );
    }
  } catch (error) {
    return res
      .status(500)
      .json(ResponseTemplate(null, "Internal Server Error", error, false));
  }
  const saltRounds = 10;
  const saltKey = process.env.SALT_KEY;

  // Generate a hash for the plaintext password
  try {
    const hashedPassword = await bcrypt.hash(
      saltKey + password + saltKey,
      saltRounds
    );
    let user = await prisma.users.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        role: role,
      },
    });

    return res.status(201).json(ResponseTemplate(null, "Created", null, true));
  } catch (error) {
    return res
      .status(500)
      .json(ResponseTemplate(null, "Internal Server Error", error, false));
  }
};

const login = async (req, res, next) => {
  try {
    let { email, password } = req.body;
    let user = await prisma.users.findUnique({
      where: { email },
    });

    // check if user is exist;
    if (!user) {
      return res
        .status(400)
        .json(
          ResponseTemplate(
            null,
            "Bad Request",
            "Invalid email or password!",
            false
          )
        );
    }
    const saltKey = process.env.SALT_KEY;
    // it should only passsword not saltKey + password + saltKey

    let isPasswordCorrect = await bcrypt.compare(
      saltKey + password + saltKey,
      user.password
    );

    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json(
          ResponseTemplate(
            null,
            "Bad Request",
            "Invalid email or password!",
            false
          )
        );
    }

    // create token

    let selectedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    // 1 day expired
    const tokenExpiration = 24 * 60 * 60;
    let token = jwt.sign(selectedUser, process.env.JWT_SECRET_KEY, {
      expiresIn: tokenExpiration,
      algorithm: "HS256",
    });
    return res
      .status(201)
      .json(ResponseTemplate({ selectedUser, token }, "Created", null, true));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};
