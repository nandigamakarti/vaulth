import React, { useEffect, useState } from 'react';

const QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { text: "Small habits make a big difference.", author: "James Clear" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
  { text: "Great things never come from comfort zones.", author: "Roy T. Bennett" },
  { text: "Dream it. Wish it. Do it.", author: "Unknown" },
  { text: "Stay positive, work hard, make it happen.", author: "Unknown" }
];

function getQuoteOfTheDay() {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return QUOTES[dayOfYear % QUOTES.length];
}

const QUOTE_TOGGLE_KEY = 'showMotivationalQuote';

export default function MotivationalQuote() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(QUOTE_TOGGLE_KEY);
    if (saved !== null) setShow(saved === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem(QUOTE_TOGGLE_KEY, show.toString());
  }, [show]);

  const quote = getQuoteOfTheDay();

  return (
    <div style={{ marginTop: 'auto', padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
        <label>
          <input
            type="checkbox"
            checked={show}
            onChange={() => setShow((prev) => !prev)}
            style={{ marginRight: 8 }}
          />
          Show Daily Motivational Quote
        </label>
      </div>
      {show && (
        <div style={{ textAlign: 'center', fontStyle: 'italic', marginTop: 16 }}>
          <span>“{quote.text}”</span>
          <div style={{ marginTop: 8, fontStyle: 'normal', fontSize: 14, color: '#888' }}>
            — {quote.author}
          </div>
        </div>
      )}
    </div>
  );
} 