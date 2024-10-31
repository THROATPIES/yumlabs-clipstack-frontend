import { Component, createSignal, onCleanup } from "solid-js";
import "./AuthenticatedView.css";
import axios from "axios";

interface UserInfo {
  id: string;
  login: string;
  display_name: string;
}

const AuthenticatedView: Component<{ userInfo: UserInfo | null }> = (props) => {
  const [videoList, setVideoList] = createSignal<any[]>([]);
  const [selectedVideo, setSelectedVideo] = createSignal("");
  const [queueOpen, setQueueOpen] = createSignal(false);
  const baseUrl = "https://clips.twitch.tv/embed?clip=";
  const captureUrl = "http://localhost:8080/api/start_capture/";
  const parentUrl = "&parent=localhost";
  
  // WebSocket connection to monitor for new clip URLs
  const ws = new WebSocket("ws://localhost:8080/ws/monitor");

  ws.onopen = () => {
    console.log("WebSocket connection opened");
  };

  ws.onmessage = (event) => {
    console.log(event.data);
    const newClip = event.data;
    setVideoList([...videoList(), { title: "New Twitch Clip", url: newClip }]);
  };

  onCleanup(() => ws.close());

  const convertUrlForTwitch = (url: string) => {
    


  }

  const handleQueue = () => {
    setQueueOpen(true);
    let displayName = props.userInfo?.display_name;
    if (displayName) {
      console.log(`Starting capture for ${displayName}`);
      axios.post(`${captureUrl}${displayName}`)
        .then((response) => {
          console.log(response.data); // Log the response to check if capture started
        })
        .catch((error) => {
          console.error("Error starting capture:", error);
        });
    } else {
      console.error("No display name provided!");
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
            onClick={() => handleQueue()}
          >
            Unlock the Stack
          </button>
          <h2>Clips</h2>
          <ul>
            {videoList().map((video, index) => (
              <li key={index} onClick={() => setSelectedVideo(video.url)}>
                🎬 {video.title} | {video.url}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default AuthenticatedView;
