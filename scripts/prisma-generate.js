import { execSync } from "child_process";

try {
  const output = execSync("npx prisma generate", {
    cwd: "/vercel/share/v0-project",
    encoding: "utf-8",
    stdio: "pipe",
  });
  console.log(output);
  console.log("Prisma client generated successfully.");
} catch (err) {
  console.error("Error generating Prisma client:", err.stdout || err.message);
  process.exit(1);
}
