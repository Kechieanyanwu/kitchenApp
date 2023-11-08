'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Inventory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Inventory.init({
    item_name: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: "CASCADE",
      references: {
        model: "Categories",
        key: "id"
      }
    }
  }, {
    sequelize,
    modelName: 'Inventory',
    createdAt: "date_created",
    updatedAt: "date_updated",
    underscored: true,
  });
  return Inventory;
};