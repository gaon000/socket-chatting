module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true
    }
  }, {
    tableName: 'Room',
    timestamps: true
  }) 

  Room.associate = function(models) {
    models.Room.belongsToMany(models.User, {
      foreignKey: 'roomId',
      as: 'Users',
      through: {
        model: 'GroupMessage',
        unique: false
      }
    })
  }


  return Room
}