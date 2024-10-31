import { createSignal, Show } from "solid-js";
import "./LandingPage.css";
import AuthenticatedView from "./AuthenticatedView";

function LandingPage() {
  const [userInfo, setUserInfo] = createSignal(null);

  const clientId = "5ckuy41k4xb6xl3docqorlty772oyj";
  const redirectUri = "http://localhost:8080/callback";
  const scopes = "user:read:email";

  const twitchAuthUrl = `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scopes)}`;

  const handleAuth = async () => {
    // Open the Twitch auth URL in a new window
    const authWindow = window.open(
      twitchAuthUrl,
      "_blank",
      "width=600,height=600"
    );

    // Listen for messages from the auth window
    window.addEventListener(
      "message",
      async (event) => {
        if (event.origin !== "http://localhost:8080") return;

        if (event.data.type === "AUTH_SUCCESS") {
          // Close the auth window
          if (!authWindow) return;
          authWindow.close();

          // Store the user info in local storage
          localStorage.setItem(
            "userInfo",
            JSON.stringify(event.data.userInfo.data[0])
          );

          // Set the user info
          setUserInfo(event.data.userInfo.data[0]);
        }
      },
      false
    );
  };

  return (
    <Show
      when={userInfo()}
      fallback={
        <div class="landing-container">
          <h1 class="landing-header">Welcome to Clip Stack!</h1>
          <p style={{ color: "white" }}>Redefining the way you stream.</p>
          <button
            style={{
              "background-color": "#9147ff",
              border: "none",
              padding: "10px 20px",
              cursor: "pointer",
              "border-radius": "5px",
              "font-family": "Prompt",
              "font-size": "16px",
              color: "#fff",
            }}
            onClick={handleAuth}
          >
            Connect with Twitch
          </button>
        </div>
      }
    >
      <AuthenticatedView userInfo={userInfo()} />
    </Show>
  );
}

export default LandingPage;
