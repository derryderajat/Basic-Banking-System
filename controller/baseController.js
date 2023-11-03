const sum = (req, res) => {
  const x = 3,
    y = 10;
  res.status(200).json({
    x: x,
    y: y,
    result: x + y,
  });
};
module.exports = {
  sum,
};
