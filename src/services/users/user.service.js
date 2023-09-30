import db from "../../db/models/index.js";
import { USER_STATUS } from "../../db/models/user/user.js";
const { Op } = db.Sequelize;
import { getAccountInfo } from "./auth.service.js";

export async function getListUser(query, { order, offset, limit }) {
  const { search, level, role } = query;
  console.log("query",query)
  const conditions = {
    status: USER_STATUS.ACTIVE,
  };

  if (search) {
    conditions[Op.or] = [
      { email: { [Op.like]: `%${search}%` } },
      { username: { [Op.like]: `%${search}%` } },
      { userCode: { [Op.like]: `%${search}%` } },
      { phoneNumber: { [Op.like]: `%${search}%` } },
      { "$userInformation.fullName$": { [Op.like]: `%${search}%` } },
    ];
  }

  level && (conditions.level = level);
  role && (conditions.role = role);

  const result = await db.User.findAndCountAll({
    where: conditions,
    include: [
      {
        model: db.UserInformation,
        as: "userInformation",
      },
      {
        model: db.UserReferral,
        as: "userReferral",
      },
      {
        model: db.UserReferral,
        as: "userReferrer",
      },
    ],

    limit,
    offset,
  });

  return result;
}

/**
 * Get user information
 * @param {*} userId
 */
export async function getUserDetail(userId) {
  const user = await db.User.findByPk(userId, {
    include: [
      {
        model: db.UserInformation,
        as: "userInformation",
      },
    ],
  });

  return user;
}

// update profile user
export async function updateUserProfile(user, formUpdate) {
  const profile = await getAccountInfo(user, false);
  const transaction = await db.sequelize.transaction();
  try {
    if (!formUpdate.avatar) {
      await checkUserExisted(
        formUpdate.email,
        formUpdate.phoneCode,
        formUpdate.phoneNumber,
        formUpdate.username,
        { id: { [Op.not]: user.id } }
      );
    }

    const dataUserUpdate = {
      phoneCode: formUpdate.phoneCode,
      phoneNumber: formUpdate.phoneNumber,
      username: formUpdate.username,
      address: formUpdate.address,
    };

    const dataUserInfoUpdate = {
      fullName: formUpdate.fullName,
      address: formUpdate.address,
      cityCode: formUpdate.cityCode,
      districtCode: formUpdate.districtCode,
      wardCode: formUpdate.wardCode,
      avatar: formUpdate.avatar,
    };

    await Promise.all([
      db.User.update(dataUserUpdate, {
        where: { id: profile.id },
        transaction,
      }),
      db.UserInformation.update(dataUserInfoUpdate, {
        where: { userId: profile.id },
        transaction,
      }),
    ]);

    await transaction.commit();
    return true;
  } catch (e) {
    console.log("ERROR_UPDATE_USER_PROFILE: ", e);
    if (transaction) await transaction.rollback();
    throw e;
  }
}
export async function updateLevelUser(formUpdate) {
  try {
    await db.User.update(formUpdate, {
      where: { id: formUpdate.id },
    });
    return true;
  } catch (e) {
    console.log("ERROR_UPDATE_USER_PROFILE: ", e);
    throw e;
  }
}
