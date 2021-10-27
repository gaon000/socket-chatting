module.exports = (sequelize, DataTypes) => {
  const DirectMessage = sequelize.define('DirectMessage', {
    id:{
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED
    },
    message: {
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {
    tableName: 'DirectMessage',
    timestamps: true
  }) 

  return DirectMessage 
}