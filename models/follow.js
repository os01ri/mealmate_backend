'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class follow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
      follow.belongsTo(models.user, { foreignKey: "follower_id",as:"follower" })
      follow.belongsTo(models.user, { foreignKey: "followby_id",as:"followby" })

    }
  }
  follow.init({
    follower_id: {

      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id"

      },

    },

    
    followby_id: {

      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id"

      },

    },

  }, {
    sequelize,
    modelName: 'follow',
    timestamps:false
  });
  return follow;
};