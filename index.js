const io = require('socket.io-client')

module.exports = (jwt, debug) => {
  return new Promise((resolve, reject) => {
    const socket = io('https://galax.be')
    if(debug) console.log("connecting");
    socket.on('connect', function () {
      if(debug) console.log("connected");
      socket
        .emit('authenticate', { token: jwt })
        .on('authenticated', function () {
          if(debug) console.log("authenticated");
          resolve({
            set: (key, value) => {
              return new Promise((resolve, reject) => {
                socket.emit('set', key, value, err => {
                  if (err) {
                    reject(err)
                  } else {
                    resolve()
                  }
                })
              })
            },
            get: (key) => {
              return new Promise((resolve, reject) => {
                socket.emit('get', key, resolve)
              })
            }
          })
        })
        .on('unauthorized', function (msg) {
          if(debug) console.log("unauthorized");
          reject(new Error('unauthorized: ' + JSON.stringify(msg.data)))
        })
    })
  })
}
