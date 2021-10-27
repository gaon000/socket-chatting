module.exports = (sequelize, DataTypes) => {
  const Friends = sequelize.define(
    "Friends",
    {
      userId: DataTypes.STRING,
      friendsNumber: DataTypes.INTEGER.UNSIGNED,
    },
    {
      tableName: "Friends",
    }
  );
  return Friends;
};
