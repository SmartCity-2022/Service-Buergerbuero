const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const feedback = sequelize.define(
        "feedback",
        {
            date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
        },
        { freezeTableName: true }
    );

    return feedback;
};
