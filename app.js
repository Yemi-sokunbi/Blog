var bodyParser      = require("body-parser"),
Mongoose            = require("mongoose"),
express             = require("express"),
methodOverride      = require("method-override"),
expressSanitizer    = require("express-sanitizer"),
app                 = express();

      
Mongoose.connect("mongodb://127.0.0.1/blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

var blogSchema = new Mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = Mongoose.model("Blog", blogSchema)

// Blog.create ({
//     title: "In Search",
//     image: "https://m.media-amazon.com/images/M/MV5BNDUyODAzNDI1Nl5BMl5BanBnXkFtZTcwMDA2NDAzMw@@._V1_SX300.jpg",
//     body: "To be filled"
// })

// Index
app.get("/", function(req,res){
    res.redirect("/blogs");
});

app.get("/blogs", function(req,res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err)
        } else { res.render("index", {blogs: blogs})}
    })
});

//New
app.get("/blogs/new", function(req,res){
    res.render("new",{});
});

//Create
app.post("/blogs", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err,blog){
        if(err){
            consoole.log(err);
        } else {res.redirect("/blogs")}
    })
})

//Show
app.get("/blogs/:id", function(req,res){
    var id = req.params.id;
    Blog.findById(id, function(err, blog){
        if(err){
            console.log(err)
        } else{res.render("show", {blog: blog})}
    })
});

//Edit
app.get("/blogs/:id/edit",function(req,res){
    var id = req.params.id;
    Blog.findById(id, function(err, blog){
        if(err){
            console.log(err)
        }
        else{
            res.render("edit", {blog:blog})
        }
    })
});

//Update
app.put("/blogs/:id", function(req, res){
    //Find the data with :id
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,blog){
        if(err){
            res.redirect("/blogs")
        } else{
            res.redirect("/blogs/" + req.params.id)
        }
    })  
})

//Delete Route
app.delete("/blogs/:id", function(req,res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs")
        }else{res.redirect("/blogs")}
    })
})



app.listen("2000", function(){
    console.log("Blog server is running");
})