import qs from "query-string";
const useTelegramUser = () => {
  const { tgWebAppData } = JSON.parse(
    sessionStorage.getItem("__telegram__initParams") || ""
  );
  console.log("tgWebAppData",tgWebAppData)
  const TGparse = qs.parse(tgWebAppData);
  try {
    const user = JSON.parse(TGparse.user);
    return user;
  } catch {
    return null;
  }
};
export default useTelegramUser;