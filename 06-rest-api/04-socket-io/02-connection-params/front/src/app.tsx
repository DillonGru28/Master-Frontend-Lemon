import React from "react";
import { createSocket } from "./api";
import { Socket } from "socket.io";

export const App = () => {
  const [message, setMessage] = React.useState("");
  const [chatlog, setChatlog] = React.useState("");
  const [isConnected, setIsConnected] = React.useState(false);
  const [socket, setSocket] = React.useState<globalThis.SocketIOClient.Socket>(
    null
  );

  const establishConnection = () => {
    const socketConnection = createSocket();
    setSocket(socketConnection);
    socketConnection.on("message", (body) => {
      if (body && body.type) {
        switch (body.type) {
          case "CONNECTION_SUCCEEDED":
            setIsConnected(true);
            console.log("Connection succeded");
            break;
          case "CHAT_MESSAGE":
            setChatlog((chatlog) => `${chatlog}\n${body.payload.content}`);
            break;
        }
      }
    });
  };

  const handleConnect = () => {
    if (!isConnected) {
      establishConnection();
    }
  };

  const sendMessage = (content: string) => {
    setChatlog(`${chatlog}\n${content}`);
    socket.emit("message", {
      type: "CHAT_MESSAGE",
      payload: { content },
    });

    setMessage("");
  };

  return (
    <>
      <button onClick={handleConnect} disabled={isConnected}>
        Join
      </button>

      {isConnected && (
        <div style={{ marginTop: "40px" }}>
          <label>Message:</label>
          <input
            style={{ width: "80%" }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={(e) => sendMessage(message)}>Send</button>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label>ChatLog</label>
            <textarea
              style={{ height: "400px" }}
              value={chatlog}
              onChange={(e) => setChatlog(e.target.value)}
              readOnly
            ></textarea>
          </div>
        </div>
      )}
    </>
  );
};
