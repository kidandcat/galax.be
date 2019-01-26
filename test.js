const Galax = require('./index')

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiIxZjljZjM1Yi0zNGU2LTQ5MjgtODJlNS0wN2RiNzE1Yjg5YWQifQ.0vGSy4WfjUEzLTdR6WK5-eNBbEXK4qJ-H176dxzSKWI'

;(async () => {
  const db = await Galax(token)
  for (let y = 0; y < 100; y++) {
    console.time("dbsave"+y);
    await db.set('jairo'+y, 25)
    const age = await db.get('jairo'+y)
    console.log(y + " Jairo's Age", age)
    console.timeEnd("dbsave"+y)
  }
})()
