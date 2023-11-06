function ResponseTemplate(data, message, error, success) {
  return {
    data,
    message,
    error,
    success,
  };
}
function PaginationTemplate(
  data,
  total_records,
  current_page,
  total_page,
  next_page,
  prev_page
) {
  return {
    data,
    pagination: {
      total_records,
      current_page,
      total_page,
      next_page,
      prev_page,
    },
  };
}
module.exports = {
  ResponseTemplate,
  PaginationTemplate,
};
