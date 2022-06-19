const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const appointment = sequelize.define(
        "appointment",
        {
            date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
            time: {
                type: DataTypes.TIME,
                allowNull: false,
            },
            issue: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        { freezeTableName: true }
    );

    return appointment;
};
