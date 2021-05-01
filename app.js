const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.listen(process.env.PORT || 3000,function(){
  console.log("Server is running at port 3000...");
});


app.get("/",function(req,res){
  res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res){
  //res.send("Datas Received");
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email

  const data = {
    members: [
      {
        email_address:email,
        status:"subscribed",
        merge_fields :{
          FNAME:firstName,
          LNAME:lastName
        }
      }
    ]
  }


  const jsonData = JSON.stringify(data);

  const url = "https://us1.api.mailchimp.com/3.0/lists/dd5a2d08fa";
  const options = {
    method:"post",
    auth: "Rahul1:f14ab91dfc62b53a351a910833503dae-us1"
  }
  const request = https.request(url,options,function(response){
      response.on(data,function(data){
        console.log(JSON.parse(data));
      } );
      if(response.statusCode==200){
        res.sendFile(__dirname+"/success.html");
      }
      else{
        res.sendFile(__dirname+"/failure.html");
      }
  });

  //very important to send data to external server
  request.write(jsonData);
  request.end();
});


// MailChip ApiKey
// f14ab91dfc62b53a351a910833503dae-us1


// unique
// dd5a2d08fa



app.post("/failure",function(req,res){
  res.redirect("/");  // Redirect to home route
});
