const express = require('express');
const path = require('path');
const dns = require('dns');
const BodyParser = require('body-parser');
const Mongoose = require('mongoose');
const { getResponse, makeShortUrl } = require('./util');

const app = express();
const port = process.env.port || 8080;

Mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

const urlModel = Mongoose.model('Url', {
	longUrl: String,
	shortUrl: String,
});

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) =>
	res.sendFile(path.join(__dirname, '/views/index.html')),
);

app.get('/api/shorturl/:shortUrl', async (req, res) => {
	try {
		const doc = await urlModel.findOne({ shortUrl: req.params.shortUrl });
		res.redirect(doc.longUrl);
	} catch (error) {
		res.status(500).send(error);
	}
});

app.post('/api/shorturl/new', (req, res) => {
	try {
		const { url: longUrl } = req.body;
		const { hostname } = new URL(longUrl);

		dns.lookup(hostname, async err => {
			if (!err) {
				const shortenedUrl = await urlModel.findOne({ longUrl });

				if (shortenedUrl) {
					res.send(getResponse(shortenedUrl));
				} else {
					const shortUrl = makeShortUrl(longUrl);
					const url = new urlModel({ longUrl, shortUrl });
					const doc = await url.save();

					res.send(getResponse(doc));
				}
			} else {
				res.send({ error: 'invalid URL' });
			}
		});
	} catch (error) {
		res.status(500).send(error);
	}
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
