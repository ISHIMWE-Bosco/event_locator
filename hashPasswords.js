const bcrypt = require('bcryptjs');
const db = require('./db');

const usersToUpdate = [
    { email: "bosco@example.com", password: "securepassword123" },
    { email: "alice@example.com", password: "anotherpassword456" }
];

const hashAndUpdatePasswords = async () => {
    try {
        for (const user of usersToUpdate) {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            await db.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPassword, user.email]);
            console.log(`Password for user ${user.email} updated successfully.`);
        }
        console.log("✅ All passwords updated.");
    } catch (err) {
        console.error("Error updating passwords:", err);
    }
};

hashAndUpdatePasswords();
