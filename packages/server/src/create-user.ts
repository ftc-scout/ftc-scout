import "dotenv/config";
import { DATA_SOURCE } from "./db/data-source";
import { createUser } from "./auth/auth";
import * as readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function question(query: string): Promise<string> {
    return new Promise((resolve) => rl.question(query, resolve));
}

async function main() {
    await DATA_SOURCE.initialize();

    console.log("\n=== Create FTCScout User ===\n");

    const username = await question("Username: ");
    const password = await question("Password: ");

    try {
        const user = await createUser(username, password);
        console.log(`\n✓ User created successfully!`);
        console.log(`  Username: ${user.username}`);
        console.log(`  Can clip videos: ${user.canClipVideos}`);
        console.log(`\nYou can now log in at http://localhost:3000/login\n`);
    } catch (error: any) {
        if (error.code === "23505") {
            // Unique constraint violation
            console.error(`\n✗ Error: Username "${username}" already exists.\n`);
        } else {
            console.error(`\n✗ Error creating user:`, error.message);
        }
    }

    rl.close();
    await DATA_SOURCE.destroy();
}

main();
