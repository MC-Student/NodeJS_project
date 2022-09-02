var express = require('express');
var app = express();
var nodemailer = require('nodemailer');
var mysql = require('mysql');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'pug');


app.use(express.static(__dirname + '/public'));

/**
 * Send user to home page
 */
app.get(['/', '/home'], (req, res) => {
    res.render('home', {
        title: 'Home'
    });
});


 /**
  * Send user to application page
  */
 app.get('/apply', (req, res) =>{
        res.render('apply',{
            title: 'Membership Application'
        });
 });

  /**
   * Received the application. Send user to confirmation page and process data
   */
app.post('/apply_action', (req, res) => {
    //Send them a confirmation email
    sendEmail(req.body.email);
    console.log(req.name);
    res.render('confirmation', {
        title: 'Confirmation',
        name: req.body.name,
        number: req.body.phoneNumber,
        email: req.body.email,
        reason: req.body.reason
    });
});
   /**
    * Send user to member listing page
    */
   app.get('/members', (req, res) =>{
        //get the member listing
        try{
            var allMembers = [];
            getMembers(allMembers,res);
        }
        catch(error){
            console.log('error with database!');
        }      
   });


    /**
     * Get form to add a member
     */
app.get('/add', (req, res) =>{
    res.render('add',{
        title: 'Add Member'
    })
});

    /**
     * Add the member to database
     */
app.post('/add_member', (req, res) => {
    
    addMember(req, res);

});


const server = app.listen(8080, () => {
    console.log(`Express running -> PORT ${server.address().port}`);
});

app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
  })


/**
 * Method to send them a confirmation email.
 * @param {} emailAdd 
 */
function sendEmail(emailAdd){
    var transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: '-----------',
            pass: '-----------'
        }
    });

    var mailOptions = {
        from: '----------', 
        to: emailAdd,
        subject: 'Application Confirmation', 
        html: 'Hi there! <br> This is a confirmation email for your application to the LCW ACM club.<br> One of our dedicated student leaders will review your application.<br>Looking forward to speaking with you, <br>The LCW ACM team'
    };

    transport.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }
         else {
            console.log('Email sent: ' + info.response);
        }
    });
}

function getMembers(members, res){
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "acm_website_php"

    });

    con.connect(function(err){
        //var members = [];
        if(err) throw err;
        else{
            console.log("connected!");
        }
        var sql = "SELECT * FROM members";
        con.query(sql, function(err, result, fields){
            if (err){
                console.log("error here");
                console.log("err");
                throw err;
            } 
            totalMembers = result.length;
            for(var i = 0; i < result.length; i++){
                var Member = {
                    'name':result[i].MEMBER_NAME,
                    'start_date':result[i].MEMBER_START,
                    'major':result[i].MEMBER_MAJOR,
                    'grad_year':result[i].MEMBER_GRAD
                }
                members.push(Member);
            }
            for(var i = 0; i < members.length; i++){
                console.log(members[i]);
            }
            console.log("done looping");
            //return classes;
            res.render('members', {
                title: 'Current member listing',
                list: members
            });
        });
        
    });
    
}

function addMember(req, res ){
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "acm_website_php"
    });

    con.connect(function(err){
        if(err) throw err;
        else{
            console.log("Connected...")
        }
        var sql = "INSERT INTO members (MEMBER_NAME, MEMBER_START, MEMBER_MAJOR, MEMBER_GRAD) VALUES ('" + req.body.name+"','"+ req.body.start_date +"','" +  req.body.major + "','" +  req.body.grad_year + "');";
        console.log("sql query: " + sql);
        con.query(sql, function (error, results, fields) {
            if (error) throw error;
            res.redirect('/members');
          });
    });
}