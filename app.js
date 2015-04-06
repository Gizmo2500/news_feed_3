var express = require('express');
var bodyParser = require('body-parser');
var pg = require("pg");
var methodOverride = require("method-override");

var app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

// Refactor connection and query code
var db = require("./models");

app.get('/articles', function(req,res) {
  db.Article.findAll().then(function (articles) {
      res.render("articles/index", {articlesList: articles});
    });

  console.log("GET /articles");
});

app.get('/articles/new', function(req,res) {
  res.render('articles/new');
});

app.post('/articles', function(req,res) {
  console.log(req.body);
  db.Article.create({title: req.body.article.title, author: req.body.article.author,
  	content: req.body.article.content, fiction: true}).then(function (article) {
  		res.redirect("/articles");
  	});
});
//this works!
app.get('/articles/:id', function(req, res) {
  console.log(req.body);

  db.Article.find(req.params.id).then(function (article) {
  		res.render("articles/article", {articleToDisplay: article});
  	});
  
})
// currently working on edit
app.get("/articles/:id/edit", function (req, res) {
	db.Article.find(req.params.id).then(function (article) {
		res.render("articles/edit", {article: article});
		
	});
});

app.put("/articles/:id", function (req, res) {
	db.Article.find(req.params.id)
		.then(function (article) {
			console.log(article);
			article.updateAttributes({
				title: req.body.article.title,
				content: req.body.article.content,
				author: req.body.article.author
			})
			.then(function (article) {
				res.redirect("/articles/" + article.id);
			})
		})
});


app.get('/', function(req,res) {
  res.render('site/index.ejs');
});

app.get('/about', function(req,res) {
  res.render('site/about');
});

app.get('/contact', function(req,res) {
  res.render('site/contact');
});

app.listen(3000, function() {
  console.log('Listening');
});
