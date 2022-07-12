const { DateTime } = require("luxon");
module.exports.buildFilter = function (object) {
  let filter = {};
  for (const key in object) {
    if (Object.hasOwnProperty.call(object, key)) {
      let element = object[key];
      switch (typeof element) {
        case "string":
          // Revisar si el objeto es valido usando la biblioteca Luxon (las fechas se mandan como string)
          const date = DateTime.fromFormat(element, "dd/MM/yyyy");

          if (date.isValid) {
            const validDate = date.toJSDate();
            filter[key] = {
              $gte: validDate.setHours(0, 0, 0, 0),
              $lte: validDate.setHours(23, 59, 59, 0),
            };
          } else {
            filter[key] = {
              $regex: element,
              $options: "i",
            };
          }
          break;
        case "object":
          if (element.isId) {
            filter[key] = element.value;
          }
          break;
        default:
          filter[key] = element;
      }
    }
  }
  return filter;
};
