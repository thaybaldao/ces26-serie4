const express = require('express') 
const path = require('path')
const multer = require("multer")
var bodyParser = require('body-parser')
const app = express() 
  
// Static Middleware 
app.use(express.static(path.join(__dirname, 'public'))) 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// View Engine Setup 
app.set('views', path.join(__dirname, 'views')) 
app.set('view engine', 'ejs') 
  
app.get('/', function(req, res){ 
    res.render('Home') 
})
    
var storage = multer.diskStorage({ 
    destination: function (req, file, cb) { 
  
        // uploads is the upload folder name 
        cb(null, "uploads") 
    }, 
    filename: function (req, file, cb) { 
      cb(null, "dog" + Date.now() + ".jpg") 
    } 
  }) 
       
// Define the maximum size for uploading
const maxSize = 5 * 1000 * 1000; // 5 MB
    
var upload = multer({  
    storage: storage, 
    limits: { fileSize: maxSize }, 
    fileFilter: function (req, file, cb){ 
    
        // Set the filetypes, it is optional 
        var filetypes = /jpeg|jpg|png/; 
        var mimetype = filetypes.test(file.mimetype); 
  
        var extname = filetypes.test(path.extname(file.originalname).toLowerCase()); 
        
        if (mimetype && extname) { 
            return cb(null, true); 
        } 
      
        cb("Error: File upload only supports the following filetypes - " + filetypes); 
      }  
  
// pic is the name of file attribute 
}).single("pic");        
     
app.post("/upload",function (req, res, next) { 
        
    // Error MiddleWare for multer file upload, so if any 
    // error occurs, the image would not be uploaded! 
    upload(req,res,function(err) { 
  
        if(err) {
            // ERROR occured (here it can be occured due 
            // to uploading image of size greater than 
            // 1MB or uploading different file type) 
            res.send(err) 
        } 
        else { 
            // SUCCESS, image successfully uploaded 
            res.send("Success, Image uploaded!") 
        } 
    }) 
})

var answers = {
  yes: 0,
  no: 0
};

app.post("/answer", function(req, res) { 
	var user_answer = Number(req.body.answer);
	if(user_answer === 1){
		answers.yes += 1;
	} else {
		answers.no += 1;
	}

	res.send("Success, your answer was stored!"); 
});

app.get('/pool', function(req, res){ 
	var total = answers.yes + answers.no;
	var perc = 0;
	if(total > 0){
		perc = ((answers.yes/total)*100).toFixed(2);
		res.send(answers.yes + "/" + total + " (" + perc + "%) visitors said they love dogs!")
	} else {
		res.send("No visitors answered the pool.")
	}
  
})
  
app.listen(8000, function(error){ 
    if(error) throw error 
    console.log("Server created Successfully") 
}) 