import Express from 'express';
const touch = require("touch");

export default class Server {
    constructor(settings, parser, processLogger) {
        this.settings = settings;
        this.parser = parser;
        this.processLogger = processLogger;

        this.app = Express();
        this.app.use(Express.json());

        this.app.listen(this.settings.server.port, () => {
            console.log("Server statred");
        });

        this.listen();
    }

    listen() {
        let self = this;

        this.app.post('/request', function (req, res) {
            //console.log(req.body);
            res.status(200).json({
                accepted: 1,
                // iteration_id: req.body.iteration_id,
                // request_id: req.body.request_id,
            });
            // console.log(JSON.stringify({order:req.body}));

            self.parser.handlePost(req.body);

        });

        this.app.get('/is_run', function (req, res) {
            res.status(200).json({
                run: 1,
            });
        });

        this.app.post('/get_status', function (req, res) {
            res.status(200).json({
                accepted: 1,
                response: self.processLogger.getStatus()
            });
        });

        this.app.get('/restart', function (req, res) {
            res.status(200).json({
                accepted: 1,
            });
            touch('distr/index.js');
        });

    }
}