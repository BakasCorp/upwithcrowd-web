import NextAuth, { User } from "next-auth"
import Credentials from "next-auth/providers/credentials"

const TOKEN_URL = `${process.env.BASE_URL}/connect/token`;
const OPENID_URL = `${process.env.BASE_URL}/.well-known/openid-configuration`;

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null
        let scopes = "openid profile email";
        const openId_response = await fetch(OPENID_URL);
        console.log(credentials)
        const scopes_json = await openId_response.json();
        if ("scopes_supported" in scopes_json) {
          scopes = scopes_json.scopes_supported.join(" ");
        }
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        myHeaders.append("X-Requested-With", "XMLHttpRequest");
        // myHeaders.append("__tenant", credentials.tenantId || "");
        const urlencoded = new URLSearchParams();
        const urlEncodedContent: Record<string, string> = {
          grant_type: "password",
          client_id: "frontend",
          username: "" + credentials.email,
          password: "" + credentials.password,
          scope: scopes,
          client_secret: "frontend",
        };
        Object.keys(urlEncodedContent).forEach((key) => {
          urlencoded.append(key, urlEncodedContent[key]);
        });
        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: urlencoded,
        };
        const response = await fetch(TOKEN_URL, requestOptions);
        console.log("response", response);
        const json: User = await response.json();
        user = json;
        console.log("json user", user)
        if ("error" in user && "error_description" in user) {
          throw new Error(user.error + ": " + user.error_description);
        }
        if (!user) {
          // No user found, so this is their first attempt to login
          // Optionally, this is also the place you could do a user registration
          throw new Error("Invalid credentials.")
        }

        // return user object with their profile data
        return user
      },
    }),
  ],
})