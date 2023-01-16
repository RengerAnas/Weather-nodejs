const http = require("http");
const fs = require("fs");
const requests = require("requests");
const port = process.env.PORT || 3000;

const htmlFile = fs.readFileSync("../index.html", "utf-8");
const getActualTemp = (val) => {
	return Math.floor(val - 273.15);
};
const replaceValues = (htmlFile, values) => {
	var updatedHtmlFile = htmlFile.replace("{%location%}", values.name);
	updatedHtmlFile = updatedHtmlFile.replace("{%country%}", values.sys.country);
	updatedHtmlFile = updatedHtmlFile.replace("{%tempVal%}", getActualTemp(values.main.temp));
	updatedHtmlFile = updatedHtmlFile.replace("{%tempMin%}", getActualTemp(values.main.temp_min));
	updatedHtmlFile = updatedHtmlFile.replace("{%tempMax%}", getActualTemp(values.main.temp_max));
	updatedHtmlFile = updatedHtmlFile.replace("{%tempratureStatus%}", values.weather[0].main);
	// console.log(values.weather[0].main);
	return updatedHtmlFile;
};

const server = http.createServer((req, res) => {
	if (req.url == "/") {
		requests("https://api.openweathermap.org/data/2.5/weather?q=Ahmedabad&appid=b55acd48f02be4cf30c113683a1650ac")
			.on("data", (chunk) => {
				const response = JSON.parse(chunk);
				const realTimeData = replaceValues(htmlFile, response);
				res.write(realTimeData);
			})
			.on("end", (err) => {
				if (err) throw err;
				res.end();
			});
	} else {
		res.end("404 not found");
	}
});

// server.listen(port, "127.0.0.1");

//TODO:   using express with query params

const express = require("express");
const app = express();

app.get("/", (req, res) => {
	console.log(req.query);
	requests("https://api.openweathermap.org/data/2.5/weather?q=" + req.query.name + "&appid=b55acd48f02be4cf30c113683a1650ac")
		.on("data", (chunk) => {
			const response = JSON.parse(chunk);
			const realTimeData = replaceValues(htmlFile, response);
			res.write(realTimeData);
		})
		.on("end", (err) => {
			if (err) throw err;
			res.end();
		});
});

app.listen(port, "127.0.0.1");
