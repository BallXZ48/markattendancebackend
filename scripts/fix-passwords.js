const mongoose = require('mongoose');
const argon2 = require('argon2');
require('dotenv').config();

const mongoUri = process.env.MONGO_URI || 'mongodb+srv://mark_attendance:6704101343@cluster0.dgsvnld.mongodb.net/mark_attendance?retryWrites=true&w=majority';

async function run() {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected.');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    const users = await usersCollection.find({}).toArray();
    console.log(`Found ${users.length} users.`);

    for (const user of users) {
        if (!user.passwordHash) continue;

        // Check if it's already hashed (Argon2 hashes usually start with $argon2)
        if (user.passwordHash.startsWith('$argon2')) {
            console.log(`Skipping already hashed user: ${user.email}`);
            continue;
        }

        console.log(`Hashing password for user: ${user.email} (current: ${user.passwordHash})`);
        const newHash = await argon2.hash(user.passwordHash);

        await usersCollection.updateOne(
            { _id: user._id },
            { $set: { passwordHash: newHash } }
        );
        console.log(`Updated ${user.email}`);
    }

    console.log('Done.');
    await mongoose.disconnect();
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
