"use strict";

import bcrypt from "bcrypt";

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        primaryKey: true,
        type: DataTypes.STRING,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "users",
      timestamps: true,
    }
  );

  User.beforeSave(async (user, options) => {
    if (user.changed("password")) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });

  User.associate = function (models) {
    models.User.belongsToMany(models.User, {
      foreignKey: "followingId",
      as: "Followers",
      through: "Follow",
    });
    models.User.belongsToMany(models.User, {
      foreignKey: "followerId",
      as: "Followings",
      through: "Follow",
    });

    models.User.belongsToMany(models.User, {
      foreignKey: "senderId",
      as: "Receivers",
      through: {
        model: "DirectMessage",
        unique: false,
      },
    });

    models.User.belongsToMany(models.User, {
      foreignKey: "receiverId",
      as: "Senders",
      through: {
        model: "DirectMessage",
        unique: false,
      },
    });

    models.User.belongsToMany(models.Room, {
      foreignKey: "senderId",
      as: "Rooms",
      through: {
        model: "GroupMessage",
        unique: false,
      },
    });

    models.User.belongsToMany(models.User, {
      foreignKey: "userId",
      as: "friends",
      through: "Friends",
    });
    models.User.belongsToMany(models.User, {
      foreignKey: "friend_id",
      as: "userFriends",
      through: "Friends",
    });
  };

  return User;
};
