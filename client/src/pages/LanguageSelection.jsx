import { useState } from "react";
import amharic from "../assets/amharic.png";
import english from "../assets/english.jpeg";
import logo from "../assets/logo.jpeg";
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
export default function LanguageSelection() {
  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem('i18nextLng') || 'en');

  const languages = [
    { code: "en", label: "English", native: "Eng",img:english },
    { code: "am", label: "Amharic", native: "Amh" ,img:amharic},
  ];
  const handleChangeLanguage = (newLang) => {
    i18n.changeLanguage(newLang);
    localStorage.setItem('i18nextLng', newLang);
    setSelectedLanguage(newLang);
  };

  const { t } = useTranslation();
  return (
    //min-h-screen
    <div className="flex flex-col items-center justify-center  p-2 bg-[var(--tg-theme-bg-color)]">
      {/* Google Translate Icon */}
      <div className="flex flex-col items-center space-y-2">
        <img src={logo} alt="Bot" className="rounded-sm w-20 h-20 object-cover" />
        <h2 className="text-lg font-semibold text-[var(--tg-theme-text-color)]">{t("select_language")}</h2>
        <p className="text-sm text-[var(--tg-theme-hint-color)] text-center">
          {t("language_sub")}
        </p>
      </div>

      {/* Language Options */}
      <div className="w-full max-w-sm mt-6  space-y-4">
        {languages.map((lang) => (
          <div
            key={lang.code}
            className={`flex items-center justify-between p-2 border rounded-lg cursor-pointer ${
              selectedLanguage === lang.code ? "border-[var(--tg-theme-button-color)] border-2  bg-[var(--tg-theme-bg-color)]" : "border-[var(--tg-theme-hint-color)] "
            }`}
            onClick={() => handleChangeLanguage(lang.code)}
          >
            <div className="flex items-center space-x-3">
            <img
                src={lang.img}
                alt={lang.label}
                className="w-10 h-10 object-cover rounded-full border border-gray-300"
              />
              <div>
                <p className="text-[var(--tg-theme-text-color)] font-medium">{lang.label}</p>
                <p className="text-[var(--tg-theme-hint-color)]  text-sm">{lang.native}</p>
              </div>
            </div>
            <input
              type="radio"
              name="language"
              checked={selectedLanguage === lang.code}
              className="accent-[var(--tg-theme-button-color)]  w-5 h-5"
              readOnly
            />
          </div>
        ))}
      </div>


        {/* <button className="w-full max-w-sm mt-10 bg-[var(--tg-theme-button-color)]  text-[var(--tg-theme-text-color)]  rounded-lg py-3">
          Submit
        </button> */}
      {/* </div> */}
    </div>
  );
}
