import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { recieve, loadHistory } from "store/features/chat";
import _ from "lodash";
import io from "socket.io-client";
import Head from "next/head";
import { useRouter } from "next/router";
import Container from "components/container";
import MessageBox from "components/message-box";

import ChatBody from "components/chat-body";
import { logout } from "store/features/user";
import { useCookies } from "react-cookie";

import css from "styles/chat.module.css";

export default function Chat({ username }) {
  const dispatch = useDispatch();
  const ioRef = useRef();
  const [usernameCookie, , removeCookie] = useCookies(["username"]);
  const router = useRouter();
  const [usersTyping, setsUsersTyping] = useState([]);

  const sendMessage = (message) => {
    ioRef.current.emit("message", { message, user: username });
  };

  const sendTypingActivity = useCallback(
    (isTyping) => {
      if (!ioRef.current) return;
      if (isTyping) ioRef.current.emit("typing", username);
      else ioRef.current.emit("typing-stopped", username);
    },
    [username]
  );

  const leaveChat = () => {
    ioRef.current.disconnect();
    removeCookie("username");
    router.replace("/join");
  };

  useEffect(() => {
    if (!usernameCookie.username) {
      router.push("/join");
    }
  }, [usernameCookie, router]);

  // Attach listeners
  useEffect(() => {
    const ioInstance = io();

    ioInstance.emit("user-joined", { user: username }, (previousMessages) => {
      dispatch(loadHistory(previousMessages));
    });

    ioInstance.on("joined", (message) => {
      dispatch(recieve(message));
    });

    ioInstance.on("message", (message) => {
      dispatch(recieve(message));
    });

    ioInstance.on("typing", (username) => {
      // using Sets ensure we don't get a duplication of usernames
      setsUsersTyping((previouslyTypingList) => {
        const newSet = new Set([...previouslyTypingList, username]);
        return [...newSet];
      });
    });

    ioInstance.on("typing-stopped", (username) => {
      // using sets to reduce time complexity of removing users that stopped typing
      setsUsersTyping((previouslyTypingList) => {
        const newSet = new Set(previouslyTypingList);
        newSet.delete(username);
        return [...newSet];
      });
    });

    ioRef.current = ioInstance;

    return () => {
      ioInstance.disconnect();
    };
  }, [username, dispatch]);

  return (
    <>
      <Head>
        <title>Chatbox</title>
        <meta name="description" content="a general chat room for tech gods" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <div className={css.flex_layout}>
          <div className={css.chat_header}>
            <div></div>
            <h4>GENERAL GROUP</h4>
            <button className="regular" onClick={leaveChat}>
              Leave
            </button>
          </div>
          <ChatBody username={username} />
          <MessageBox
            onSend={sendMessage}
            onTypingActivityChanged={sendTypingActivity}
            usersTyping={usersTyping}
          />
        </div>
      </Container>
    </>
  );
}

// utility function to parse cookies
const parseCookies = (req) => {
  if (!req.headers.cookie) return {};
  let cookies = req.headers.cookie.split(";").map((c_str) => {
    let pair = c_str.trim().split("=");
    return { [pair[0]]: pair[1] };
  });
  return cookies.reduce((prev, curr) => ({ ...prev, ...curr }), {});
};

//TODO implement reroute back to home page when cookie not set
export const getServerSideProps = async ({ req, query }) => {
  // redirect back to the join page if cookie was not set
  const cookies = parseCookies(req);
  if (!cookies.username) {
    return {
      redirect: {
        destination: `/join`,
        permanent: false,
      },
    };
  }

  // if cookie is set, but query is not, build query
  if (_.isEmpty(query) || !query.username) {
    return {
      redirect: {
        destination: `/chat?username=${query.username}`,
        permanent: false,
      },
    };
  }

  // otherwise, return the username to the component
  return {
    props: { username: query.username },
  };
};
