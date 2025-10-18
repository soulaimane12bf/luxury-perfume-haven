// Force pg to be loaded
import pg from 'pg';

// Make pg available globally for Sequelize
globalThis.pg = pg;

export default pg;
