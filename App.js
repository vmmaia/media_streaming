const express = require('express');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('conf.json'));

const app = express();

const videoPath = config.videoFilePath;
const chunkSize = config.chunkSizeInBytes;
const rangeRegex = /\=(.*?)\-/;

const log = (start, end, length) => {
    const percentage = Math.ceil((end / length) * 100);

    console.log(
        `[${percentage}%] - ${videoPath} => ${start}-${end} / ${length}`
    );
};

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/video', function (req, res) {
    const rangeHeader = req.headers.range;

    if (!rangeHeader) {
        res.status(400).send('Requires range header');
    }

    const videoSize = fs.statSync(videoPath).size;
    const start = parseInt(rangeHeader.match(rangeRegex)[1]);
    const end = Math.min(start + chunkSize, videoSize - 1);
    const contentLength = end - start + 1;
    const videoStream = fs.createReadStream(videoPath, {
        start: start,
        end: end,
    });

    const headers = {
        'Content-Range': `bytes ${start}-${end}/${videoSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': contentLength,
        'Content-Type': 'video/mp4',
    };

    log(start, end, videoSize);

    res.writeHead(206, headers);
    videoStream.pipe(res);
});

app.listen(config.serverPort, function () {
    console.log(`Listening on port ${config.serverPort}`);
});
