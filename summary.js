const _ = require("lodash");
const {
  saveFile,
  readFile,
  listFiles,
  asyncForEach
} = require("./utils.js");
const path = require("path");

const directoryUniqResults = path.join(__dirname, "results");
const directoryUniqProcessed = path.join(__dirname, "uniq_data_processed");

const pathWithResults = path.join(directoryUniqResults, `summary.json`);

const processResult = async (filename) => {
  try {
    const filePath = path.join(directoryUniqResults, `${filename}.json`);
    const data = await readFile(filePath);
    const {
      count,
      server: { created },
    } = _.pick(JSON.parse(data), ["count", "server.created"]);
    return { count, created };
  } catch (err) {
    console.log(`Error ${filename}.`, err);
  }
};

const summaryAll = async (filePath) => {
  const files = await listFiles(filePath);
  const result = { count: 0, created: 0 };
  await asyncForEach(files, async (file) => {
    const filename = path.parse(file).name;
    if (!/\d/gi.test(filename)) return;
    const _result = await processResult(filename);
    result.count += _result.count;
    result.created += _result.created;
  });
  return result;
};

const processIds = async (filename) => {
  try {
    const filePath = path.join(directoryUniqProcessed, `${filename}.json`);
    const data = await readFile(filePath);
    const contacts = JSON.parse(data);
    return contacts.map((x) => x.contact_id);
  } catch (err) {
    console.log(`Error ${filename}.`, err);
  }
};

const distinctAll = async (filePath) => {
  const files = await listFiles(filePath);
  let result = [];
  let per_file=[];
  await asyncForEach(files, async (file) => {
    const filename = path.parse(file).name;
    const _result = await processIds(filename);
    per_file.push({[`${filename}`]: `${_result.length}`});
    result = result.concat(_result);
  });
  const _uniq = _.uniq(result);
  const _data = {
    results_length: result.length,
    result_uniq_length: _uniq.length,
    diff: result.length - _uniq.length,
    files: per_file,
    duplicated_contact_ids: _(result)
      .groupBy()
      .pickBy((x) => x.length > 1)
      .keys()
      .value(),
  };
  return _data;
};

const createSummary = async () => {
  const created = await summaryAll(directoryUniqResults);
  const dictinct = await distinctAll(directoryUniqProcessed);
  await saveFile(
    JSON.stringify({
      response:created,
      all:dictinct,
    }),
    pathWithResults
  );
  console.log(`Report saved: ${pathWithResults}.`)
};

module.exports={
  createSummary
}