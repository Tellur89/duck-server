const app = require('./app');
const port = process.env.PORT || 3000;
const site = "https://duck-server.onrender.com"

app.listen(site, () => {
	console.log(`Server started at port ${port}`);
});
