import { useRef, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Image from "next/image";
import { useRouter } from "next/router";
import Head from "next/head"
import InputControl from "components/input-control";
import css from "styles/join.module.css";

function Join() {
  const usernameRef = useRef();
  const [_username, set_Username] = useState("");
  const [, setCookies] = useCookies(["username"]);
  const [isEntering, setIsEntering] = useState(false);
  const router = useRouter();

  const setUserName = (e) => {
    if (e.key !== "Enter") return;
    if (!e.target.value) return;

    setIsEntering(true);
  };

  useEffect(() => {
    if (!isEntering) return;
    usernameRef.current.disabled = true;
    setCookies("username", _username);

    setTimeout(() => {
      router.push(`/chat?username=${_username}`);
    }, 2000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEntering, router]);

  return (
    <>
      <Head>
        <title>Join | Parallel talk</title>
        <meta name="description" content="Join the general chat room" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
		<link rel="preload" href="/images/hacker-logo.png" as="image"></link>
		<link rel="preload" href="/images/hacker-logo.webp" as="image"></link>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={css.chatbox_screen}>
        <div className={css.login_page}>
          <div className={css.login_container}>
            <div className={css.login_header}>
              <Image
                src="/images/hacker-logo.png"
                alt="Hacker Logo Image"
                width="210"
                height="146"
              />
            </div>
            <div className={css.login_body}>
              <InputControl>
                <label htmlFor="input" className={css.dollar_sign}>
                  @
                </label>
                <input
                  autoComplete="false"
                  id="input"
                  className={css.input}
                  type="text"
                  maxLength="20"
                  ref={usernameRef}
                  value={_username}
                  onChange={(e) => set_Username(e.target.value)}
                  onKeyUp={setUserName}
                />
                <span className={css.input_count}>20</span>
              </InputControl>
            </div>
            <div className={css.login_footer}>
              {isEntering ? (
                <p className={`greeting ${css.terminal_loader}`}></p>
              ) : (
                <p className="greeting">&gt;_&lt; your community awaits</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Join;

// utility function to parse cookies
const parseCookies = (req) => {
  if (!req.headers.cookie) return {};
  let cookies = req.headers.cookie.split(";").map((c_str) => {
    let pair = c_str.trim().split("=");
    return { [pair[0]]: pair[1] };
  });
  return cookies.reduce((prev, curr) => ({ ...prev, ...curr }), {});
};

export const getServerSideProps = async ({ req }) => {
  const cookies = parseCookies(req);

  if (cookies.username) {
    return {
      redirect: {
        destination: `/chat?username=${cookies.username}`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
