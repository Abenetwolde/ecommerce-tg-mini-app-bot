import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import fetchUserDetails from "./utils/fetchUserDetails";
import { setAccessToken, setUserDetails } from "./store/userSlice";
import {
  setAllCategory,
  setAllSubCategory,
  setLoadingCategory,
} from "./store/productSlice";
import { useDispatch, useSelector } from "react-redux";
import Axios from "./utils/Axios";
import SummaryApi from "./common/SummaryApi";
import GlobalProvider from "./provider/GlobalProvider";
import CartMobileLink from "./components/CartMobile";
import useTelegramUser from "./hookscopy/useTelegramUser";
import useIsReadyTelegram from "./hookscopy/useIsReadyTelegram";
import OnboardingScreenPage from "./pages/onboaring";
import Login from "./pages/AdminLogin";
import "./i18n";
import "@fontsource/poppins";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/400-italic.css";
import splash_screen from "./assets/splash_screen.jpeg";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {
  const navigate = useNavigate();
  const queryClient = new QueryClient();
  const dispatch = useDispatch();
  const location = useLocation();
  const userState = useSelector((state) => state?.user);
  const user = useTelegramUser();
  const isTelegramReady = useIsReadyTelegram();

  const [isLoading, setIsLoading] = useState(true); // Loading state for splash screen
  const [showOnboarding, setShowOnboarding] = useState(false); // Onboarding state
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication state
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Mobile detection

  const userFromLocal = localStorage.getItem("user");
  const hasCompletedOnboarding = localStorage.getItem("hasCompletedOnboarding");

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Redirect to login if no user is found and not on mobile
  useEffect(() => {
    if (!userFromLocal && !isMobile) {
      navigate("/login");
    }
  }, [userFromLocal, isMobile, navigate]);

  // Authenticate the Telegram user
  const authenticateUser = async () => {
    try {
      if (!user || !user.id) {
        toast.error("Telegram user data is not available");
        return false;
      }

      const response = await Axios({
        ...SummaryApi.auth,
        data: {
          telegram_id: user.id,
          first_name: user.first_name,
          last_name: user.last_name || "",
          username: user.username || "",
          avatar: user.photo_url || "",
        },
      });

      if (response?.data?.success) {
        localStorage.setItem("accesstoken", response.data.data.accessToken);
        localStorage.setItem("refreshToken", response.data.data.refreshToken);

        const userDetails = await fetchUserDetails();
        localStorage.setItem("user", JSON.stringify(userDetails?.data)); // Store as string
        dispatch(setUserDetails(userDetails?.data));
        dispatch(setAccessToken(response.data.data.accessToken));
        return true;
      } else {
        toast.error(response?.data?.error || "Authentication failed");
        return false;
      }
    } catch (error) {
      toast.error("Server is down, please try again later");
      return false;
    }
  };

  // Fetch categories
  const fetchCategory = async () => {
    try {
      dispatch(setLoadingCategory(true));
      const response = await Axios({ ...SummaryApi.getCategory });
      if (response.data.success) {
        dispatch(
          setAllCategory(
            response.data.data.sort((a, b) => a.name.localeCompare(b.name))
          )
        );
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      dispatch(setLoadingCategory(false));
    }
  };

  // Fetch subcategories
  const fetchSubCategory = async () => {
    try {
      const response = await Axios({ ...SummaryApi.getSubCategory });
      if (response.data.success) {
        dispatch(
          setAllSubCategory(
            response.data.data.sort((a, b) => a.name.localeCompare(b.name))
          )
        );
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  // Initialize app: authenticate user and fetch data
  useEffect(() => {
    const initializeApp = async () => {
      // if (!isTelegramReady) return; // Wait for Telegram to be ready

      setIsLoading(true);

      // Check onboarding status
      if (hasCompletedOnboarding === "true") {
        setShowOnboarding(false);
      } else {
        setShowOnboarding(true);
      }

      // Authenticate user if not already authenticated
      if (!userState?._id && isMobile) {
        const authSuccess = await authenticateUser();
        if (authSuccess) {
          setIsAuthenticated(true);
          await Promise.all([fetchCategory(), fetchSubCategory()]);
        } else {
          setIsAuthenticated(false);
          navigate("/login"); // Redirect if authentication fails
        }
      } else if (userState?.accessToken) {
        setIsAuthenticated(true); // Already authenticated
        await Promise.all([fetchCategory(), fetchSubCategory()]);
      }

      setIsLoading(false);
    };

    initializeApp();
  }, [isTelegramReady, user, userState?.accessToken, dispatch, navigate]);
  // Retry authentication
  const handleRetry = async () => {
    setIsLoading(true);
    const authSuccess = await authenticateUser();
    if (authSuccess) {
      setIsAuthenticated(true);
      await Promise.all([fetchCategory(), fetchSubCategory()]);
    } else {
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  };

  // Render logic
  return (
    <QueryClientProvider client={queryClient}>
      <div className="contentWrapper bg-tg-theme-bg text-tg-theme-text px-2 py-1 shadow-md">
        {isLoading || !isTelegramReady ? (
          <div className="flex items-center justify-center h-screen w-screen fixed top-0 left-0 z-50">
            <div className="text-center">
              <img
                src={splash_screen}
                alt="Splash Screen"
                className="w-full h-full object-cover absolute top-0 left-0 z-0"
              />
              <h1 className="text-white relative z-10 text-2xl font-bold">
                Loading...
              </h1>
            </div>
          </div>
        ) : showOnboarding && isMobile ? (
          <OnboardingScreenPage
            onComplete={() => {
              setShowOnboarding(false);
              localStorage.setItem("hasCompletedOnboarding", "true");
            }}
          />
        ) : isAuthenticated||!isMobile ? (
          <GlobalProvider>
            <Header />
            <main className="min-h-[78vh]">
              <Outlet />
            </main>
            <div className="hidden lg:block">
              <Footer />
            </div>
            <Toaster />
            {location.pathname !== "/checkout" && <CartMobileLink />}
          </GlobalProvider>
        ) : isMobile?(
          <div className="flex items-center justify-center h-screen">
          <h1 className="text-red-500">The server is busy. Please try again.</h1>
          <button
            onClick={handleRetry}
            className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2"
          >
            Retry
          </button>
        </div>
        ):<Login/>}
      </div>
    </QueryClientProvider>
  );
}

export default App;

// import { Outlet, useLocation } from 'react-router-dom'
// import './App.css'
// import Header from './components/Header'
// import Footer from './components/Footer'
// import toast, { Toaster } from 'react-hot-toast';
// import { useEffect ,useState} from 'react';
// import fetchUserDetails from './utils/fetchUserDetails';
// import { setAccessToken, setUserDetails } from './store/userSlice';
// import { setAllCategory, setAllSubCategory, setLoadingCategory } from './store/productSlice';
// import { useDispatch, useSelector } from 'react-redux';
// import Axios from './utils/Axios';
// import SummaryApi from './common/SummaryApi';
// import GlobalProvider from './provider/GlobalProvider';
// import CartMobileLink from './components/CartMobile';
// import { useThemeParams } from "@vkruglikov/react-telegram-web-app";
// import useTelegramUser from './hookscopy/useTelegramUser';
// import useTelegram from './hookscopy/useTelegram'
// import useIsReadyTelegram from './hookscopy/useIsReadyTelegram'
// import OnboardingScreenPage from './pages/onboaring';
// import './i18n';
// import "@fontsource/poppins"; // Defaults to weight 400
// import "@fontsource/poppins/400.css"; // Specify weight
// import "@fontsource/poppins/400-italic.css";
// import splash_screen from './assets/splash_screen.jpeg'
// import { useNavigate } from 'react-router-dom';
// // import { setAccessToken } from '../store/userSlice'
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


// function App() {
//   const navigate = useNavigate()
//   const queryClient = new QueryClient();
//   const tg = useTelegram()
//   const userState = useSelector((state) => state?.user);
//   const user  =  useTelegramUser();
//   const [isLoading, setIsLoading] = useState(true);
//   const [showOnboarding, setShowOnboarding] = useState(true); // State for showing onboarding screen

//   const userFromLocal = localStorage.getItem('user');
//   // console.log("tg",tg)
//   const dispatch = useDispatch()
//   const location = useLocation()
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Detect initial screen size

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768); // Update state on resize
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize); // Cleanup
//   }, []);
//   useEffect(() => {
//     if (!userFromLocal && !isMobile) {
//       navigate("/login")// Redirect to login if user is not found & device is not mobile
//     }
//   }, [userFromLocal, isMobile]);
//   const isTelegramReady = useIsReadyTelegram();
//   const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding');
//   useEffect(() => {
//     // Logic to determine whether to show the onboarding screen
//     // For example, check if the user has completed onboarding

//     if (hasCompletedOnboarding === 'true') {
//       setShowOnboarding(false);
//     } else {
//       setShowOnboarding(true);
//     }
//     setIsLoading(false);
//   }, []);
//   useEffect(() => {
//     // When the Telegram Web App is ready, hide the splash screen
//     if (isTelegramReady) {
//       setIsLoading(false);
//     }
//   }, [isTelegramReady]);
//   const authenticateUser = async () => {
//     try {
//       if (!user) {
//         toast.error("User data is not available");
//         return;
//       }
//         const response = await Axios({
//             ...SummaryApi.auth,
//             data: {
//                 telegram_id: user?.id,
//                 first_name: user?.first_name,
//                 last_name: user?.last_name || '',
//                 username: user?.username || '',
//                 avatar: user?.photo_url || '',
//             },
//         });

//         if (response?.data?.success) {
//             // toast.success(response.data.message, { style: toastStyle });
//             await localStorage.setItem('accesstoken', response?.data?.data?.accessToken);
//             await localStorage.setItem('refreshToken', response?.data?.data?.refreshToken);

//             const userDetails = await fetchUserDetails();
//             await localStorage.setItem('user', userDetails?.data);
//             dispatch(setUserDetails(userDetails?.data));
//             dispatch(setAccessToken(response?.data?.data?.accessToken)) 
//         } else if (response?.data?.error) {
//             toast.error(response?.data?.error);
//         }
//     } catch (error) {
//         toast.error(`Sorry the Server is down now, please try again later`);
//     }
// };

//   const initializeApp = async () => {

//     if (!userState?.accessToken) {
//         await authenticateUser();
//     }


// };


// useEffect(async() => {
//   await authenticateUser();
//   // initializeApp();
// }, []);
// useEffect(async () => {
//   // localStorage.clear()
//   // await fetchUser();
//   await fetchCategory();
//   await fetchSubCategory();
// }, []);
// const fetchUser = async () => {
//   const userData = await fetchUserDetails()
//   dispatch(setUserDetails(userData.data))
// }

// const fetchCategory = async () => {
//   try {
//     dispatch(setLoadingCategory(true))
//     const response = await Axios({
//       ...SummaryApi.getCategory
//     })
//     const { data: responseData } = response

//     if (responseData.success) {
//       dispatch(setAllCategory(responseData.data.sort((a, b) => a.name.localeCompare(b.name))))
//     }
//   } catch (error) {

//   } finally {
//     dispatch(setLoadingCategory(false))
//   }
// }

// const fetchSubCategory = async () => {
//   try {
//     const response = await Axios({
//       ...SummaryApi.getSubCategory
//     })
//     const { data: responseData } = response

//     if (responseData.success) {
//       dispatch(setAllSubCategory(responseData.data.sort((a, b) => a.name.localeCompare(b.name))))
//     }
//   } catch (error) {

//   } finally {
//   }
// }

//   return (
//     <QueryClientProvider client={queryClient}>
//     <div className="contentWrapper bg-tg-theme-bg text-tg-theme-text px-2 py-1 shadow-md">
//       {isLoading ? (
//         <div className=" flex items-center justify-center h-screen w-screen fixed top-0 left-0  z-50">
//         <div className="text-center">
//           <img src={splash_screen} alt="Splash Screen" className="w-full h-full object-cover absolute top-0 left-0 z-0" />
//           <h1 className="text-white relative z-10 text-2xl font-bold">Loading...</h1>
//         </div>
//       </div>
//       ) : showOnboarding ? (
//       // <LanguageSelection />
//         <OnboardingScreenPage onComplete={() => setShowOnboarding(false)} />
//       ) : (
//         <GlobalProvider>
//           <Header />
//           <main className='min-h-[78vh]'>
//             <Outlet />
//           </main>
//           <div className='hidden lg:block'>
//           <Footer  />
//           </div>
        
//           <Toaster />
//           {location.pathname !== '/checkout' && <CartMobileLink />}
//         </GlobalProvider>
//       )}
//     </div>
    
//     </QueryClientProvider>

//   )
// }

// export default App
