import * as express from 'express';
import * as path from 'path';

const app = express();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/events/:name', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    });

    const greetings = ['hi', 'hola', 'bonjour', 'guten tag', 'salve', 'olá', 'salaam alaikum', 'konnichiwa', 'Zdravstvuyte'];
    const name = req.params.name;

    const interval = setInterval(() => {
        console.log(`sending greeting to ${name} ${new Date().toISOString()}`);
        const event = {
            time: new Date().toISOString(),
            type: 'greeting',
            data:{
                greeting: `${greetings[Math.floor(Math.random() * greetings.length)]} ${name}`
            }
        };
        res.write(`data: ${JSON.stringify(event)}\n\n`)
    }, 500);

    setTimeout(() => {
        clearInterval(interval);
        const event = {
            time: new Date().toISOString(),
            type: 'end',
        };
        res.write(`data: ${JSON.stringify(event)}\n\n`);
    }, 30000);

    res.on('close', () => {
        console.log(`closed connection with ${name}`);
        clearInterval(interval)
    });
});

app.listen(4000, () => {
    console.log('server running on port 4000');
});
