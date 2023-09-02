const express = require("express");
const axios = require("axios");
const redisClient = require('./redis')

const app = express();


const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
	res.send('<h1>root</h1>')
});



const setResponse = (data) => {
	return `<h2>ID: ${data.id}</h2><h3>${data.title}</h3><div>${data.body}</div>`
}

const getPost = async (req, res) => {
	try {
		console.log('slow api request')
		console.log('params', req.params)
		const { id } = req.params
		if (req.params.id === 'favicon.ico') {
			res.status(404).end()
		} else {
			const api_res = await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`)
			const { data } = api_res
			await redisClient.connect()
			await redisClient.set(id, JSON.stringify(data))
			await redisClient.disconnect()
			res.send(setResponse(data))
		}
	} catch (err) {
		console.error('axios error', err)
		res.status(500).end()
	}
}

const cache = async (req, res, next) => {
	const { id } = req.params;
	try {
		await redisClient.connect()
		const data = await redisClient.get(id)
		await redisClient.disconnect()
		if (data !== null) {
			console.log('found redis key')
			res.send(setResponse(JSON.parse(data)))
		} else {
			console.log('no redis key')
			next()
		}
	} catch (error) {
		console.log('redis get error', error)
	}

}

app.get("/:id", cache, getPost);

app.listen(PORT, () => {
	console.log(`Express running on port ${PORT}`);
});
