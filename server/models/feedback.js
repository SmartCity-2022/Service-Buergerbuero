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
            content: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        { freezeTableName: true }
    );

    return feedback;
};
