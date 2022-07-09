module.exports.buildFilter = function (object) {
  let filter = {};
  for (const key in object) {
    if (Object.hasOwnProperty.call(object, key)) {
      const element = object[key];
      switch (typeof element) {
        case "string":
          filter[key] = {
            $regex: element,
            $options: "i",
          };
          break;
        case "object":
          if (element.isId) {
            filter[key] = element.value;
          }
          if (element instanceof Date) {
            filter[key] = {
              $gte: element.setHours(0, 0, 0, 0),
              $lte: element.setHours(23, 59, 59, 0),
            };
          }
          break;
        default:
          filter[key] = element;
      }
    }
  }
  return filter;
};