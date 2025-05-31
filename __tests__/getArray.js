const MockJob = require ('./lib/MockJob.js'), job = new MockJob ()
const {DbPoolMy} = require ('..')

const pool = new DbPoolMy ({
	db: process.env.CONNECTION_STRING,
})

pool.logger = job.logger

afterAll(async () => {

	await pool.pool.end ()

})

test ('e7707', async () => {
	
	try {
	
		var db = await pool.setResource (job, 'db')
				
		await expect (db.do ('...')).rejects.toThrow ()
		await expect (db.getScalar ('...')).rejects.toThrow ()
		await expect (db.getArray ('SELECT 1 AS id', [], {maxRows: -1})).rejects.toThrow ()
		await expect (db.getArray ('SELECT 1 AS id', [], {maxRows: -Infinity})).rejects.toThrow ()
		await expect (db.getArray ('SELECT 1 AS id', [], {rowMode: 'whatever'})).rejects.toThrow ()

	}
	finally {

		await db.release ()

	}
	
})

test ('getArray 1', async () => {
	
	try {

	 	var db = await pool.setResource (job, 'db')
		
		await db.do ('DROP TABLE IF EXISTS t')

		await db.do ('CREATE TABLE t (id int)')

		await db.do ('INSERT INTO t (id) VALUES (?)', [1])
		await db.do ('INSERT INTO t (id) VALUES (?)', [2])
		await db.do ('INSERT INTO t (id) VALUES (?)', [3])

		{

			const a = await db.getArray ('SELECT * FROM t ORDER BY id')

			expect (a).toStrictEqual ([{id: 1}, {id: 2}, {id: 3}])

			expect (a[Symbol.for ('columns')] [0]).toStrictEqual ({name: 'id', type: 'INT'})

		}

		{

			const a = await db.getScalar ('SELECT * FROM t ORDER BY id', [])

			expect (a).toBe (1)

		}

		await db.do ('DROP TABLE t')

	}
	finally {

		await db.release ()

	}
	
})