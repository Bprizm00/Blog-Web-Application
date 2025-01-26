
import jsdom from "jsdom" ;
import jQuery from "jquery";
import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const date = new Date();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.ejs");
});


app.get("/allBlogs", (req, res) => {
  res.render("blogs.ejs", { blogs: blogs });
});


app.get("/writeBlog", (req, res) => {
  res.render("post.ejs");
});


app.get("/view-blog/:id", (req, res) => {

  const blogIndex = parseInt(req.params.id, 10);
    
  if (isNaN(blogIndex) || blogIndex < 0 || blogIndex >= blogs.length) {
    res.status(404).send("Blog not found."); 
  } else {
    const blog = blogs[blogIndex];

    const escapeHTML = (str) => {
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };

    const escapedContent = escapeHTML(blog.content);

    const formattedContent = escapedContent.replace(/\n/g, "<br>");

    res.render("view.ejs", {
      title: blog.title,
      author: blog.author,
      date: blog.date,
      content: formattedContent,
    });
  }
});


app.post("/blog", (req, res) => {
  const newBlog = {
    title: req.body["title"],
    author: req.body["author"],
    content: req.body["content"],
    date: `${date.toLocaleString("en", {
      month: "long",
    })} ${date.getDate()}, ${date.getFullYear()}`,
  };
  blogs.push(newBlog);
  res.render("blogs.ejs", { blogs: blogs });
});


let blogEditIndex;
//this gets activated when you click Edit and it renders "post.ejs" file that has a format for you to edit or creating the blog, depending on the button that you clicked
app.post("/editPage", (req, res) => {
  blogEditIndex = req.body["blogIndex"];

  const blogEdit = blogs[blogEditIndex];
  res.render("post.ejs", { blogEdit: blogEdit });
});

//this gets activated when you click Save Changes
app.post("/editBlog", (req, res) => {
  const blogToEdit = blogs[blogEditIndex];
 
  blogToEdit.title = req.body["title"];
  blogToEdit.author = req.body["author"];
  blogToEdit.content = req.body["content"];
  blogToEdit.date = `${date.toLocaleString("en", {
    month: "long",
  })} ${date.getDate()}, ${date.getFullYear()}`;
  res.render("blogs.ejs", { blogs: blogs });
});

//using POST method instead of DELETE cause HTML forms have limitations
app.post("/delete-blog", (req, res) => {
  const blogIndex = req.body["blogIndex"];

  blogs.splice(blogIndex, 1);
  res.render("blogs.ejs", { blogs: blogs });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});



const blogs = [];
blogs.push({
  title: "Adventures with Your Dog",
  author: "Ottie Ellis",
  content:
    "Discover the joy of exploring nature trails with your furry friend. Hiking with your dog not only strengthens your bond but also provides both of you with physical and mental stimulation. Nature trails offer a variety of sights and smells that excite dogs and keep them engaged. Whether it’s a scenic mountain hike or a leisurely walk through a local park, your dog will thrive on the adventure. Remember to bring plenty of water, a comfortable leash, and some treats to keep your pup happy. Embrace the outdoors and create lasting memories with your canine companion.",
  date: `July 5, 2024`,
});

blogs.push({
  title: "The Joy of Outdoor Fun",
  author: "Morgan Tailor",
  content:
    "Nature plays a crucial role in enhancing your dog’s well-being. Spending time outdoors allows dogs to explore new environments, which stimulates their senses and reduces stress. Activities like running through open fields, sniffing new scents, and interacting with other dogs provide both physical exercise and mental enrichment. Regular outdoor play helps combat boredom and behavioral issues, leading to a happier, healthier dog. Incorporate nature into your routine with daily walks, weekend hikes, or visits to the dog park to ensure your pup enjoys the benefits of the great outdoors.",
  date: `August 4, 2024`,
});