import * as crypto from 'crypto';
// code, name, continent, region, surfacearea, indepyear, population, lifeexpectancy, gnp, gnpold, localname, governmentform, headofstate, capital, code2
export = (sequelize:any, DataTypes:any) => {
	const Country = sequelize.define('countries',{
		code: {
			type: DataTypes.CHAR,
			comment: 'Country code',
			allowNull: false,
      primaryKey: true,
      references: {
        model: 'city',
        key: 'id'
      }
		},
    name: {
    	type: DataTypes.STRING,
    	comment: 'Country code',
    	allowNull: false
    },
    continent: {
    	type: DataTypes.STRING,
    	comment: 'Country continent',
    	allowNull: false
    },
    region: {
    	type: DataTypes.STRING,
    	allowNull: false
    },
    surfacearea: {
    	type: DataTypes.REAL,
    	allowNull: false
    },
    indepyear: {
    	type: DataTypes.SMALLINT,
    	allowNull: true
    },
    population: {
    	type: DataTypes.INTEGER,
    	allowNull: true
    },
    lifeexpectancy: {
    	type: DataTypes.REAL
    },
    gnp: {
    	type: DataTypes.NUMERIC,
    	/*validate: {
    		len:[]
    	}*/
    },
    gnpold: {
    	type: DataTypes.NUMERIC,
    },
    localname: {
    	type: DataTypes.TEXT,
    	allowNull: true
    },
    governmentform: {
    	type: DataTypes.TEXT,
    	allowNull: true
    },
    headofstate: {
    	type: DataTypes.STRING
    },
    /*capital: {
    	type: DataTypes.INTEGER,
        references: {
          model: ''
        }
    },*/
    code2: {
    	type: DataTypes.CHAR
    },
	},{tableName: 'country' /*,timestamps:false, createdAt:false, deletedAt:false, updatedAt:false */ })

	return Country;
}