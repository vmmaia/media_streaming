# Media streaming with NodeJS and Express

This README provides instructions on how to run a Node.js Express server that serves a video file in a stream. The server streams the video file in chunks, which allows the client to start playing the video before the entire file has been downloaded.

## Prerequisites

Before you can run the server, you need to have the following installed on your system:

-   Node.js
-   NPM (Node Package Manager)
-   A .mp4 file of your choosing

## Installation

1. Clone the repository to your local machine:

```
git clone https://github.com/vmmaia/media_streaming
```

2. Change into the project directory:

```
cd media_streaming
```

3. Install the required dependencies:

```
npm install
```

4. Change any configurations you might need in the config file

```
{
    "serverPort": 8000,
    "videoFilePath": "assets/02.mp4",
    "chunkSizeInBytes": 1048576
}
```

5. Copy a video file to the assets folder

## Usage

1. Start the server:

```
npm start
```

2. Navigate to **http://localhost:8000** by default. This will load the video file specified in conf.json.

## How it works

When streaming a video file, the server sends the data to the client in chunks, which allows the client to start playing the video before the entire file has been downloaded. The server sends each chunk of data as a separate HTTP response, and the client receives the data in a stream.

To send the data in chunks, the server uses the **Range** header to specify the byte range of the file to be sent. The **Range** header is a standard HTTP header that indicates the byte range of the resource being requested. The header has the following format:

```
Range: bytes=start-end
```

where **start** and **end** are the byte offsets of the requested range. For example, to request the first 1MB of a file, the client would send the following header:

```
Range: bytes=0-1048575
```

When the server receives a request with a **Range** header, it reads the requested range from the file and sends it as the response body. The server also sets the **Content-Range** header to indicate the byte range of the response. The **Content-Range** header has the following format:

```
Content-Range: bytes start-end/total
```

where **start** and **end** are the byte offsets of the response range, and **total** is the total number of bytes in the file. For example, if the client requests the first 1MB of a 10MB file, the server would send the following response headers:

```
HTTP/1.1 206 Partial Content
Content-Type: video/mp4
Content-Length: 1048576
Content-Range: bytes 0-1048575/10485760
```

The client can then use the **Content-Range** header to determine the range of the response and the total size of the file, and use this information to play the video while it is being downloaded in the background. The client can then make subsequent requests for additional chunks of the file by sending a new **Range** header with the next byte range to be downloaded.
