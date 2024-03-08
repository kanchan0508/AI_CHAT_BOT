import app from "./app";
import { connectToDatabase } from "./db/connection";

const PORT = process.env.PORT || 5000;
// // connnection and listeners
connectToDatabase()
.then(()=>{
    app.listen(PORT, ()=> console.log("Server opened & Connected to Database"));
})
.catch((err)=> console.log(err));
