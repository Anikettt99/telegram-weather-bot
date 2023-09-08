import axios from "axios";
import "./App.css";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useStore } from "./hooks/useStore";
import MainPage from "./components/MainPage";

function App() {
  const setAuthData = useStore((state) => state.setAuthData);
  const { authData } = useStore();
  return (
    <div>
      {!Object.keys(authData).length && (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
          <div className="heading">
            <div className="title">WEATHER BOT ADMIN PANEL, LOGIN TO ENTER</div>
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                const response = await axios.post(
                  `${process.env.REACT_APP_SERVER_BASE_URL}/admin/login`,
                  {
                    token: credentialResponse.credential,
                  }
                );
                const data = response.data;

                localStorage.setItem("authData", JSON.stringify(data));
                setAuthData(data);
              }}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          </div>
        </GoogleOAuthProvider>
      )}
      <div>{Object.keys(authData).length ? <MainPage /> : <></>}</div>
    </div>
  );
}

export default App;
