import _ from "lodash";

export async function getNextUserCode(model, length = 6) {
  const lastRecord = await model.findAll({
    order: [["id", "DESC"]],
    limit: 1,
    plain: true,
    raw: true,
    paranoid: false,
  });
  let code;
  if (lastRecord) {
    code = +lastRecord.userCode.match(/\d+/g, "")[0];
  }

  let next = _.toString(_.toNumber(code || 0) + 1);
  if (next.length < length) {
    next = _.padStart(_.toString(next), length, "0");
  }
  return next;
}
