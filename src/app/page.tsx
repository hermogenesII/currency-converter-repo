"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const API_KEY = "553d8c0042a1ac0ddd1855b4";
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`;

export default function Home() {
  const [state, setState] = useState({
    currencies: [] as string[],
    fromCurrency: "PHP",
    toCurrency: "USD",
    amount: 1,
    conversionResult: null as number | null,
  });

  useEffect(() => {
    axios
      .get(`${BASE_URL}/latest/PHP`)
      .then((res) =>
        setState((prev) => ({
          ...prev,
          currencies: Object.keys(res.data.conversion_rates),
        }))
      )
      .catch((err) => console.error("Error fetching currencies:", err));
  }, []);

  const handleConvert = async () => {
    if (state.fromCurrency === state.toCurrency) {
      setState((prev) => ({ ...prev, conversionResult: state.amount }));
      return;
    }

    try {
      const res = await axios.get(
        `${BASE_URL}/pair/${state.fromCurrency}/${state.toCurrency}/${state.amount}`
      );
      setState((prev) => ({
        ...prev,
        conversionResult: res.data.conversion_result,
      }));
    } catch (err) {
      console.error("Error fetching conversion rate:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black-100 p-6">
      <h1 className="text-2xl font-bold mb-5 text-white bg-gray-600 rounded px-5 p-lg">
        Currency Converter
      </h1>
      <div className="flex flex-col gap-3 bg-gray-600 p-6 rounded shadow-md w-80">
        <input
          type="number"
          value={state.amount}
          onChange={(e) =>
            setState((prev) => ({
              ...prev,
              amount: parseFloat(e.target.value) || 0,
            }))
          }
          className="border p-2 rounded w-full"
          placeholder="Enter amount"
        />
        <div className="flex gap-2">
          <select
            value={state.fromCurrency}
            onChange={(e) =>
              setState((prev) => ({ ...prev, fromCurrency: e.target.value }))
            }
            className="border p-2 rounded w-1/2"
          >
            {state.currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
          <span className="text-lg">→</span>
          <select
            value={state.toCurrency}
            onChange={(e) =>
              setState((prev) => ({ ...prev, toCurrency: e.target.value }))
            }
            className="border p-2 rounded w-1/2"
          >
            {state.currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleConvert}
          className="bg-blue-500 text-white py-2 rounded"
        >
          Convert
        </button>
        {state.conversionResult !== null && (
          <h2 className="text-lg font-semibold">
            {state.amount} {state.fromCurrency} ={" "}
            {state.conversionResult.toFixed(2)} {state.toCurrency}
          </h2>
        )}
      </div>
    </div>
  );
}
