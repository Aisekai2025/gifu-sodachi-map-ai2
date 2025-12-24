const { GoogleAuth } = require("google-auth-library");

async function getAccessToken() {
  const auth = new GoogleAuth({
    keyFile: "./gen-lang-client-0960238005-325de1e39517.json",
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });

  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  console.log("Access Token:", tokenResponse.token);
}

getAccessToken();