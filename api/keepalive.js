import { initializeDatabase } from '../backend/src/app.js';

export default async function handler(req, res) {
	// Simple keepalive endpoint. When pinged it will also trigger DB
	// initialization in the background (useful for UptimeRobot or cron pings).
	if (req.method !== 'GET') {
		res.status(405).json({ message: 'Method not allowed' });
		return;
	}

	// Trigger initialization but don't wait for it.
	initializeDatabase().catch((err) => {
		console.error('Keepalive: init error', err && err.message ? err.message : err);
	});

	res.json({ status: 'OK', message: 'Keepalive ping received' });
}
