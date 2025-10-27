import sequelize from '../backend/src/config/database.js';

(async function(){
  try{
    const qi = sequelize.getQueryInterface();
    const desc = await qi.describeTable('admins');
    console.log('admins table columns:');
    console.log(Object.keys(desc).sort());
    console.log('instagram present:', Boolean(desc.instagram));
    console.log('facebook present:', Boolean(desc.facebook));
    process.exit(0);
  }catch(err){
    console.error('error describing table:', err && err.message? err.message: err);
    process.exit(2);
  }
})();
