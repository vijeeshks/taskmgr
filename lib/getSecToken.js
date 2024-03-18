const getSecToken = async () => {
  const response = await fetch(process.env.SECTOKEN_URL, {
    method: "POST",
    headers: new Headers({
      "Content-type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(
          `${process.env.SECCLIENT_ID}:${process.env.SECCLIENT_SECRET}`
        ).toString("base64"),
    }),
    body: "grant_type=client_credentials",
  });
  try {
    const data = await response.json();
    return data.access_token;
  } catch (e) {
    return null;
  }
};

const getAppsToken = async () => {
  const response = await fetch(process.env.APPSTRUCTURETOKENURL, {
    method: "POST",
    headers: new Headers({
      "Content-type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(
          `${process.env.APPSTRUCTURECLIENTID}:${process.env.APPSTRUCTURECLIENTSECRET}`
        ).toString("base64"),
    }),
    body: "grant_type=client_credentials",
  });
  try {
    const data = await response.json();
    return data.access_token;
  } catch (e) {
    return null;
  }
};

export { getSecToken, getAppsToken };
