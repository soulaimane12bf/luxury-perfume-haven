export default function handler(req, res) {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Serverless function is working!',
    timestamp: new Date().toISOString()
  });
}
