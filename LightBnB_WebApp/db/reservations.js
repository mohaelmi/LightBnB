const db = require("./database.js");
/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  return db
    .query(
      `SELECT reservations.id, properties.*, start_date, end_date
  FROM reservations JOIN properties 
  ON properties.id = property_id
  WHERE reservations.guest_id = $1
  GROUP BY reservations.id, properties.id
  ORDER BY start_date 
  LIMIT $2;`,
      [guest_id, limit]
    )
    .then((result) => {
      return result.rows;
    })
    .catch((error) => console.log(error));
};

module.exports = {
  getAllReservations,
};
