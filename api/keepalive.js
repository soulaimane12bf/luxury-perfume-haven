// Keep-alive endpoint to prevent cold starts
export default function handler(req, res) {
  res.status(200).json({ 
    status: 'alive',
    timestamp: Date.now()
  });
}
