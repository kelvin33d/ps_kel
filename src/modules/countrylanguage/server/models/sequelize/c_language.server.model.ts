export = (sequelize:any, DataTypes:any) => {
  const Lang = sequelize.define('countrylanguage', {
    countrycode: {
      type: DataTypes.CHAR,
      allowNull: false,
      primaryKey: true
    },
    language: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    isofficial: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    percentage: {
      type: DataTypes.REAL,
      allowNull: false
    }
  }, {tableName: 'countrylanguage'});
  return Lang;
}