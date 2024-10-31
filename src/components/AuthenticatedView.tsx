import { Component, createSignal } from "solid-js";
import "./AuthenticatedView.css";

interface UserInfo {
  id: string;
  login: string;
  display_name: string;
}

const AuthenticatedView: Component<{ userInfo: UserInfo | null }> = (props) => {
  const [selectedVideo, setSelectedVideo] = createSignal("");
  const baseUrl = "https://clips.twitch.tv/embed?clip=";
  const parentUrl = "&parent=localhost";
  // Mock video list - replace with actual data fetching logic
  const videoList: any[] = [
    {
      id: "1",
      title: "Dick for probie!!!!",
      url: "StylishApatheticShrimpBudStar-vobyMLMj7HKVd_pu",
    },
  ];
  let isOpen = false;
  const handleQueue = () => {
    // Add selected video to queue
    if (selectedVideo()) {
      isOpen = true;
      let displayName = props.userInfo?.display_name;
      //send a request to the server to start adding clips from chat to the queue
      // let response = fetch('/api/start_capture', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({displayName}),
      // });
    }
  };

  return (
    <div class="authenticated-view">
      <header>
        <div class="header-logo">Clip Stack</div>
        <div class="user-info">
          <span>{props.userInfo?.display_name}</span>
        </div>
        <button
          class="logout-button"
          onClick={() => {
            localStorage.clear();
            setSelectedVideo("");
            window.location.reload();
          }}
        >
          Logout
        </button>
      </header>
      <main>
        <div class="video-display">
          {selectedVideo() ? (
            <iframe
              src={`${baseUrl}${selectedVideo()}${parentUrl}`}
              height="100%"
              width="100%"
              style={{ border: "none", "border-radius": "8px" }}
              allowfullscreen
            ></iframe>
          ) : (
            <p>Select a video to play</p>
          )}
        </div>
        <div class="video-list">
          <button
            style={{
              "background-color": "#1e1e1e",
              "border-radius": "8px",
              color: "#fff",
              padding: "0.25rem",
              "box-shadow": "0 2px 2px rgba(0, 0, 0, 0.1)",
            }}
            onClick={() => setSelectedVideo("")}
          >
            Unlock the Stack
          </button>
          <h2>Clips</h2>
          <ul>
            {videoList.map((video) => (
              <li onClick={() => setSelectedVideo(video.url)}>
                🎬 {video.title}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default AuthenticatedView;
