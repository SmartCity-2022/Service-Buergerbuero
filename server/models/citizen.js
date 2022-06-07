const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const citizen = sequelize.define(
        "citizen",
        {
            first_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            last_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            street: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            building_number: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        { freezeTableName: true }
    );

    citizen.associate = (models) => {
        citizen.hasMany(models.appointment, { onDelete: "cascade" });
        models.appointment.belongsTo(citizen);

        citizen.hasMany(models.request, { onDelete: "cascade" });
        models.request.belongsTo(citizen);
    };

    return citizen;
};
