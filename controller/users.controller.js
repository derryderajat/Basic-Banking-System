const { PrismaClient, Prisma } = require("@prisma/client");
const Joi = require("joi");
const roles = require("../helper/roles");
const { ResponseTemplate } = require("../helper/template.helper");
const bcrypt = require("bcrypt");
require("dotenv").config();
const prisma = new PrismaClient();

const fetchUsers = async (req, res) => {
  const { page } = req.query;
  const { role } = req.user;

  // check if role is allowed in databases
  if (!(role in roles)) {
    return res
      .status(403)
      .json(
        ResponseTemplate(null, "Forbidden", "You are not allow in here", false)
      );
  }
  // Check if role execpt admin it will not allowed to access this endpoint
  if (role.toLowerCase() !== roles.admin) {
    return res
      .status(403)
      .json(
        ResponseTemplate(null, "Forbidden", "You are not allow in here", false)
      );
  }
  const pageNumber = parseInt(page) || 1;
  const itemsPerPage = 5;
  const skip = (pageNumber - 1) * itemsPerPage;
  // Get users count
  try {
    const totalRecords = await prisma.users.count();
    let users = await prisma.users.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
      where: {
        deleted_at: null,
      },
      orderBy: {
        name: "asc",
      },
      skip,
      take: itemsPerPage,
    });
    if (users.length === 0) {
      res
        .status(404)
        .json(ResponseTemplate(null, "Not Found", "Users is not found", false));
      return;
    } else {
      const totalPages = Math.ceil(totalRecords / itemsPerPage);
      const nextPage = pageNumber < totalPages ? pageNumber + 1 : null;
      const prevPage = pageNumber > 1 ? pageNumber - 1 : null;

      return res
        .status(200)
        .json(
          ResponseTemplate(
            { users, totalRecords, pageNumber, totalPages, nextPage, prevPage },
            "ok",
            null,
            true
          )
        );
    }
  } catch (error) {
    return res
      .status(500)
      .json(ResponseTemplate(null, "Internal Server Error", error, false));
  }
};

// get All Users Data By Id
const fetchUserById = async (req, res) => {
  const userId = parseInt(req.params.id);
  // console.log(req.user);
  const { id, role } = req.user;

  // check if role is allowed in databases
  if (!(role in roles)) {
    return res
      .status(403)
      .json(
        ResponseTemplate(null, "Forbidden", "You are not allow in here", false)
      );
  }
  // if role is customer only same id is allowed to see details
  if (id !== userId && role.toLowerCase() === roles.customer) {
    return res
      .status(403)
      .json(
        ResponseTemplate(null, "Forbidden", "You are not allow in here", false)
      );
  }
  try {
    const user = await prisma.users.findUnique({
      select: {
        id: true,
        name: true,
        email: true,
        profile: {
          select: {
            user_id: true,
            address: true,
            identity_type: true,
            identity_account_number: true,
          },
        },
      },
      where: {
        id: userId,
        deleted_at: null,
      },
    });

    if (user) {
      return res.status(200).json(ResponseTemplate(user, "ok", null, true));
    } else {
      return res
        .status(404)
        .json(ResponseTemplate(null, "Not Found", "User is not found", false));
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(ResponseTemplate(null, "Internal Server Error", error, false));
  }
};
// Update profile by its owner
const updateUserById = async (req, res) => {
  const userId = parseInt(req.params.id);
  const payload_user = {}; // Inisialisasi objek payload user
  const payload_profile = {}; // Inisialisasi objek payload profile
  const { id, role } = req.user;

  // check if role is allowed in databases
  if (!(role in roles)) {
    return res
      .status(403)
      .json(
        ResponseTemplate(null, "Forbidden", "You are not allow in here", false)
      );
  }
  // if role is customer only same id is allowed to see details
  if (id !== userId && role.toLowerCase() === roles.customer) {
    return res
      .status(403)
      .json(
        ResponseTemplate(null, "Forbidden", "You are not allow in here", false)
      );
  }
  if (req.body.name) {
    payload_user.name = req.body.name;
  }
  if (req.body.email) {
    payload_user.email = req.body.email;
  }
  if (req.body.identity_type) {
    payload_profile.identity_type = req.body.identity_type;
  }
  if (req.body.identity_account_number) {
    payload_profile.identity_account_number = req.body.identity_account_number;
  }
  if (req.body.address) {
    payload_profile.address = req.body.address;
  }

  try {
    const existingUser = await prisma.users.findUnique({
      where: {
        id: userId,
        deleted_at: null,
      },
    });
    // Check if user is exist
    if (!existingUser) {
      return res
        .status(404)
        .json(
          ResponseTemplate(null, "Sorry data is not found", null, "Not Found")
        );
    }

    // Update user data if there's body in its req
    if (
      Object.keys(payload_user).length ||
      Object.keys(payload_profile).length > 0
    ) {
      payload_user.updated_at = new Date();

      const existingProfile = await prisma.profiles.findUnique({
        where: {
          user_id: userId,
        },
      });

      if (existingProfile) {
        // Profil sudah ada, lakukan pembaruan
        const updatedUser = await prisma.users.update({
          where: {
            id: userId,
          },
          data: {
            ...payload_user,
            profile: {
              update: {
                identity_type: payload_profile.identity_type,
                identity_account_number:
                  payload_profile.identity_account_number,
                address: payload_profile.address,
                updated_at: payload_user.updated_at,
              },
            },
          },
          select: {
            id: true,
            name: true,
            email: true,
            profile: {
              select: {
                user_id: true,
                address: true,
                identity_type: true,
                identity_account_number: true,
              },
            },
          },
        });
        let respons = ResponseTemplate(updatedUser, "Created", null, true);
        console.log("Profil User berhasil diperbarui:", updatedUser);
        return res.status(201).json(respons);
      } else {
        // Profil belum ada, buat profil baru
        const newProfile = await prisma.profiles.create({
          data: {
            user_id: userId,
            ...payload_profile,
          },
        });
        let respons = ResponseTemplate(newProfile, "Created", null, true);
        console.log("Profil User berhasil dibuat:", newProfile);
        return res.status(201).json(respons);
      }
    } else {
      return res
        .status(400)
        .json(
          ResponseTemplate(
            null,
            "Bad Request",
            "No data provided for update",
            false
          )
        );
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(ResponseTemplate(null, "Internal Server Error", error, false));
  }
};

const insertOneUser = async (req, res) => {
  const {
    name,
    email,
    password,
    identity_type,
    identity_account_number,
    address,
  } = req.body;
  const { role } = req.user;

  // check if role is allowed in databases
  if (!(role in roles)) {
    return res
      .status(403)
      .json(
        ResponseTemplate(null, "Forbidden", "You are not allow in here", false)
      );
  }
  // Check if role execpt admin it will not allowed to access this endpoint
  if (role.toLowerCase() !== roles.admin) {
    return res
      .status(403)
      .json(
        ResponseTemplate(null, "Forbidden", "You are not allow in here", false)
      );
  }
  try {
    const saltRounds = 10;
    const saltKey = process.env.SALT_KEY;
    const hashedPassword = await bcrypt.hash(
      saltKey + password + saltKey,
      saltRounds
    );
    const newUser = await prisma.users.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        profile: {
          create: {
            identity_type,
            identity_account_number,
            address,
          },
        },
      },
      select: {
        name: true,
        email: true,
        profile: {
          select: {
            address:true,
            identity_account_number:true,
            identity_type:true,
          },
        },
      },
    });

    let respons = ResponseTemplate(newUser, "Created", null, true);
    return res.status(201).json(respons);
  } catch (error) {
    console.log(error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      let respErr = ResponseTemplate(
        null,
        "Bad request",
        "Duplicate User",
        false
      );
      return res.status(400).json(respErr); // Mengatur status ke 400 untuk kesalahan P2002
    } else {
      return res
        .status(500)
        .json(ResponseTemplate(null, "Internal Server Error", error, false));
    }
  }
};

module.exports = {
  fetchUsers,
  fetchUserById,
  insertOneUser,
  updateUserById,
};
