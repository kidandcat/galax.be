module.exports = {
  pack: (eventName, data) => (JSON.stringify({
    event: eventName,
    data
  })),
  unpack: (packet) => {
    try {
      const p = JSON.parse(packet)
      return [p.event, p.data]
    } catch (e) {
      console.log('INVALID JSON', packet)
    }
  }
}
