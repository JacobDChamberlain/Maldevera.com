// models/product.js
'use strict';

module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        description: {
            type: DataTypes.TEXT
        },
        category: {
            type: DataTypes.ENUM('clothing', 'music', 'accessory'),
            allowNull: false
        },
        images: {
            type: DataTypes.ARRAY(DataTypes.TEXT),
            allowNull: false,
            defaultValue: []
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        featured: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        sort_order: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: 'products',
        timestamps: true
    });

    Product.associate = (models) => {
        Product.hasMany(models.Variant, { foreignKey: 'product_id', as: 'variants' });
    };

    return Product;
};
