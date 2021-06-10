import Request from './common/request';
import Settings from "./common/settings";
import Server from "./common/server";
import Parser from "./common/parser";
import MyPuppeteer from "./common/puppeteer";
import ProcessLogger from "./common/processLogger";


async function start() {
    const settings = new Settings();
    const processLogger = new ProcessLogger(settings);
    const parser =new Parser(MyPuppeteer, Request, settings, processLogger);
    const server = new Server(settings, parser, processLogger);


    // const botSettings = new Settings(Request);
    // const log = new Log(Request, botSettings);
    // let proxy = new Proxy(Request, botSettings, log);
    // proxy = await proxy.setProxyList();
    // const parser = new Parser(Request, botSettings, log, proxy);
    // const server = new Server(botSettings, parser, log);
    //
    // process.on('SIGINT', () => {
    //     //  console.log('ghghghghgg');
    //     log.info({mess: 'kill'});
    //
    // });

}

start();

/*const express = require("express");
import {main} from "./common/main";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8585;

app.listen(PORT, () => {
    console.log("Server statred");
});

app.get('/is_run', (req, res) =>{
    res.status(200).json({
        run: 1,
    });
});

app.post('/request', function (req, res) {
    //console.log('body.input: '+req.body.input);
    // res.status(200).json({
    //     accepted: 1,
    //     // iteration_id: req.body.iteration_id,
    //     // request_id: req.body.request_id,
    // });
    // console.log(JSON.stringify({order:req.body}));

    // self.parser.order(req.body);
    main();
});*/
