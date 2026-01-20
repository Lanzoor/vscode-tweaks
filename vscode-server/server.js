const serverStartTime = Date.now();

import express from 'express';
import { execSync, exec } from 'child_process';
import ping from 'ping';
import fs from 'fs';

const app = express();
const PORT = 3001;

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get('/file', (req, res) => {
    const filename = req.query.filename;
    try {
        const content = fs.readFileSync(filename, 'utf8');
        res.send({ content });
    } catch (err) {
        res.status(500).send({ error: 'Failed to read file' });
    }
});

app.post('/file', (req, res) => {
    const { filename, content } = req.body;
    try {
        fs.writeFileSync(filename, content, 'utf8');
        res.send({ status: 'File overwritten successfully' });
    } catch (err) {
        res.status(500).send({ error: 'Failed to write file' });
    }
});

function runCommand(cmd) {
    try {
        const output = execSync(cmd, { encoding: 'utf8' });
        return output.trim();
    } catch (error) {
        console.error(`Command failed: ${cmd}`);
        return error.message;
    }
}

function runCommandAsync(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.error(`Command failed: ${cmd}`);
                reject(stderr || error.message);
            } else {
                resolve(stdout.trim());
            }
        });
    });
}

app.get('/ping', (req, res) => {
    res.send('pong');
});

async function pingSelfHttp() {
    try {
        const start = process.hrtime.bigint();
        await fetch('http://localhost:3001/ping');
        const end = process.hrtime.bigint();
        const latencyMicro = Number(end - start) / 1_000;
        return latencyMicro;
    } catch (err) {
        console.error('Ping failed:', err.message);
        return null;
    }
}

function formatUptime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
}

app.get('/main', async (req, res) => {
    const githubPinger = await ping.promise.probe('github.com');
    const googlePinger = await ping.promise.probe('google.com');
    const selfPinger = await pingSelfHttp();
    const uptimeMs = Date.now() - serverStartTime;
    const uptimeSec = Math.floor(uptimeMs / 1000);
    const uptimeFormatted = formatUptime(uptimeSec);

    res.json({
        time: new Date().toLocaleTimeString(),
        status: 'on',
        sysInfo: runCommand('neofetch --stdout'),
        githubPing: githubPinger.alive ? `${githubPinger.time}ms` : 'unreachable',
        googlePing: googlePinger.alive ? `${googlePinger.time}ms` : 'unreachable',
        selfPing: typeof selfPinger === 'number' ? `${selfPinger.toFixed(2)}μs` : 'unreachable',
        uptime: uptimeFormatted,
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
