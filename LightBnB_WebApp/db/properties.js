const db = require("./database.js");
/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {
  const queryParams = [];
  let queryString = `
   SELECT properties.*, AVG(property_reviews.rating) as average_rating
   FROM properties
   JOIN property_reviews ON properties.id = property_id`;
  const whereClause = [];
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    whereClause.push(`city LIKE $${queryParams.length}`);
  }
  if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    whereClause.push(`owner_id = $${queryParams.length}`);
  }
  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night}`);
    queryParams.push(`${options.maximum_price_per_night}`);
    whereClause.push(`cost_per_night BETWEEN
    $${queryParams.length - 1} AND $${queryParams.length}`);
  }
  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    whereClause.push(`property_reviews.rating >= $${queryParams.length}`);
  }

  if (whereClause.length > 0) {
    queryString += " WHERE ";
    queryString += whereClause.join(" AND ");
  }

  queryParams.push(limit);
  queryString += `
   GROUP BY properties.id
   ORDER BY cost_per_night
   LIMIT $${queryParams.length};
   `;

  console.log(queryString, queryParams);

  return db.query(queryString, queryParams).then((res) => res.rows);
};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  return db
    .query(
      `INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, 
        cover_photo_url, cost_per_night,
        street, city, province, post_code, country, parking_spaces, number_of_bathrooms,
        number_of_bedrooms) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *;`,
      [
        property.owner_id,
        property.title,
        property.description,
        property.thumbnail_photo_url,
        property.cover_photo_url,
        property.cost_per_night,
        property.street,
        property.city,
        property.province,
        property.post_code,
        property.country,
        property.parking_spaces,
        property.number_of_bathrooms,
        property.number_of_bedrooms,
      ]
    )
    .then((result) => {
      return result.rows[0];
    });
};

module.exports = {
  getAllProperties,
  addProperty,
};
