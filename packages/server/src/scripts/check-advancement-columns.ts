import dotenv from "dotenv";
import path from "path";

// Load .env from the server package directory
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import { DATA_SOURCE } from "../db/data-source";
import { initDynamicEntities } from "../db/entities/dyn/init";

async function checkAdvancementColumns() {
    try {
        console.log("Initializing database connection...");
        await DATA_SOURCE.initialize();
        initDynamicEntities();

        const queryRunner = DATA_SOURCE.createQueryRunner();

        try {
            // Get column information for the advancement_score table
            const columns = await queryRunner.query(`
                SELECT column_name, data_type, is_nullable
                FROM information_schema.columns
                WHERE table_name = 'advancement_score'
                ORDER BY ordinal_position;
            `);

            console.log("\nColumns in advancement_score table:");
            console.log(JSON.stringify(columns, null, 2));

            // Also get a sample row to see actual data
            const sampleRow = await queryRunner.query(`
                SELECT *
                FROM advancement_score
                WHERE advancement_rank IS NOT NULL
                LIMIT 1;
            `);

            console.log("\nSample row with non-null advancement_rank:");
            console.log(JSON.stringify(sampleRow, null, 2));
        } catch (error) {
            console.error("Query Error:", error);
        } finally {
            await queryRunner.release();
        }
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await DATA_SOURCE.destroy();
        process.exit(0);
    }
}

checkAdvancementColumns().catch(console.error);
