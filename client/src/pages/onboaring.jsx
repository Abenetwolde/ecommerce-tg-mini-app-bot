import React, { useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useNavigate } from "react-router-dom";
import LanguageSelection from "./LanguageSelection";
import { useTranslation } from 'react-i18next';
import onboaring1 from '../assets/onboaring1.jpeg'
import onboaring2 from '../assets/onboaring2.jpeg'
import onboaring3 from '../assets/onboaring3.jpeg'

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
  const onboardingScreens = [
    { id: 0, type: "component", component: <LanguageSelection /> },
    {
      id: 1,
      title: "Welcome to the App",
      description: t("onboaring1"),
      image: onboaring3
    },
    {
      id: 2,
      title: "Stay Organized",
      description: t("onboaring2"),
      image: onboaring2
    },
    {
      id: 3,
      title: "Get Started",
      description: t("onboaring3"),
      image: onboaring1
    },
  ];
  
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
                  {/* <h1 className="text-2xl font-bold text-center mb-4">
                    {screen.title}
                  </h1> */}
                  <p className="text-center mt-10 mb-4">{screen.description}</p>
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
