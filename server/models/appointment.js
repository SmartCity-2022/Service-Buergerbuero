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
            from: {
                type: DataTypes.TIME,
                allowNull: false,
            },
            to: {
                type: DataTypes.TIME,
                allowNull: false,
            },
        },
        { freezeTableName: true }
    );

    return appointment;
};
