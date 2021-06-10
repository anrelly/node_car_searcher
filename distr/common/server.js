"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const touch = require("touch");

class Server {
  constructor(settings, parser, processLogger) {
    this.settings = settings;
    this.parser = parser;
    this.processLogger = processLogger;
    this.app = (0, _express.default)();
    this.app.use(_express.default.json());
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
        accepted: 1 // iteration_id: req.body.iteration_id,
        // request_id: req.body.request_id,

      }); // console.log(JSON.stringify({order:req.body}));

      self.parser.handlePost(req.body);
    });
    this.app.get('/is_run', function (req, res) {
      res.status(200).json({
        run: 1
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
        accepted: 1
      });
      touch('distr/index.js');
    });
  }

}

exports.default = Server;