import { Outlet, useLocation } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import toast, { Toaster } from 'react-hot-toast';
import { useEffect ,useState} from 'react';
import fetchUserDetails from './utils/fetchUserDetails';
import { setAccessToken, setUserDetails } from './store/userSlice';
import { setAllCategory, setAllSubCategory, setLoadingCategory } from './store/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import Axios from './utils/Axios';
import SummaryApi from './common/SummaryApi';
import GlobalProvider from './provider/GlobalProvider';
import CartMobileLink from './components/CartMobile';
import { useThemeParams } from "@vkruglikov/react-telegram-web-app";
import useTelegramUser from './hookscopy/useTelegramUser';
import useTelegram from './hookscopy/useTelegram'
import useIsReadyTelegram from './hookscopy/useIsReadyTelegram'
import OnboardingScreenPage from './pages/onboaring';
import './i18n';
import "@fontsource/poppins"; // Defaults to weight 400
import "@fontsource/poppins/400.css"; // Specify weight
import "@fontsource/poppins/400-italic.css";
import splash_screen from './assets/splash_screen.jpeg'
// import { setAccessToken } from '../store/userSlice'

function App() {

  const tg = useTelegram()
  const userState = useSelector((state) => state?.user);
  const user  =  useTelegramUser();
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(true); // State for showing onboarding screen


  // console.log("tg",tg)
  const dispatch = useDispatch()
  const location = useLocation()

  const isTelegramReady = useIsReadyTelegram();
  const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding');
  useEffect(() => {
    // Logic to determine whether to show the onboarding screen
    // For example, check if the user has completed onboarding

    if (hasCompletedOnboarding === 'true') {
      setShowOnboarding(false);
    } else {
      setShowOnboarding(true);
    }
    setIsLoading(false);
  }, []);
  useEffect(() => {
    // When the Telegram Web App is ready, hide the splash screen
    if (isTelegramReady) {
      setIsLoading(false);
    }
  }, [isTelegramReady]);
  const authenticateUser = async () => {
    try {
      if (!user) {
        toast.error("User data is not available");
        return;
      }
        const response = await Axios({
            ...SummaryApi.auth,
            data: {
                telegram_id: user?.id,
                first_name: user?.first_name,
                last_name: user?.last_name || '',
                username: user?.username || '',
                avatar: user?.photo_url || '',
            },
        });

        if (response?.data?.success) {
            // toast.success(response.data.message, { style: toastStyle });
             localStorage.setItem('accesstoken', response?.data?.data?.accesstoken);
            localStorage.setItem('refreshToken', response?.data?.data?.refreshToken);

            const userDetails = await fetchUserDetails();
            localStorage.setItem('user', userDetails.data);
            dispatch(setUserDetails(userDetails.data));
            dispatch(setAccessToken(response.data.data.accessToken)) 
        } else if (response.data.error) {
            toast.error(response.data.error);
        }
    } catch (error) {
        toast.error(`Authentication failed. ${error}`);
    }
};

  const initializeApp = async () => {

    if (!userState?.accessToken) {
        await authenticateUser();
    }


};


useEffect(() => {
 
  initializeApp();
}, []);
useEffect(async () => {
  // localStorage.clear()
  // await fetchUser();
  await fetchCategory();
  await fetchSubCategory();
}, []);
const fetchUser = async () => {
  const userData = await fetchUserDetails()
  // toast.success("User Data fetched",userData?.data)
  console.log("userData///////////",userData)
  // localStorage.setItem('user', JSON.stringify(userData.data));
  dispatch(setUserDetails(userData.data))
}

const fetchCategory = async () => {
  try {
    dispatch(setLoadingCategory(true))
    const response = await Axios({
      ...SummaryApi.getCategory
    })
    const { data: responseData } = response

    if (responseData.success) {
      dispatch(setAllCategory(responseData.data.sort((a, b) => a.name.localeCompare(b.name))))
    }
  } catch (error) {

  } finally {
    dispatch(setLoadingCategory(false))
  }
}

const fetchSubCategory = async () => {
  try {
    const response = await Axios({
      ...SummaryApi.getSubCategory
    })
    const { data: responseData } = response

    if (responseData.success) {
      dispatch(setAllSubCategory(responseData.data.sort((a, b) => a.name.localeCompare(b.name))))
    }
  } catch (error) {

  } finally {
  }
}

  return (

    <div className="contentWrapper bg-tg-theme-bg text-tg-theme-text px-4 py-1 shadow-md">
      {isLoading ? (
        <div className=" flex items-center justify-center h-screen w-screen fixed top-0 left-0  z-50">
        <div className="text-center">
          <img src={splash_screen} alt="Splash Screen" className="w-full h-full object-cover absolute top-0 left-0 z-0" />
          <h1 className="text-white relative z-10 text-2xl font-bold">Loading...</h1>
        </div>
      </div>
      ) : showOnboarding ? (
      // <LanguageSelection />
        <OnboardingScreenPage onComplete={() => setShowOnboarding(false)} />
      ) : (
        <GlobalProvider>
          <Header />
          <main className='min-h-[78vh]'>
            <Outlet />
          </main>
          <Footer />
          <Toaster />
          {location.pathname !== '/checkout' && <CartMobileLink />}
        </GlobalProvider>
      )}
    </div>

  )
}

export default App
