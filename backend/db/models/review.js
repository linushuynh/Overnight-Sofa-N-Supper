'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Review.belongsTo(models.Spot, { foreignKey: 'spotId', onDelete: "CASCADE" });
      Review.belongsTo(models.User, { foreignKey: 'userId', onDelete: "CASCADE" });

      Review.hasMany(models.ReviewImage, { foreignKey: 'reviewId', onDelete: "CASCADE" });
    }
  }
  Review.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Spots',
        key: 'id'
      },
      onDelete: 'cascade'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'cascade'
    },
    review: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isValidStarRating(value) {
          if (value > 5 || value < 0) throw new Error('Star rating is invalid. Please select 1-5')
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
