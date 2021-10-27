module.exports = (sequelize, DataTypes) => {
  const Follow = sequelize.define('Follow', {}, {
    tableName: 'Follow'
  })
  return Follow
}