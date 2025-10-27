import sequelize from '../backend/src/config/database.js';

(async ()=>{
  try{
    console.log('Running direct ALTER TABLE to add instagram and facebook (if not exists)');
    const sql1 = `ALTER TABLE IF EXISTS admins ADD COLUMN IF NOT EXISTS instagram VARCHAR(255);`;
    const sql2 = `ALTER TABLE IF EXISTS admins ADD COLUMN IF NOT EXISTS facebook VARCHAR(255);`;
    await sequelize.query(sql1);
    await sequelize.query(sql2);
    console.log('Done');
    process.exit(0);
  }catch(err){
    console.error('Error running ALTER TABLE:', err && err.message? err.message: err);
    process.exit(2);
  }
})();
