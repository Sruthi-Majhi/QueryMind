import { createContext, useState, useEffect } from "react";

export const MyContext = createContext("");

export const MyContextProvider = ({ children, chatValues }) => {
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        return saved ? JSON.parse(saved) : false;
    });

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
        document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(prev => !prev);
    };

    const combinedValues = {
        ...chatValues,
        darkMode,
        toggleDarkMode
    };

    return (
        <MyContext.Provider value={combinedValues}>
            {children}
        </MyContext.Provider>
    );
};

export default MyContext;