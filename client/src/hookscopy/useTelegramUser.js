// import qs from "query-string";
// const useTelegramUser = async() => {
//   const { tgWebAppData } = await JSON.parse(
//     sessionStorage.getItem("__telegram__initParams") || ""
//   );
//   console.log("tgWebAppData",tgWebAppData)
//   const TGparse = qs.parse(tgWebAppData);
//   try {
//     const user = JSON.parse(TGparse.user);
//     return user;
//   } catch {
//     return null;
//   }
// };
// export default useTelegramUser;
import { useInitData } from "@vkruglikov/react-telegram-web-app";
import { useMemo } from "react";

const useTelegramUser = () => {
  const [initDataUnsafe, initData] = useInitData();

  // Use memoization to prevent unnecessary re-parsing
  return useMemo(() => {
    try {
      return initData?.user || initDataUnsafe?.user || null;
    } catch (error) {
      console.error("Failed to retrieve Telegram user data:", error);
      return null;
    }
  }, [initData, initDataUnsafe]);
};

export default useTelegramUser;
