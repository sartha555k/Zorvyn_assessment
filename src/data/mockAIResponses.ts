export const MOCK_CHART_DATA = [
  { day: 'Mon', income: 4500, expense: 3200, cumulative: 1300 },
  { day: 'Tue', income: 200, expense: 1500, cumulative: 0 },
  { day: 'Wed', income: 150, expense: 800, cumulative: -650 },
  { day: 'Thu', income: 5000, expense: 2100, cumulative: 2250 },
  { day: 'Fri', income: 0, expense: 4500, cumulative: -2250 },
  { day: 'Sat', income: 100, expense: 1200, cumulative: -3350 },
  { day: 'Sun', income: 50, expense: 600, cumulative: -3900 },
];

export const MOCK_INSIGHTS = {
  healthScore: 78,
  anomalies: [
    "Your Food & Dining expenses are 40% higher than your 3-month average.",
    "Unusually high subscription charge detected from 'Adobe Cloud' (₹1,599).",
    "Detected a duplicated utility bill payment to 'BESCOM' on Oct 14th.",
  ],
  recommendations: [
    "Switch to a family plan for Spotify to save ₹80 monthly.",
    "Allocate ₹5,000 more to your 'Emergency Fund' to reach your goal by December.",
    "Your weekend spending is trending higher; consider a 'No-Spend' Saturday.",
  ],
};

export const MOCK_AI_CHAT_RESPONSES = [
  "Based on your recent transactions, you have spent 15% more on entertainment this week compared to last month.",
  "I've analyzed your recurring bills. You could save approximately ₹450 by consolidating your cloud storage plans.",
  "Your savings rate is currently at 22%. To reach your goal of ₹10,00,000 in 2 years, you'll need to increase this to 28%.",
  "I noticed a spike in your utility bills. This might be due to the summer air conditioning usage.",
  "Great job! You stayed within your dining budget for the third week in a row.",
];
