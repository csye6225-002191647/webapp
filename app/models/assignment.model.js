const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

module.exports = () => {
  const Assignment = sequelize.define('Assignment', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 100,
      },
    },
    num_of_attempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 100,
      },
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    assignment_created: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    assignment_updated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  { 
    timestamps: true,
    // I don't want createdAt
    createdAt: 'assignment_created',
    // I want updatedAt to actually be called updateTimestamp
    updatedAt: 'assignment_updated'
  });

  return Assignment;
};