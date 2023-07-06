const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const low = require("lowdb");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const artRouter = require("./routes/articulos");
const PORT = process.env.PORT || 10003;

//Consfg BD
const FileDB = require("lowdb/adapters/FileSync");
const adapter = new FileDB("db.json");
const db = low(adapter);

db.defaults({articulos:[]}).write();

//Confg Swagger
const options={
    definition:{
        openapi: "3.0.0",
        info:{
            title:"APIs - ventas",
            version:"1.0.0",
            description:"Demo libreria de APIs de ventas"
        },
        servers:[
            {
                url:"http://localhost:"+PORT,
            },
        ]
    },
    apis:["./routes/*.js"]
};

const specs=swaggerJsDoc(options);


const app = express();
app.db = db;
app.set('view engine','ejs');

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/articulos",artRouter)
app.use("/docs",swaggerUI.serve,swaggerUI.setup(specs));

app.get("/",function(req, res){
    res.render("home",{
        nombre: "Yamile",
        apellido:"Vera"
    });
});
app.get("/bye",function(req,res){
    res.render("bye");
});
app.get("/hello/:nombre",function(req, res){
    res.render("home",{
        nombre: req.params.nombre
    });
});


app.listen(PORT,() => console.log(`El servidor esta es corriendo en el puerto ${PORT}`));
