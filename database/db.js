// mongodb+srv://knupadhyay784:<password>@merndatabase.02svfwa.mongodb.net/

import { connect } from 'mongoose'
import 'dotenv/config';

const connectToMongo = async () => {
    try {
        await connect(process.env.MONGO_URI);
        console.log("*** Database coonected Successfully ***");
    } catch (error) {
        console.log(error)
    }
}

 
export default connectToMongo;