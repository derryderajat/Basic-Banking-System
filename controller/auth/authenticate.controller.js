const authenticate = async (req, res) => {
  return res.status(200).json({
    status: 200,
    message: "success",
    data: {
      user: req.user,
    },
  });
};

module.exports = authenticate;
