
import fs from "node:fs";

console.log("=== Stack du projet ===");

if (fs.existsSync("pom.xml")) {
    console.log("Projet Maven / Java");
}

if (fs.existsSync("angular.json")) {
    console.log("Projet Angular");
}

if (fs.existsSync("package.json")) {
    console.log("Projet Node.js / JavaScript");
}
