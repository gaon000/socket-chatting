module.exports = (sequelize, DataTypes) => {
  const UserInfoView = sequelize.define(
    "userInfoView",
    {
      friendsNumber: DataTypes.INTEGER.UNSIGNED,
    },
    {
      tableName: "userInfo",
    }
  );
  return UserInfoView;
};
