'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      User.belongsToMany(models.ingredient, { through: "wishlist", foreignKey: "user_id", otherKey: "ingredient_id" })
      User.belongsToMany(models.ingredient, { through: "grocery", foreignKey: "user_id", otherKey: "ingredient_id", as: "groceries" })
      User.belongsToMany(models.ingredient, { through: "unlike", foreignKey: "user_id", otherKey: "ingredient_id", as: "unlikeingredient" })
      // User.belongsToMany(models.recipe, { through: "likerecipe", foreignKey: "user_id", otherKey: "recipe_id", as: "likerecipe" });
      User.belongsToMany(User,{through:"follow",foreignKey:"follower_id",otherKey:"followby_id",as:"follower"})
      User.belongsToMany(User,{through:"follow",foreignKey:"followby_id",otherKey:"follower_id",as:"followby"})

      User.belongsToMany(models.recipe,{through: "likerecipe", foreignKey: "user_id", otherKey: "recipe_id",as:"likerecipes"});
      User.hasMany(models.recipe, { foreignKey: "user_id" })
      User.hasMany(models.order, { foreignKey: "user_id" })
      // User.hasMany(models.follow,{foreignKey:"follower_id",as:"follower1"});
      // User.hasMany(models.follow,{foreignKey:"followby_id",as:"followby1"});
    //  User.hasMany(models.likerecipe,{foreignKey:"user_id",as:"likerecipe"});


    }
  }

  User.prototype.toJSON = function () {

    const values = this.get();
    delete values.password;
    delete values.code;
    return values;

  }
  User.prototype.comparePassword = function (password) {

    return bcrypt.compareSync(password, this.password);
  }
  User.init({

    id: {

      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {

      type: DataTypes.STRING,
      allowNull: false
    },
    username: {

      type: DataTypes.STRING,
      allowNull: false
    },
    email: {

      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    code: {

      type: DataTypes.STRING,
      allowNull: true

    },
    password: {

      type: DataTypes.STRING,
      allowNull: false,

      set(value) {

        this.setDataValue("password", bcrypt.hashSync(value, 10));
      },


    },
    logo: {

      type: DataTypes.STRING,
      allowNull: true,
      defaultValue:process.env.APP_URL+"public/anonymous-user.jpg"        

    },

    hash: {

      type: DataTypes.STRING,
      allowNull: true,
      defaultValue:"UBPs#C?b-:?b~qofRjj[ayfQRkay_3j[ayj["        

    },
    status: {

      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

  }, {
    sequelize,
    modelName: 'user',
    timestamps: false,
    defaultScope: {

    }
  });
  return User;
};