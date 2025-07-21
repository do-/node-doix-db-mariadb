const Path = require ('path')
const {DbModel, DbView, DbProcedure, DbFunction} = require ('doix-db')
const MockJob = require ('./lib/MockJob.js'), job = new MockJob ()
const {DbPoolMy} = require ('..')

const pool = new DbPoolMy ({
	db: process.env.CONNECTION_STRING,
})

pool.logger = job.logger

afterAll(async () => {

	await pool.pool.end ()

})

test ('basic', async () => {
	
	try {

		const model = new DbModel ({
			src: {
				root: Path.join (__dirname, 'data', 'root1')
			},
			db: pool
		})

		model.loadModules ()

		var db = await pool.setResource (job, 'db'), {lang} = db

		await db.do (`DROP TABLE IF EXISTS __drop_me`)

		expect (() => lang.genReCreate ({})).toThrow ()

		for (const o of model.objects ()) if (o instanceof DbView) await db.do (lang.genReCreate (o))

		{
			
			const a = await db.getArray ('SELECT * FROM vw_1')

			expect (a).toStrictEqual ([{id: 1}])

		}

		for (const o of model.objects ()) if (o instanceof DbProcedure) {

			await db.do (lang.genReCreate (o))

		}

		{

			const a = await db.getArray ('CALL proc_1 (?)', [2])

			expect (a).toStrictEqual ([{id: 2}])

			expect (a [Symbol.for ('call')].okPacket).toEqual ({affectedRows: 0, insertId: 0n, warningStatus: 0})

		}

		for (const o of model.objects ()) if (o instanceof DbFunction) {

			await db.do (lang.genReCreate (o))

		}

		{

			const a = await db.getArray ('SELECT f_1 (?) id ', [3])

			expect (a).toStrictEqual ([{id: 4}])

		}

		{

			await db.do (`CREATE TABLE __drop_me (id INT AUTO_INCREMENT PRIMARY KEY, label TEXT)`)

			const id = await db.getScalar ('SELECT f_2 (?)', ['AAA'])

			expect (id).toBe (1)

			const a = await db.getArray ('SELECT * FROM __drop_me')

			expect (a).toStrictEqual ([{id: 1, label: 'AAA'}])

		}

		{

			await db.do (`TRUNCATE __drop_me`)

			for (const sql of lang.genReCreateTriggers (model.find ('__drop_me'))) await db.do (sql)

			const id = await db.getScalar ('SELECT f_2 (?)', ['AAA'])

			expect (id).toBe (1)

			const a = await db.getArray ('SELECT * FROM __drop_me')

			expect (a).toStrictEqual ([{id: 1, label: '#0'}])

		}


		await db.do (`DROP TABLE IF EXISTS __drop_me`)

	}
	finally {

		await db.release ()

	}
	
})