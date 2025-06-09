// pages/api/voice/ws.js
export default function handler(req, res) {
    if (req.method !== 'UPGRADE') return res.status(405).end();

    const ws = new WebSocketServer({ noServer: true });
    ws.on('connection', (socket) => {
        const pipeline = new VoicePipeline();

        socket.on('message', (audio) => {
            const processed = pipeline.process(audio);
            socket.send(processed);
        });
    });

    ws.handleUpgrade(req, req.socket, Buffer.alloc(0), (client) => {
        ws.emit('connection', client, req);
    });
}