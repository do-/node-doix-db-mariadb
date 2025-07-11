const {DbLangMy} = require ('..')

test ('qq', () => {

	const lang = new DbLangMy ()

	expect (lang.quoteName ('users')).toBe ('`users`')
	expect (lang.quoteName (' ` ')).toBe ('` `` `')
	
})
