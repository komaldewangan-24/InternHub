const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const testConnect = async () => {
    try {
        console.log('URI:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected successfully');
        const collections = await mongoose.connection.db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);
        console.log('Collections:', collectionNames);
        
        const models = {
            User: mongoose.model('User', new mongoose.Schema({ role: String })),
            Internship: mongoose.model('Internship', new mongoose.Schema({})),
            Company: mongoose.model('Company', new mongoose.Schema({})),
            Application: mongoose.model('Application', new mongoose.Schema({})),
        };

        for (const [name, model] of Object.entries(models)) {
            const count = await model.countDocuments();
            console.log(`Count for ${name}: ${count}`);
        }

        process.exit(0);

    } catch (err) {
        console.error('Connection failed:', err.message);
        process.exit(1);
    }
};

testConnect();
