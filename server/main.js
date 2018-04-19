const express = require('express')
const path = require('path')
const webpack = require('webpack')
const logger = require('../build/lib/logger')
const webpackConfig = require('../build/webpack.config')
const project = require('../project.config')
const compress = require('compression')
const bodyParser = require('body-parser');
const _ = require('underscore');

const app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http)

var sockets = {};

io.on('connection', function(socket){
  sockets[socket.id] = socket;
  console.log('a user connected');
  socket.on('disconnect', function(){
    delete sockets[socket.id];
    console.log('user disconnected');
  });
});

app.use(compress())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


var users = [
  {id: 1, name: "Jing"},
  {id: 2, name: "Robert"},
  {id: 3, name: "Erna"},
];
var userInc = 4;
var threads = [
  {id: 1, group: [users[0], users[1]], lastMessage: null},
  {id: 2, group: [users[0], users[2]], lastMessage: null}
];
var threadInc = 3;
var messages = [
  {id: 1, from: users[0], to: users[0], threadId: 1, message: "Heisann", timestamp: new Date()},
  {id: 2, from: users[0], to: users[1], threadId: 1, message: "Heisann", timestamp: new Date()},
  {id: 3, from: users[1], to: users[0], threadId: 1, message: "Hopp", timestamp: new Date()},
  {id: 4, from: users[1], to: users[1], threadId: 1, message: "Hopp", timestamp: new Date()},
  {id: 5, from: users[2], to: users[0], threadId: 2, message: "Hooo", timestamp: new Date()},
  {id: 6, from: users[2], to: users[2], threadId: 2, message: "Hooo", timestamp: new Date()},
];
var messagesInc = 7;

// ------------------------------------
// Apply Webpack HMR Middleware
// ------------------------------------
if (project.env === 'development') {
  const compiler = webpack(webpackConfig)

  logger.info('Enabling webpack development and HMR middleware')
  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    contentBase: path.resolve(project.basePath, project.srcDir),
    hot: true,
    quiet: false,
    noInfo: false,
    lazy: false,
    stats: 'normal',
  }))
  app.use(require('webpack-hot-middleware')(compiler, {
    path: '/__webpack_hmr'
  }))

  // Serve static assets from ~/public since Webpack is unaware of
  // these files. This middleware doesn't need to be enabled outside
  // of development since this directory will be copied into ~/dist
  // when the application is compiled.
  app.use(express.static(path.resolve(project.basePath, 'public')))

  app.post("/api/messages", function (req, res, next) {
    // find thread
    var id = req.get("user-id") || 1;
    var me = users.filter(u=>u.id==id)[0];
    var thread = threads.filter(u => u.id == req.body.threadId)[0];

    thread.group.forEach(user=>{
      var message = {
        id: messagesInc++, from: me, to: user, threadId: req.body.threadId, message: req.body.message, timestamp: new Date()
      }

      if(user.id == me.id){
        message.isRead = 1;
        res.send(message);
      }
      console.log("user-"+user.id, message);
      io.emit("user-"+user.id, message);
      messages.push(message);
    })
  });

  app.get("/api/messages", function (req, res, next) {
    console.log(req.query);
    var id = req.get("user-id") || 1;
    var matches = messages.filter(u => u.threadId == req.query.threadId && u.to.id == id)
    matches.forEach(m => {
      m.isRead = 1;
    })
    return res.send(matches);
  });

  app.get("/api/threads", function (req, res, next) {
    var id = req.get("user-id") || 1;
    var matches = threads.filter(t => t.group.filter(u => u.id == id).length > 0)
    matches.forEach(t => {
      // find threadname
      t.threadName = t.group.filter(g => g.id != id)[0].name;

      // find last message
      var matchMessages = messages.filter(m => t.id == m.threadId && m.to.id == id);
      var sorted = _.sortBy(matchMessages, 'timestamp');
      if (sorted.length > 0) {
        t.lastMessage = sorted[sorted.length - 1];
      }
    })
    return res.send(matches);
  });

  app.post("/api/login", function (req, res, next) {
    var match = users.filter(user => user.name == req.body.name);
    if (match.length > 0) {
      return res.send(match[0]);
    } else {
      var user = {name: req.body.name, id: userInc++};
      users.push(user);
      return res.send(user);
    }
  });


  http.listen(4000);

  // This rewrites all routes requests to the root /index.html file
  // (ignoring file requests). If you want to implement universal
  // rendering, you'll want to remove this middleware.
  app.use('*', function (req, res, next) {
    const filename = path.join(compiler.outputPath, 'index.html')
    compiler.outputFileSystem.readFile(filename, (err, result) => {
      if (err) {
        return next(err)
      }
      res.set('content-type', 'text/html')
      res.send(result)
      res.end()
    })
  })
} else {
  logger.warn(
    'Server is being run outside of live development mode, meaning it will ' +
    'only serve the compiled application bundle in ~/dist. Generally you ' +
    'do not need an application server for this and can instead use a web ' +
    'server such as nginx to serve your static files. See the "deployment" ' +
    'section in the README for more information on deployment strategies.'
  )

  // Serving ~/dist by default. Ideally these files should be served by
  // the web server and not the app server, but this helps to demo the
  // server in production.
  app.use(express.static(path.resolve(project.basePath, project.outDir)))
}

module.exports = app
