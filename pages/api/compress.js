// Simple placeholder for compress (to be implemented with real compression logic)
export default function handler(req, res) {
  res.status(501).json({ error: 'Compression not implemented yet' })
}
