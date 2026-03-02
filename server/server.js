// Vercel does not see the server.js file
// and seeks the api/index.js as the entry point. 
// Also, it does not like the app.listen(...) 
// The server.js was split into two for that reason.
const app = require("./index.js");

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
