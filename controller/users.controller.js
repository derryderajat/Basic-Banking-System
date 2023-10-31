const { PrismaClient, Prisma } = require("@prisma/client");
const Joi = require("joi");
const { ResponseTemplate } = require("../helper/template.helper");
const prisma = new PrismaClient();
const fetchUsers = async (req, res) => {
  const { page } = req.query;
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
      return res
        .status(404)
        .json(ResponseTemplate(null, "Not Found!", null, false));
    } else {
      const totalPages = Math.ceil(totalRecords / itemsPerPage);
      const nextPage = pageNumber < totalPages ? pageNumber + 1 : null;
      const prevPage = pageNumber > 1 ? pageNumber - 1 : null;

      const response = {
        users,
        totalRecords,
        pageNumber,
        totalPages,
        nextPage,
        prevPage,
      };
      return res.status(200).json(ResponseTemplate(response, "success", null, "ok"));
      
    }
  } catch (error) {
    return res
      .status(500)
      .json(
        ResponseTemplate(
          null,
          "Something broke!",
          error.message,
          "Internal Server Error"
        )
      );
  }
};

// get All Users Data By Id
const fetchUserById = async (req, res) => {
  const userId = parseInt(req.params.id);
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
      return res
        .status(200)
        .json(ResponseTemplate(user, "success", null, "ok"));
    } else {
      return res
        .status(404)
        .json(
          ResponseTemplate(null, "Sorry data is not found", null, "Not Found")
        );
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        ResponseTemplate(
          null,
          "Something broke!",
          error.message,
          "Internal Server Error"
        )
      );
  }
};
const updateUserById = async (req, res) => {
  const userId = parseInt(req.params.id);
  const payload_user = {}; // Inisialisasi objek payload user
  const payload_profile = {}; // Inisialisasi objek payload profile

  if (req.body.name) {
    payload_user.name = req.body.name;
  }
  if (req.body.email) {
    payload_user.email = req.body.email;
  }
  if (req.body.password) {
    payload_user.password = req.body.password;
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
      const updatedUser = await prisma.users.update({
        where: {
          id: userId,
        },
        data: {
          ...payload_user,
          profile: {
            update: {
              identity_type: payload_profile.identity_type,
              identity_account_number: payload_profile.identity_account_number,
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

      return res
        .status(201)
        .json(
          ResponseTemplate(updatedUser, "User is updated", null, "Created")
        );
    } else {
      return res
        .status(400)
        .json(ResponseTemplate(null, "Something wrong", null, "Bad Request!"));
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        ResponseTemplate(
          null,
          "Something broke!",
          error.message,
          "Internal Server Error"
        )
      );
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

  try {
    const newUser = await prisma.users.create({
      data: {
        name,
        email,
        password,
        profile: {
          create: {
            identity_type,
            identity_account_number,
            address,
          },
        },
      },
    });
    let respons = ResponseTemplate(
      newUser,
      "New user is created",
      null,
      "created"
    );
    return res.status(201).json(respons);
  } catch (error) {
    console.log(error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      let respErr = ResponseTemplate(
        null,
        "Something wrong!",
        error.message,
        "Bad Request!"
      );
      return res.status(400).json(respErr); // Mengatur status ke 400 untuk kesalahan P2002
    } else {
      return res
        .status(500)
        .json(
          ResponseTemplate(
            null,
            "Something broke!",
            error.message,
            "Internal Server Error"
          )
        );
    }
  }
};

module.exports = {
  fetchUsers,
  fetchUserById,
  insertOneUser,
  updateUserById,
};
