const csv = require("csvtojson");
const path = require("path");
const { saveFile, moveFile } = require("./utils.js");

const directoryCSV = path.join(__dirname, "csv");
const directoryCSVprocessed = path.join(__dirname, "csv_processed");
const directorySqlQueries = path.join(__dirname, "sql_generated");

const createQueryFromFile = (
  getSQLQuery = (f) => f,
  mapper = (f) => f,
  filter = (f) => f,
  packLength = 1000
) => async (filename) => {
  try {
    if (!filename) return "No sql files generated!";
    if (!(Number.isInteger(packLength) && packLength > 0))
      return "Incorrect pack length!";
    const filePath = path.join(directoryCSV, filename);
    const newPath = path.join(directoryCSVprocessed, filename);
    const results = await csv({
      trim: true,
      noheader: true,
      output: "line",
    }).fromFile(filePath);

    if (!Array.isArray(results))
      throw new Error(`There aren't any contacts in ${filename}.`);

    let id_pack = 1,
      start = 1 + (id_pack - 1) * packLength,
      stop = (id_pack - 1) * packLength + packLength;

    while (start < results.length) {
      const query = getSQLQuery(
        results.slice(start, stop).map(mapper).filter(filter)
      );
      await saveFile(
        query,
        path.join(directorySqlQueries, `${start}_${stop}.sql`)
      );
      start = 1 + (++id_pack - 1) * packLength;
      stop = (id_pack - 1) * packLength + packLength;
    }
    await moveFile(filePath, newPath);
  } catch (err) {
    console.error(err);
  }
};

const generateSQLfromCSV = async (
  file = "",
  querySql = (f) => "",
  mapper = (f) => f,
  filter = (f) => f,
  packLength = 1000
) => {
  try {
    if (!file) return `Filename should be provided.`;
    const sqlGenerator = createQueryFromFile(
      querySql,
      mapper,
      filter,
      packLength
    );
    await sqlGenerator(file);
  } catch (err) {
    console.log(`Error generateSQLfromCSV: `, err);
  }
};

module.exports = {
  generateSQLfromCSV,
};
