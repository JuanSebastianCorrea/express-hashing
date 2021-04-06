/** Routes for demonstrating authentication in Express. */

const express = require('express');
const router = new express.Router();
const ExpressError = require('../expressError');
const db = require('../db');
const bcrypt = require('bcrypt');

const { BCRYPT_WORK_FACTOR, SECRET_KEY } = require('../config');

router.get('/', (req, res, next) => {
	res.send('APP IS WORKING!!!');
});

router.post('/register', async (req, res, next) => {
	try {
		const { username, password } = req.body;
		// hash password
		const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
		// save to db
		const results = await db.query(
			`
      INSERT INTO users (username, password)
      VALUES ($1, $2)
      RETURNING username`,
			[ username, hashedPassword ]
		);
		return res.json(results.rows[0]);
	} catch (e) {
		return next(e);
	}
});

module.exports = router;
