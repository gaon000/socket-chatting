module.exports = (sequelize, DataTypes) => {
  const GroupMessage = sequelize.define('GroupMessage', {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true
    },
    message: {
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {
    tableName: 'GroupMessages',
    timestamps: true,
  })


  return GroupMessage 
}
