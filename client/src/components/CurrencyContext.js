import React, { createContext, useState, useContext } from "react";

// Create a context for currency
const CurrencyContext = createContext();

// Provider component
export const CurrencyProvider = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [exchangeRates] = useState({
    USD: 1, // Base currency
    EUR: 0.85,
    GBP: 0.75,
    INR: 74,
  });

  const value = {
    selectedCurrency,
    exchangeRates,
    setSelectedCurrency,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

// Hook to use the currency context
export const useCurrency = () => useContext(CurrencyContext);
