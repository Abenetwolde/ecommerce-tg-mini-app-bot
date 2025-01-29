import React, { useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useNavigate } from "react-router-dom";
import LanguageSelection from "./LanguageSelection";
import { useTranslation } from 'react-i18next';
const onboardingScreens = [
  { id: 0, type: "component", component: <LanguageSelection /> },
  {
    id: 1,
    title: "Welcome to the App",
    description: "Discover amazing features tailored just for you.",
    image: "https://th.bing.com/th/id/R.8dc6c051348b27830b2a3ac551bea8a3?rik=A6ovPLBqFlkqVA&pid=ImgRaw&r=0",
  },
  {
    id: 2,
    title: "Stay Organized",
    description: "Keep track of your tasks and goals effortlessly.",
    image: "https://okcredit-blog-images-prod.storage.googleapis.com/2021/04/ecommerce3-2.jpg",
  },
  {
    id: 3,
    title: "Get Started",
    description: "Start your journey with us today!",
    image: "https://okcredit-blog-images-prod.storage.googleapis.com/2021/04/ecommerce3-2.jpg",
  },
];

function OnboardingScreenPage() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleNext = () => {
    if (currentScreen < onboardingScreens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    }
  };

  const handleSkip = () => {
    setCurrentScreen(onboardingScreens.length - 1);
  };

  const handleStart = () => {
    window.location.href = window.location.origin;
    localStorage.setItem("hasCompletedOnboarding", "true");
  };

  const animationProps = useSpring({
    opacity: 1,
    transform: `translateX(-${currentScreen * 100}%)`,
    from: { opacity: 0, transform: `translateX(-${currentScreen * 100}%)` },
  });

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--tg-theme-bg-color)]">
      {/* Onboarding Screens */}
      <div className="flex-grow relative overflow-hidden">
        <animated.div
          style={animationProps}
          className="flex transition-transform duration-500 ease-in-out w-full"
        >
          {onboardingScreens.map((screen) => (
            <div key={screen.id} className="w-full flex-shrink-0 flex flex-col items-center justify-center p-4">
              {screen.type === "component" ? (
                <div className="w-full">
                  {screen.component}
                </div>
              ) : (
                <>
                  <img src={screen.image} alt={screen.title} className="w-64 h-64 mb-8 rounded-lg shadow-lg" />
                  <h1 className="text-2xl font-bold text-center mb-4">
                    {screen.title}
                  </h1>
                  <p className="text-center mb-8">{screen.description}</p>
                </>
              )}
            </div>
          ))}
        </animated.div>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center space-x-2 mb-4">
        {onboardingScreens.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentScreen ? "bg-[var(--tg-theme-button-color)]" : "bg-gray-300"
            }`}
          ></div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between px-4 pb-3">
        {currentScreen < onboardingScreens.length - 1 ? (
          <button onClick={handleSkip} className="text-gray-400 hover:text-gray-900">
           {t("skip")}
          </button>
        ) : (
          <div></div>
        )}
        {currentScreen < onboardingScreens.length - 1 ? (
          <button onClick={handleNext} className="bg-[var(--tg-theme-button-color)] text-white px-6 py-1 rounded-lg">
         {t("next")}
          </button>
        ) : (
          <button onClick={handleStart} className="bg-[var(--tg-theme-button-color)] text-white px-6 py-1 rounded-lg">
            {t("start")}
          </button>
        )}
      </div>
    </div>
  );
}

export default OnboardingScreenPage;
