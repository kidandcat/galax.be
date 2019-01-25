const io = require('socket.io-client')

module.exports = (jwt) => {
  return new Promise((resolve, reject) => {
    const socket = io('https://galax.be')
    socket.on('connect', function () {
      socket
        .emit('authenticate', { token: jwt })
        .on('authenticated', function () {
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
          reject(new Error('unauthorized: ' + JSON.stringify(msg.data)))
        })
    })
  })
}
