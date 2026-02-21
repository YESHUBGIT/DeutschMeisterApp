import { execSync } from "child_process";

try {
  console.log("Running prisma generate...");
  execSync("npx prisma generate", {
    cwd: "/vercel/share/v0-project",
    stdio: "inherit",
  });
  console.log("Prisma client generated successfully!");
} catch (error) {
  console.error("Failed to generate Prisma client:", error.message);
  process.exit(1);
}
