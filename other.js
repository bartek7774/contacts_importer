const { compose } = require("rambda");
const _ = require("lodash");

const FIELD_NAMES = ["contact_id", "number", "created_at", "code"];

const mapper_phone = (x) =>
  x.trim().length === 11 ? `'%${x.slice(2)}'` : `'%${x}'`;

const mapper_sws = compose(
  (x) => `'${x.trim()}'`,
  (x) => {
    const [, sws] = x.split(",");
    return sws;
  }
);

const filter_sws = (x) => /\d{3,}/gi.test(x);

const pickUniqFields = (x) => ({
  ..._.pick(x, FIELD_NAMES),
  contact_id: +x.contact_id,
});

module.exports = {
  mapper_phone,
  mapper_sws,
  filter_sws,
  pickUniqFields
};
