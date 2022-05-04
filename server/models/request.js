const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const request = sequelize.define(
        "request",
        {
            created: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
            completed: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            desc: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            complete: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        },
        { freezeTableName: true }
    );

    return request;
};
