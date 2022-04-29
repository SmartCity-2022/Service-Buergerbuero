const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const lost_property = sequelize.define(
        "lost_property",
        {
            found_on: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        { freezeTableName: true }
    );

    return lost_property;
};
