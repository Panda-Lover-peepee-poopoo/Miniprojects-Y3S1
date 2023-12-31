
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
const JWT_SECRET = "mit132334#@$$$";

const {donors,NGO,ADMIN} = require('./models/User');
// const Sequelize = require('sequelize');
const express = require('express');
const bodyParser = require('body-parser');

const { body, validationResult } = require('express-validator');
//const mysql = require('mysql');

const cors = require('cors');

  const app = express();
  app.use(bodyParser.json());
  app.use(cors());
  const bcrypt = require('bcryptjs');

// signup actaul student
app.post('/donorspost', [
  // Validate the name field
  body('name').notEmpty().isLength({ max: 255 }),

  // Validate the email field
  body('email').notEmpty().isEmail(),

  // Validate the password field
  body('cpassword').notEmpty().isLength({ min: 6 }),

  // Validate the confirm password field
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.cpassword) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  }),
], async  (req, res) => {
  var success=false;
  // Check if there are any validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({success, errors: errors.array() });
  }

 // Hash the password
 const salt = await bcrypt.genSalt(10);
 const hashedPassword = await bcrypt.hash(req.body.cpassword, salt);


  // Insert the user data into the MySQL database
  const { name, email, cpassword  ,confirmPassword } = req.body;
 
  donors.create({ name, email, cpassword : hashedPassword ,confirmPassword })
  .then((donor) => {
    const payload = { id: donor.id };
    const token = jwt.sign(payload, JWT_SECRET);
    console.log(token);
    success=true;
    res.status(201).json({success,donor,token});
  })
  .catch((error) => {
    console.log("Error :",error);
  });
 
});

// signup actaul guide
app.post('/adminpost', [
    // Validate the name field
    body('name').notEmpty().isLength({ max: 255 }),
  
    // Validate the email field
    body('email').notEmpty().isEmail(),
  
    // Validate the password field
    body('cpassword').notEmpty().isLength({ min: 6 }),
  
    // Validate the confirm password field
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.cpassword) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
  ], async  (req, res) => {
    var success=false;
    // Check if there are any validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
   // Hash the password
   const salt = await bcrypt.genSalt(10);
   const hashedPassword = await bcrypt.hash(req.body.cpassword, salt);
    // Insert the user data into the MySQL database
    const { name, email, cpassword  ,confirmPassword } = req.body;
   
    ADMIN.create({ name, email,cpassword : hashedPassword ,confirmPassword })
    .then((ADMIN) => {
      const payload = { id: ADMIN.id };
      const token = jwt.sign(payload, JWT_SECRET);
      console.log(token);
      success=true;
              res.status(201).json({success,ADMIN,token});
            })
            .catch((error) => {
             console.log("Error :",error);
                });
   
  });

  // signup actaul coordinator
app.post('/NGOpost', [
    // Validate the name field
    body('name').notEmpty().isLength({ max: 255 }),
  
    // Validate the email field
    body('email').notEmpty().isEmail(),
  
    // Validate the password field
    body('cpassword').notEmpty().isLength({ min: 6 }),
  
    // Validate the confirm password field
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.cpassword) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
  ], async  (req, res) => {
    var success=false;
    // Check if there are any validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
  
   // Hash the password
   const salt = await bcrypt.genSalt(10);
   const hashedPassword = await bcrypt.hash(req.body.cpassword, salt);
  
  
    // Insert the user data into the MySQL database
    const { name, email, cpassword  ,confirmPassword } = req.body;
   
    NGO.create({ name, email, cpassword : hashedPassword ,confirmPassword })
    .then((NGO) => {
      const payload = { id: NGO.id };
      const token = jwt.sign(payload, JWT_SECRET);
      console.log(token);
      success=true;
              res.status(201).json({success,NGO,token});
            })
            .catch((error) => {
             console.log("Error :",error);
                });
   
  });









// login actaul // student
app.post('/donorslogin', async (req, res) => {
  var success = false ;
  const { email, cpassword } = req.body;

  // Find the user in the MySQL database
  const user = await donors.findOne({ where: { email: email } });
  if (!user) {
    return res.status(400).json({success, message: 'Invalid credentials' });
  }

  // Compare the password with the hashed password in the database
  const isValidPassword = await bcrypt.compare(cpassword, user.cpassword);
  if (!isValidPassword) {
    return res.status(400).json({success, message: 'Invalid credentials' });
  }

  // Create and send a JWT token as a response
  success=true;
  const payload = { id: user.id};
  const token = jwt.sign(payload , JWT_SECRET);
  res.json({success, token });
});

// login actaul guide
app.post('/ADMINlogin', async (req, res) => {
    var success = false ;
    const { email, cpassword } = req.body;
  
    // Find the user in the MySQL database
    const user = await ADMIN.findOne({ where: { email: email } });
    if (!user) {
      return res.status(400).json({success, message: 'Invalid credentials' });
    }
  
    // Compare the password with the hashed password in the database
    const isValidPassword = await bcrypt.compare(cpassword, user.cpassword);
    if (!isValidPassword) {
      return res.status(400).json({success, message: 'Invalid credentials' });
    }
  
    // Create and send a JWT token as a response
    success=true;
    const payload = { id: user.id};
    const token = jwt.sign(payload , JWT_SECRET);
    res.json({success, token });
  });


  // login actaul // co
app.post('/NGOlogin', async (req, res) => {
    var success = false ;
    const { email, cpassword } = req.body;
  
    // Find the user in the MySQL database
    const user = await NGO.findOne({ where: { email: email } });
    if (!user) {
      return res.status(400).json({success, message: 'Invalid credentials' });
    }
  
    // Compare the password with the hashed password in the database
    const isValidPassword = await bcrypt.compare(cpassword, user.cpassword);
    if (!isValidPassword) {
      return res.status(400).json({success, message: 'Invalid credentials' });
    }
  
    // Create and send a JWT token as a response
    success=true;
    const payload = { id: user.id};
    const token = jwt.sign(payload, JWT_SECRET);
    res.json({success, token });
  });




//   // ***************************** Review ***********************

//   const {review1,review1_results,Ppt,review2_results,review3_results,Ppt3,project} = require('./models/User');
const {project,review_results,donation} = require('./models/User');
//   // post topics
// app.post('/topicpost', async  (req, res) => {
//   var success=false;

//   // Insert the user data into the MySQL database
//   const { guideEmail,studentEmail,PANEL,RollNo,PRN,  topic1 , topic2 , topic3 } = req.body;
 
//   review1.create({guideEmail, studentEmail,PANEL,RollNo,PRN, topic1 , topic2 , topic3})
//   .then((review1) => {
//     success=true;
//             res.status(201).json({success,review1});
//           })
//           .catch((error) => {
//             success = false;
//            console.log("Error hai s:",error);
//            res.status(201).json(error.fields);
//               });
 
// });



//chatgpt
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'pandasql',
  database: 'charity1',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// // app.get('/gettopics', async (req, res) => {
// //   try {
// //     const [rows, fields] = await pool.execute('SELECT * FROM review1s');
// //     const result = JSON.parse(JSON.stringify(rows));
  
// //     res.send(result);
// //   } catch (error) {
// //     console.log(error);
// //     res.status(500).send('Error retrieving data from database');
// //   }
// // });
// //new gettopics
// app.post('/gettopics', async (req, res) => {
//   const { studentEmail } = req.body;
//   const { guideEmail } = req.body;
//   try {
//     const reviews = await review1.findAll({
//       where: {
//         studentEmail: studentEmail,
//         guideEmail: guideEmail
//       }
//     });
//     res.send(reviews);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send('Error retrieving reviews from database');
//   }
// });


// // *********** getstudentguide  student 
// app.post('/getppt3', async (req, res) => {
//   try {
//     const { studentEmail } = req.body;
//   const { guideEmail } = req.body;
//     const [rows, fields] = await pool.execute(`SELECT * FROM ppt3s WHERE studentEmail = ? and guideEmail=?`, [studentEmail,guideEmail]);
//     const result = JSON.parse(JSON.stringify(rows));
//     res.send(result);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send('Error retrieving data from database');
//   }
// });

//   // post result 1
//   app.post('/result_1', async  (req, res) => {
//     var success=false;
  
//     // Insert the user data into the MySQL database
//     const { email , topic ,marks } = req.body;
   
//     review1_results.create({ email, topic ,marks})
//     .then((result_1) => {
//       success=true;
//               res.status(201).json({success,result_1});
//             })
//             .catch((error) => {
//              console.log("error hai : ",error)
//                 });
   
//   });

//   // get result 1
//   app.post('/getresult1', async (req, res) => {
//     try {
//       const email = req.body.email;
//       const [rows, fields] = await pool.execute(`SELECT * FROM review1_results WHERE email='${email}'`);
//       const result = JSON.parse(JSON.stringify(rows));
//       res.send(result);
//     } catch (error) {
//       console.log(error);
//       res.status(500).send('Error retrieving data from database');
//     }
//   });

  //sendppt review 2
// configure multerconst storage = multer.diskStorage({
  const multer = require('multer');
const fs = require('fs');
const path = require('path');
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'C:\\Users\\Acer\\Desktop\\charity\\backend\\uploads');
    },
    filename: (req, file, cb) => {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    }
  });

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'application/vnd.ms-powerpoint' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only ppt and pptx files are allowed.'));
    }
  }
}).single('ppt');

// review 2
app.post('/sendppt', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error(err.message);
      return res.status(400).send(err.message);
    }

    // File is uploaded successfully
    const ppt = req.file;
    const NGOEmail = req.body.NGOEmail;
    const projectname = req.body.projectname;
    const filename = req.body.filename;


    // Store the file in the database
    const pptData = fs.readFileSync(path.join(__dirname, `uploads/${ppt.filename}`));
    // Your database code here...
    project.create({ NGOEmail,projectname,filename, pptData })
    .then((result) => {
      success=true;
              res.status(201).json({success,result});
            })
            .catch((error) => {
             console.log("error hai : ",error)
                });
  });
});


app.post('/getppt', async (req, res) => {
  try {

  const { NGOEmail } = req.body;
    const [rows, fields] = await pool.execute(`SELECT * FROM projects`);
    const result = JSON.parse(JSON.stringify(rows));
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send('Error retrieving data from database');
  }
});

//post result 2
app.post('/entermarks', async  (req, res) => {
  var success=false;

  // Insert the user data into the MySQL database
  const { NGOEmail ,projectname,status } = req.body;
 
  review_results.create({ NGOEmail,projectname,status})
  .then((result_2) => {
    success=true;
            res.status(201).json({success,result_2});
          })
          .catch((error) => {
           console.log("error hai : ",error)
              });
 
});

 // get result 2
 app.post('/getresult2', async (req, res) => {
  const NGOEmail = req.body.NGOEmail;
  try {
    const [result] = await pool.execute(`SELECT * FROM review_results WHERE NGOEmail='${NGOEmail}'`);
    const t = JSON.parse(JSON.stringify(result)); // JSON must be capital
    res.send(t);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/getresults', async (req, res) => {
  try {
    const [result] = await pool.execute(`SELECT * FROM review_results WHERE status='approved'`);
    const t = JSON.parse(JSON.stringify(result));
    res.send(t);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/donation', async  (req, res) => {
  var success=false;

  // Insert the user data into the MySQL database
  const { NGOEmail ,DONOREmail,projectname,Donation } = req.body;
 
  donation.create({ NGOEmail,DONOREmail,projectname,Donation})
  .then((result_2) => {
    success=true;
            res.status(201).json({success,result_2});
          })
          .catch((error) => {
           console.log("error hai : ",error)
              });
 
});


// //post result 3
// app.post('/entermarks3', async  (req, res) => {
//   var success=false;

//   // Insert the user data into the MySQL database
//   const { email ,marks } = req.body;
 
//   review3_results.create({ email,marks})
//   .then((result_2) => {
//     success=true;
//             res.status(201).json({success,result_2});
//           })
//           .catch((error) => {
//            console.log("error hai : ",error)
//               });
 
// });


//  // get result 3
//  app.post('/getresult3', async (req, res) => {
//   const email = req.body.email;
//   try {
//     const [result] = await pool.execute(`SELECT * FROM review3_results WHERE email='${email}'`);
//     const t = JSON.parse(JSON.stringify(result)); // JSON must be capital
//     res.send(t);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // //
// app.post('/store-selected-pair', async (req, res) => {
//   const { studentId, student_name, student_email, guideId, guide_name, guide_email, deadline } = req.body;

//   try {
//     const conn = await pool.getConnection();
//     await conn.query('CREATE TABLE IF NOT EXISTS selected_pairs (student_id INT, student_name VARCHAR(30), student_email VARCHAR(30), guide_id INT, guide_name VARCHAR(30), guide_email VARCHAR(30), deadline VARCHAR(30))');
//     await conn.query('INSERT INTO selected_pairs (student_id, student_name, student_email, guide_id, guide_name, guide_email, deadline) VALUES (?, ?, ?, ?, ?, ?, ?)', [studentId, student_name, student_email, guideId, guide_name, guide_email, deadline]);
//     conn.release();
//     return res.status(200).json({ message: 'Selected pair stored successfully' });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// });


// app.get('/get-students', async (req, res) => {
//   try {
//     const connection = await pool.getConnection();
//     const [results, fields] = await connection.execute('SELECT * FROM students');
//     connection.release();

//     res.send(results);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error retrieving students');
//   }
// });

// // API endpoint to get the list of guides
// app.get('/get-guides', async (req, res) => {
//   try {
//     const connection = await pool.getConnection();
//     const [results, fields] = await connection.execute('SELECT * FROM guides');
//     connection.release();

//     res.send(results);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error retrieving guides');
//   }
// });


// app.get('/get-pair', async (req, res) => {
//   try {
//     const connection = await pool.getConnection();
//     const [results, fields] = await connection.execute('SELECT * FROM selected_pairs');
//     connection.release();

//     res.send(results);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error retrieving students');
//   }
// });
// //
// app.post('/getpair', async (req, res) => {
//   try {
//     const guideEmail = req.body.guideEmail;
//     const connection = await pool.getConnection();
//     const [results, fields] = await connection.execute(`SELECT * FROM selected_pairs WHERE guide_email='${guideEmail}'`);
//     connection.release();

//     res.send(results);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error retrieving students');
//   }
// });


// app.post('/get_pair', async (req, res) => {
//   try {
//     const studentEmail = req.body.studentEmail;
//     const connection = await pool.getConnection();
//     const [results, fields] = await connection.execute(`SELECT * FROM selected_pairs WHERE student_email='${studentEmail}'`);
//     connection.release();

//     res.send(results);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error retrieving students');
//   }
// });



// // skndjabdjwabdbwa
// app.post('/getstudentdetails', async (req, res) => {
//   try {
//     const { email } = req.body;

//     const [rows, fields] = await pool.execute(`SELECT * FROM students WHERE email = ? `, [email]);
//     const result = JSON.parse(JSON.stringify(rows));
//     res.send(result);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send('Error retrieving data from database');
//   }
// });
app.listen(5000, () => {
    console.log(`Server started on port 5000`);
  });