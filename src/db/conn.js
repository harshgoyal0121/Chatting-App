const mongoose = require("mongoose");
const conn = "mongodb://127.0.0.1:27017/registration";

mongoose.connect(conn, {
    useUnifiedTopology: true
}).then(()=>{
    console.log(`Connection Successful`);
}).catch((e)=>{
    console.log(`No connection established`);
    console.log(e);
})