const { pack, unpack } = require('./common')
const WebSocket = require('ws')
const uuid = require('uuid/v4')

const callbacks = {}

let ws
module.exports = {
  close: () => {
    if (ws) {
      ws.close()
    }
  },
  open: (jwt) => new Promise((resolve, reject) => {
    let t
    ws = new WebSocket('wss://server.galax.be')
    ws.on('open', () => {
      ws.send(pack('authenticate', jwt))
      t = setTimeout(() => {
        reject(new Error('authentication failed: timeout'))
      }, 30000)
    })
    ws.on('message', function incoming (pkg) {
      const [event, data] = unpack(pkg)
      switch (event) {
        case 'authenticated':
          clearTimeout(t)
          if (data === 'success') {
            resolve()
          } else {
            reject(new Error('authentication failed: ' + data))
          }
          break
        case 'get':
        case 'set':
        case 'del':
          if (callbacks[data.id]) {
            try {
              if (data.err) {
                callbacks[data.id][1](data.err)
              } else {
                callbacks[data.id][0](data.value)
              }
            } catch (e) {
              console.log(e.message)
            }
            delete callbacks[data.id]
          }
          break
      }
    })
  }),
  get: (key) => {
    return new Promise((resolve, reject) => {
      const id = uuid()
      callbacks[id] = [resolve, reject]
      ws.send(pack('get', {
        key,
        id: id
      }))
    })
  },
  set: (key, value) => {
    return new Promise((resolve, reject) => {
      const id = uuid()
      callbacks[id] = [resolve, reject]
      ws.send(pack('set', {
        key,
        value,
        id: id
      }))
    })
  },
  del: (key) => {
    return new Promise((resolve, reject) => {
      const id = uuid()
      callbacks[id] = [resolve, reject]
      ws.send(pack('del', {
        key,
        id: id
      }))
    })
  }
}
