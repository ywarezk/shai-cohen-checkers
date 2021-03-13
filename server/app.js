import { Server } from "socket.io";
import cors from 'cors';
import express from 'express';
import http from 'http';
import {initializeGame} from './game.js'
import path from 'path';

const port = process.env.PORT || 8000;

const app = express();

const __dirname = path.resolve();
app.use("/", express.static(path.join(__dirname, "./client/build")));

const server = http.createServer(app);

const io= new Server(server);

io.on('connection', client => {
    initializeGame(io, client)
})

server.listen(port);