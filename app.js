//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "All the homepages listed here are highly usable, meaning they are easy to navigate and there aren't flashy objects that get in the way of browsing, such as flash banners, animations, pop-ups, or overly-complicated and unnecessary elements. Many are also mobile-optimized, which is an incredibly important must-have in today's mobile world.";
const aboutContent = "We've created a sample About Us template designed to work well for virtually any online store, blog, or website. Just fill in the brackets with your company's information and you'll have a professional About Us page written in minutes. If you want to put a personal touch on your page (which we highly recommend), check out the About Us examples below the template.";
const contactContent = 
`Phone: 905-495-3456 
 Address: 168 Tinkerbell drive
 Email: NavsBlogger@gmail.com
`;

const database = process.env.DATABASE

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

// static files
app.use(express.static("public"));

mongoose.connect(`mongodb://localhost:27017/${database}`, {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
