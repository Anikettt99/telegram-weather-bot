import { googleLogout } from "@react-oauth/google";
import { useStore } from "../hooks/useStore";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Style.css";

const MainPage = () => {
  const { authData, setAuthData } = useStore();
  const [userList, setUserList] = useState([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_BASE_URL}/telegram/users`)
      .then((response) => {
        setUserList(response.data);
      });
  }, [reload]);

  const getFormattedDate = (date) => {
    const utcTimestamp = new Date(date);

    const istTimestamp = new Date(
      utcTimestamp.getTime() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000
    );

    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = istTimestamp.toLocaleDateString("en-IN", options);
    return formattedDate;
  };

  const addSubscription = (userId) => {
    axios
      .patch(`${process.env.REACT_APP_SERVER_BASE_URL}/telegram/${userId}`, {
        status: true,
      })
      .then(() => {
        setReload(!reload);
      });
  };

  const removeSubscription = (userId) => {
    axios
      .patch(`${process.env.REACT_APP_SERVER_BASE_URL}/telegram/${userId}`, {
        status: false,
      })
      .then(() => {
        setReload(!reload);
      });
  };

  return (
    <div>
      <button
        className="logout-button"
        onClick={() => {
          googleLogout();
          localStorage.setItem("authData", "{}");
          setAuthData({});
        }}
      >
        Logout
      </button>
      <h2>Subscription List</h2>
      <ul>
        {userList.map((user) => (
          <li style={{ fontWeight: "bold" }} key={user._id}>
            <p>{user.userName || user.firstName}</p>{" "}
            <span className="dot-before"></span>{" "}
            {`Joined: ${getFormattedDate(user.createdAt)}`}
            {user.isSubscriptionActive ? (
              <button
                style={{ backgroundColor: "red" }}
                onClick={() => removeSubscription(user._id)}
              >
                Remove Subscription
              </button>
            ) : (
              <button
                style={{ backgroundColor: "green" }}
                onClick={() => addSubscription(user._id)}
              >
                Add Subscription
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MainPage;
