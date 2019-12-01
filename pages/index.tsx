import React, { useState, useEffect } from "react";
import queryString from "query-string";
import { useRouter } from "next/router";

const CLIENT_ID = "sxbywtrgi38jp88hgr2gm6v4t9plsf";
const AUTH_URL = "https://id.twitch.tv/oauth2/authorize";
const makeRedirectUrl = () => {
  const responseType = "token";
  const scope = "user_subscriptions openid";
  const redirectUri = "http://localhost:3000";
  const claims = "email picture preferred_username";
  return `${AUTH_URL}?${queryString.stringify({
    client_id: CLIENT_ID,
    response_type: responseType,
    scope,
    redirect_uri: redirectUri,
    claims
  })}`;
};

const Index: React.FC<{}> = _ => {
  const router = useRouter();
  const [userToken, setUserToken] = useState<string>();
  console.log(router);
  const accessToken = queryString.parse(router.asPath.slice(1)).access_token;
  useEffect(() => {
    if (accessToken && typeof accessToken === "string") {
      setUserToken(accessToken);
    }
  }, [accessToken]);
  return (
    <div>
      <p>Sample App</p>
      <p>{userToken}</p>
      {!userToken && <LoginToTwitch />}
      {userToken && <IsSubbedTo userToken={userToken} />}
    </div>
  );
};

const IsSubbedTo: React.FC<{ userToken: string }> = ({ userToken }) => {
  return <div>{userToken}</div>;
};

const LoginToTwitch: React.FC<{}> = props => {
  console.log(props);
  const redirectUrl = makeRedirectUrl();
  console.log(redirectUrl);
  return <a href={redirectUrl}>Login with Twitch</a>;
};

export default Index;
