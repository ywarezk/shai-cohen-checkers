import { Server } from "socket.io";
// TODO: unused
import cors from 'cors';
import express from 'express';
import http from 'http';
import {initializeGame} from './game.js'
import path from 'path';

const port = process.env.PORT || 8000;

const app = express();

// TODO: no need for line 14 you alread have __dirname
const __dirname = path.resolve();
app.use("/", express.static(path.join(__dirname, "./client/build")));

// TODO: calling express app.listen() also returns a server
// so you can also do this entirely with the express app.
const server = http.createServer(app);

const io= new Server(server);

io.on('connection', client => {
    initializeGame(io, client)
})

// TODO: your have a workspace with multiple projects
// consider maybe to use a workspace management tool like: yarn workspaces, lerna, nrwl (on typescript)

server.listen(port);