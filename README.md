# Galax.be

Galax.be is a key/value store as a service. It is specifically designed for serverless deployments. The client uses socket.io for communication with the server. This gives a higher latency than using a lower level protocol, but it helps to setup a strong system for data replication and high availability and also helps to manage thousands of client connections to the database server, allowing to use it in a serverless environment like Zeit Now.

## How to use

```javascript
const Galax = require('galax.be')

const token = '...'

;(async () => {

  const db = await Galax(token)

  await db.set('peter', 25)

  const age = await db.get('peter')

  console.log("Peter's Age", age)

})()
```
