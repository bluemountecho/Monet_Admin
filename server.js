const express = require('express');
const session = require('express-session');
const path = require('path');
const cors = require('cors')
const bodyParser = require('body-parser')
const knex = require('knex')({
    client: 'mysql',
    connection: {
        host : '127.0.0.1',
        port : 3306,
        user : 'root',
        password : '',
        database : 'db_monet'
    }
})
const fs = require('fs')
const { Console } = require("console");
const myLogger = new Console({
  stdout: fs.createWriteStream("log.txt"),
  stderr: fs.createWriteStream("log.txt"),
});

require('dotenv').config();

const md5 = require('md5');
const { verify } = require('crypto');
const app = express();
const nodemailer = require('nodemailer');
const fileUpload = require('express-fileupload');
const transporter = nodemailer.createTransport({
    port: 587,
    host: "smtp.gmail.com",
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
    },
    secure: false,
    secureConnection: false,
    tls: {
        ciphers:'SSLv3'
    }
})

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 52428800 }));
app.use(bodyParser.json({limit: '50mb'}));
// app.use(bodyParser.text({limit: '50mb', type: "multipart/form-data"}));
// app.use(bodyParser.raw({limit: '50mb', type: "multipart/form-data"}));

app.use(cors())
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(fileUpload())

app.use(express.static(path.join(__dirname, '/build')));
app.use(express.static(path.join(__dirname, '/public')));


function convertTimestampToString(timestamp, flag = false) {
    if (flag == false) {
        return new Date(timestamp).toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/ /g, '_').replace(/:/g, '_').replace(/-/g, '_')
    } else {
        return new Date(timestamp).toISOString().replace(/T/, ' ').replace(/\..+/, '')
    }
}

app.post('/checkSession', function (req, res) {
    return res.send('2')

    if (!req.session.user) {
        res.send('0')
        return
    }

    if (req.session.user.verifyCode && req.session.user.verifyCode != '') {
        res.send("2")
    } else if (req.session.user.username && req.session.user.username != '') {
        res.send('1')
    } else {
        res.send('0')
    }
})

app.post('/verifycode', async function (req, res) {
    let verifyCode = req.body.verifyCode

    if (!req.session.user) {
        res.redirect('http://localhost:3001/#/login')
        return
    }

    if (verifyCode) {
        var rows = await knex('tbl_users').where('username', req.session.user.username).where('password', req.session.user.password).where('verify_code', verifyCode).select('*')

        if (rows.length) {
            req.session.user.verifyCode = rows[0].verify_code

            res.redirect('http://localhost:3001/#/dashboard')
        } else {
            res.redirect('http://localhost:3001/#/verifycode')
        }
    } else {
        res.redirect('http://localhost:3001/#/verifycode')
    }
})

app.post('/login', async function(req, res) {
	// Capture the input fields
	let username = req.body.username;
	let password = md5(req.body.password);
    let email = req.body.email;
    
	// Ensure the input fields exists and are not empty
	if (username && password) {
        var rows = await knex('tbl_users').where('username', username).where('password', password).select('*')

        if (rows.length) {
            req.session.user = {
                username: username,
                password: password,
                email: email
            }

            var code = md5(username + password + email + new Date().toISOString())

            await knex('tbl_users').where('username', username).where('password', password).update({
                verify_code: code
            })

            const mailData = {
                from: process.env.MAIL_FROM_ADDRESS,
                to: email,
                subject: 'ESKILLZ admin panel verify code',
                text: 'This is your verify code!',
                html: '<b>This is your verify code! </b><br/>\
                    <h1>' + code + '</h1><br/>\
                    Thanks!'
            };

            transporter.sendMail(mailData, function (err, info) {
                // if(err)
                //   console.log(err)
                // else
                //   console.log(info);
            });

            res.redirect('http://localhost:3001/#/verifycode')
        } else {
            res.redirect('http://localhost:3001/#/login')
        }
	} else {
		res.redirect('http://localhost:3001/#/login')
	}
});

app.post('/saveblog', async function (req, res) {
    var title = req.body.blog_title
    var description = req.body.blog_description
    var image = req.files.blog_image
    var content = req.body['content[]']
    var uploadPath = '/blogs/blog' + (new Date().getTime()) + image.name

    await knex('tbl_blogs').insert({
        blog_title: title,
        blog_description: description,
        blog_image: uploadPath,
        created_at: convertTimestampToString(new Date().getTime(), true),
        content: content.join(''),
    })

    image.mv(path.join(__dirname, 'public', uploadPath), function (err) {
        res.redirect('http://localhost:3001/#/announcements')
    })
})

app.get('/getblogs', async function (req, res) {
    var rows = await knex('tbl_blogs').orderBy('created_at', 'desc').select('*')

    res.send(rows)
})

app.get('/deleteblog/:blogID', async function (req, res) {
    var blogID = req.params.blogID

    await knex('tbl_blogs').where('blog_id', blogID).delete()
    
    res.redirect('http://localhost:3001/#/announcements')
})

app.post('/savefaq', async function (req, res) {
    var title = req.body.faq_title
    var description = req.body.faq_description

    await knex('tbl_faqs').insert({
        faq_title: title,
        faq_description: description,
    })
    
    res.redirect('http://localhost:3001/#/faqs')
})

app.get('/getfaqs', async function (req, res) {
    var rows = await knex('tbl_faqs').select('*')

    res.send(rows)
})

app.get('/deletefaq/:faqID', async function (req, res) {
    var faqID = req.params.faqID

    await knex('tbl_faqs').where('faq_id', faqID).delete()
    
    res.redirect('http://localhost:3001/#/faqs')
})

app.get('/getreflect', async function (req, res) {
    var rows = await knex('tbl_reflect').select('*')
    
    res.send(rows[0])
})

app.post('/setreflect', async function (req, res) {
    var period = req.body.period

    await knex('tbl_reflect').update({
        reflect_period: period,
        lastReflect_at: convertTimestampToString(new Date().getTime(), true).split(' ')[0]
    })
    
    res.send('success')
})

app.listen(80);