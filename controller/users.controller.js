const { PrismaClient, Prisma } = require("@prisma/client");
const Joi = require("joi");
const {
  ResponseTemplate,
  PaginationTemplate,
} = require("../helper/template.helper");
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
      res.status(404).json(ResponseTemplate(null, "Not Found", true, 404));
      return;
    } else {
      const totalPages = Math.ceil(totalRecords / itemsPerPage);
      const nextPage = pageNumber < totalPages ? pageNumber + 1 : null;
      const prevPage = pageNumber > 1 ? pageNumber - 1 : null;

      const response = PaginationTemplate(
        users,
        totalRecords,
        pageNumber,
        totalPages,
        nextPage,
        prevPage
      );
      res.status(200).json(ResponseTemplate(response, "ok", false, 200));
      return;
    }
  } catch (error) {
    res
      .status(500)
      .json(ResponseTemplate(null, "Internal Server Error", true, 500));
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
      return res.status(200).json(ResponseTemplate(user, "ok", false, 200));
    } else {
      return res
        .status(404)
        .json(ResponseTemplate(null, "Not Found", true, 404));
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(ResponseTemplate(null, "Internal Server Error", error, 500));
    return;
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
        .json(ResponseTemplate(null, "User not found", true, 404));
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

      res
        .status(201)
        .json(ResponseTemplate(updatedUser, "User updated", false, 201));
    } else {
      res
        .status(400)
        .json(ResponseTemplate(null, "No data provided for update", true, 400));
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(ResponseTemplate(null, "Internal Server Error", true, 500));
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
    let respons = ResponseTemplate(newUser, "Created", false, 201);
    res.status(201).json(respons);
  } catch (error) {
    console.log(error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      let respErr = ResponseTemplate(null, "Bad request", true, 400);
      res.status(400).json(respErr); // Mengatur status ke 400 untuk kesalahan P2002
    } else {
      res
        .status(500)
        .json(ResponseTemplate(null, "Internal Server Error", error, 500));
    }
  }
};

module.exports = {
  fetchUsers,
  fetchUserById,
  insertOneUser,
  updateUserById,
};
