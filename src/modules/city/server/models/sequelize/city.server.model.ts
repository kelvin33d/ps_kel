import * as crypto from 'crypto';

export = (sequelize:any, DataTypes:any) => {
  const City = sequelize.define('city',{
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    countrycode: {
      type: DataTypes.CHAR,
      allowNull: false
    },
    district: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    population: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, { tableName: 'city', timestamps: false});

  return City;
}
