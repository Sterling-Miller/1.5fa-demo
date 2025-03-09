import { createServer } from "node:https";
import next from "next";
import { Server } from "socket.io";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const dev = "production"; // Determine if the environment is development or production
const hostname = "localhost"; // Set the hostname to localhost
const port = 3001; // Set the port to 3001

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load SSL/TLS certificates
const options = {
  key: readFileSync(join(__dirname, "key.pem")),
  cert: readFileSync(join(__dirname, "cert.pem")),
};

// Initialize the Next.js app with the specified configuration
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler(); // Get the request handler from the Next.js app

app.prepare().then(() => {
  // Prepare the Next.js app and then create an HTTPS server
  const httpsServer = createServer(options, handler);

  // Initialize a new Socket.IO server instance and attach it to the HTTPS server
  const io = new Server(httpsServer);

  // Listen for new connections on the Socket.IO server
  io.on("connection", (socket) => {
    console.log("a user connected"); // Log a message when a user connects
  });

  // Handle errors on the HTTPS server
  httpsServer
    .once("error", (err) => {
      console.error(err); // Log the error
      process.exit(1); // Exit the process with an error code
    })
    .listen(port, () => {
      // Start the HTTPS server and listen on the specified port
      console.log(`> Ready on https://${hostname}:${port}`); // Log a message indicating the server is ready
    });
});
