const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fetchUsers = async (req, res) => {
  let users = await prisma.users.findMany({
    orderBy: {
      name: "asc",
    },
  });
  res.status(200).json(users);
};
const fetchUserById = async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    const user = await prisma.users.findUnique({
      where: {
        id: userId,
      },
      include: {
        profiles: true,
      },
    });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
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
        profiles: {
          create: {
            identity_type,
            identity_account_number,
            address,
          },
        },
      },
      include: {
        profiles: true,
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  fetchUsers,
  fetchUserById,
  insertOneUser,
};
