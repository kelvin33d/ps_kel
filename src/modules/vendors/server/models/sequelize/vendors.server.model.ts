export = (sequelize, DataTypes) => {
  const Vendor = sequelize.define('Comment', {
    businessName: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Business Name',
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Website url'
    },
    photos: {
      type: DataTypes.ARRAY,
      allowNull: true,
      comment: 'Vendors photos'
    },
    videos: {
      type: DataTypes.ARRAY,
      allowNull: true,
      comment: 'Vendor videos'
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Vendor phone number'
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Vendor email'
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Vendor description'
    },
    /*user: {
       type: DataTypes.INTEGER,
       references: {
         model: User,
         key: 'id',
         deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
       }
    }*/
  });
  return Vendor;
}