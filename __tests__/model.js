const Path = require ('path')
const {DbModel, DbView, DbProcedure} = require ('doix-db')
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

	}
	finally {

		await db.release ()

	}
	
})