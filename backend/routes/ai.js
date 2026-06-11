const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const inMemoryDB = require('../config/memorydb');
const { protect } = require('../middleware/auth');

const router = express.Router();

let genAI = null;
let geminiAvailable = false;

if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.startsWith('AIzaSy')) {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    geminiAvailable = true;
    console.log('Gemini AI: Configured');
  } catch (e) {
    console.log('Gemini AI: Failed to initialize, using built-in assistant');
  }
} else {
  console.log('Gemini AI: No valid key found, using built-in assistant');
}

async function getGeminiReply(message) {
  if (!genAI || !geminiAvailable) return null;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: 'Hello' }] },
        { role: 'model', parts: [{ text: 'Hi! I am CarbonIQ, your AI sustainability coach. How can I help you reduce your carbon footprint today?' }] },
      ],
      generationConfig: {
        maxOutputTokens: 250,
        temperature: 0.7,
      },
    });
    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error.message);
    geminiAvailable = false;
    return null;
  }
}

function getSmartReply(message) {
  var lower = message.toLowerCase().trim();

  if (/^(hi|hello|hey|howdy|sup|yo|hola|good\s*(morning|afternoon|evening))/.test(lower)) {
    var greetings = [
      'Hey there! I am your sustainability coach. What area would you like to work on - transport, food, energy, or waste?',
      'Hi! Ready to reduce your carbon footprint? Ask me about any sustainability topic!',
      'Hello! I can help you make greener choices. What is on your mind?',
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  if (/transport|car|drive|commut|bus|train|flight|fly|plane|bike|cycl|walk|vehicle|gas|petrol|fuel|uber|taxi/.test(lower)) {
    if (/reduce|lower|decrease|cut|save|improve|better|tip|advice|suggest|how|what|way|best/.test(lower)) {
      return 'Top transport tips:\n\n- Bike or walk for trips under 3km (saves 2.1 kg CO2 per trip)\n- Use public transit - bus emits 0.089 kg/km vs car at 0.21 kg/km\n- Carpool to split emissions in half\n- Work from home when possible\n- For flights, choose direct routes and economy class\n\nWhich could you try this week?';
    }
    if (/emission|carbon|footprint|impact|co2|kg|much/.test(lower)) {
      return 'Transport emission comparisons:\n\n- Walking/biking: 0 kg CO2/km\n- Train: 0.041 kg/km\n- Bus: 0.089 kg/km\n- Electric car: 0.053 kg/km\n- Petrol car: 0.21 kg/km\n- Domestic flight: 0.255 kg/km\n\nSwitching a 10km commute from car to bus saves about 1.2 kg CO2 per trip!';
    }
    return 'Transportation is typically 25-30% of your carbon footprint. Quick wins: bike short trips, carpool, use public transit, and combine errands into one trip. Want specific tips for reducing transport emissions?';
  }

  if (/food|eat|diet|meal|meat|beef|chicken|veg|plant|dairy|milk|cheese|protein|lunch|dinner|breakfast|cook|recipe/.test(lower)) {
    if (/reduce|lower|decrease|cut|save|improve|better|tip|advice|suggest|how|what|way|best/.test(lower)) {
      return 'Food sustainability tips:\n\n- Try Meatless Mondays (saves 2.5 kg CO2)\n- Replace beef with chicken (saves 20 kg CO2/kg)\n- Buy local seasonal produce\n- Reduce food waste - plan meals ahead\n- Compost food scraps\n\nThe biggest impact? Swap beef for plant-based meals!';
    }
    if (/emission|carbon|footprint|impact|co2|kg|much/.test(lower)) {
      return 'Food carbon emissions per kg:\n\n- Beef: 27 kg CO2\n- Lamb: 39 kg CO2\n- Cheese: 13.5 kg CO2\n- Chicken: 6.9 kg CO2\n- Eggs: 4.8 kg CO2\n- Rice: 2.7 kg CO2\n- Vegetables: 2 kg CO2\n- Legumes: 0.9 kg CO2\n\nChoosing chicken over beef for one meal saves about 10 kg CO2!';
    }
    return 'Food accounts for about 25% of emissions. Biggest impact: reduce beef/dairy, eat local seasonal produce, and cut food waste. A plant-based meal saves 2-5 kg CO2 vs a meat-based one. Want tips for any specific area?';
  }

  if (/energy|electric|power|light|bulb|heating|cool|ac|thermostat|solar|renewable|battery|applian|wash|dry/.test(lower)) {
    if (/reduce|lower|decrease|cut|save|improve|better|tip|advice|suggest|how|what|way|best|bill|cost/.test(lower)) {
      return 'Energy saving tips:\n\n- Switch to LED bulbs (uses 75% less energy)\n- Unplug devices on standby (saves 5-10% on bills)\n- Lower thermostat by 2 degrees (saves 1.8 tonnes CO2/year)\n- Use a programmable thermostat\n- Air dry clothes instead of using dryer\n- Wash clothes in cold water\n\nQuick win: LED bulbs pay for themselves in 3 months!';
    }
    if (/emission|carbon|footprint|impact|co2|kg|kwh|much/.test(lower)) {
      return 'Energy emission factors:\n\n- Coal electricity: 0.91 kg CO2/kWh\n- Gas electricity: 0.45 kg CO2/kWh\n- Solar: 0.02 kg CO2/kWh\n- Wind: 0.01 kg CO2/kWh\n\nAverage household uses about 10,000 kWh/year. Switching to a green energy provider can eliminate most of this!';
    }
    return 'Home energy is about 20% of emissions. Top actions: switch to LED bulbs, unplug standby devices, adjust thermostat, and consider green energy. A single LED bulb saves 150 kg CO2 over its lifetime. Want details on any area?';
  }

  if (/waste|recycl|trash|garbage|landfill|compost|plastic|paper|glass|reuse|reduce|dispos/.test(lower)) {
    if (/reduce|lower|decrease|cut|save|improve|better|tip|advice|suggest|how|what|way|best/.test(lower)) {
      return 'Waste reduction tips:\n\n- Follow the 3 Rs: Reduce, Reuse, Recycle\n- Bring reusable bags, bottles, and containers\n- Compost food scraps (diverts 30% of waste)\n- Buy products with minimal packaging\n- Donate or sell items instead of throwing away\n- Choose refillable products\n\nRecycling alone is not enough - reducing consumption has the biggest impact!';
    }
    if (/emission|carbon|footprint|impact|co2|kg|much/.test(lower)) {
      return 'Waste emission facts:\n\n- Landfill produces methane (28x worse than CO2)\n- Recycling 1 tonne of paper saves 1.5 tonnes CO2\n- Plastic takes 400+ years to decompose\n- Food waste in landfill = 4.5 kg CO2/kg\n- Composting food waste = 0 kg CO2\n\nComposting is the single best thing for waste emissions!';
    }
    return 'Waste creates methane in landfills - 28x more potent than CO2. Best actions: reduce consumption first, reuse items, compost food scraps, and recycle properly. Composting alone can cut your waste footprint by 30%. Want specific tips?';
  }

  if (/water|shower|bath|faucet|tap|toilet|gallon|liter|leak/.test(lower)) {
    return 'Water saving tips:\n\n- Take 5-minute showers (saves 40 liters each)\n- Fix leaky faucets (1 drip/sec = 30 liters/day)\n- Install low-flow showerhead (saves 50%)\n- Use full loads in washer/dishwasher\n- Collect rainwater for plants\n\nWater treatment uses energy - saving water also saves CO2!';
  }

  if (/carbon footprint|my emission|my impact|how much.*co2|my carbon|overall/.test(lower)) {
    return 'The average person produces about 4 tonnes CO2/year. Here is a typical breakdown:\n\n- Transport: 25-30%\n- Home energy: 20-25%\n- Food: 20-25%\n- Goods and services: 15-20%\n- Waste: 5-10%\n\nTrack your activities in CarbonIQ to see your personal breakdown and get personalized tips!';
  }

  if (/climate|global warming|environment|sustainab|green|eco|planet|earth/.test(lower)) {
    return 'Climate action starts with small daily choices. The biggest impacts:\n\n1. Reduce car travel (25% of emissions)\n2. Eat less meat (15% of emissions)\n3. Save home energy (20% of emissions)\n4. Buy less stuff (15% of emissions)\n\nYou do not have to be perfect - every small change adds up!';
  }

  if (/bill|cost|expens|money|cheap|afford|budget/.test(lower)) {
    return 'Going green can save money too!\n\n- LED bulbs: Save $75/year per bulb replaced\n- Smart thermostat: Save $150/year\n- Energy-efficient appliances: Save $100-500/year\n- Solar panels: Pay for themselves in 7-10 years\n- Line-drying clothes: Save $200/year\n\nSustainability often saves money long-term!';
  }

  if (/tip|advice|suggest|help|how|what should|recommend|idea/.test(lower)) {
    return 'Top 5 quick wins:\n\n1. Bike instead of drive (saves 2.1 kg CO2)\n2. Eat a plant-based meal (saves 2.5 kg CO2)\n3. Turn off lights (saves 0.5 kg/day)\n4. Take shorter showers (saves 40 liters)\n5. Bring reusable bags (saves plastic)\n\nStart with one this week!';
  }

  if (/thank|thanks|thx|appreciate|helpful|great/.test(lower)) {
    return 'You are welcome! Remember, every small action adds up. Track your activities in CarbonIQ to see your impact grow. Come back anytime for more tips!';
  }

  if (/bye|goodbye|see you|later|cya/.test(lower)) {
    return 'Bye! Keep making sustainable choices. Your planet thanks you! Come back anytime.';
  }

  return 'I can help with:\n\n- Transport - reduce commute emissions\n- Food - eat more sustainably\n- Energy - save power at home\n- Waste - reduce and recycle\n- Water - conserve water\n\nAsk me about any of these topics, or say "give me a tip" for quick wins!';
}

// Chat endpoint - no auth required for basic chat
router.post('/chat', async (req, res) => {
  try {
    var message = req.body.message;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    var geminiReply = await getGeminiReply(message);
    if (geminiReply) {
      return res.json({ reply: geminiReply, source: 'gemini' });
    }

    var smartReply = getSmartReply(message);
    res.json({ reply: smartReply, source: 'builtin' });
  } catch (error) {
    console.error('Chat error:', error.message);
    var fallbackReply = getSmartReply(req.body.message);
    res.json({ reply: fallbackReply, source: 'builtin' });
  }
});

// Insights endpoint
router.get('/insights', protect, async (req, res) => {
  try {
    var activities = inMemoryDB.getActivities(req.user._id, { limit: 50 });

    var totalEmissions = activities
      .filter(function (a) { return !a.isPositive; })
      .reduce(function (sum, a) { return sum + a.carbonValue; }, 0);

    var totalSaved = activities
      .filter(function (a) { return a.isPositive; })
      .reduce(function (sum, a) { return sum + a.carbonValue; }, 0);

    var categoryBreakdown = {};
    activities.forEach(function (a) {
      if (!categoryBreakdown[a.category]) categoryBreakdown[a.category] = 0;
      if (!a.isPositive) categoryBreakdown[a.category] += a.carbonValue;
    });

    var topCategory = Object.entries(categoryBreakdown).sort(function (a, b) { return b[1] - a[1]; })[0];

    var insights = [];

    if (totalSaved > 0) {
      insights.push('You have saved ' + totalSaved.toFixed(1) + ' kg CO2 - that is like planting ' + Math.floor(totalSaved / 2) + ' trees!');
    } else {
      insights.push('Start logging sustainable activities to track your impact!');
    }

    if (topCategory) {
      insights.push('Your biggest emission source is ' + topCategory[0] + ' (' + topCategory[1].toFixed(1) + ' kg). Focus there for maximum impact.');
    }

    if (activities.length > 10) {
      insights.push('You are building great tracking habits! Patterns will emerge as you log more.');
    } else {
      insights.push('Log more activities to unlock personalized insights about your habits.');
    }

    res.json({
      insights: insights,
      weeklyGoal: 'Save 3 kg CO2 this week',
      potentialSavings: '5.2 kg',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Recommendations endpoint
router.get('/recommendations', protect, async (req, res) => {
  try {
    var activities = inMemoryDB.getActivities(req.user._id, { limit: 50 });

    var totalEmissions = activities
      .filter(function (a) { return !a.isPositive; })
      .reduce(function (sum, a) { return sum + a.carbonValue; }, 0);

    var totalSaved = activities
      .filter(function (a) { return a.isPositive; })
      .reduce(function (sum, a) { return sum + a.carbonValue; }, 0);

    var categoryBreakdown = {};
    activities.forEach(function (a) {
      if (!categoryBreakdown[a.category]) categoryBreakdown[a.category] = 0;
      if (!a.isPositive) categoryBreakdown[a.category] += a.carbonValue;
    });

    var topCategory = Object.entries(categoryBreakdown).sort(function (a, b) { return b[1] - a[1]; })[0];

    var recommendations = {
      improvements: [
        topCategory ? 'Your highest emission category is ' + topCategory[0] + ' (' + topCategory[1].toFixed(1) + ' kg CO2). Consider reducing activities in this area.' : 'Start logging activities to get personalized improvement suggestions.',
        totalSaved === 0 ? 'You have not logged any carbon savings yet. Try walking or cycling instead of driving!' : 'Great job saving ' + totalSaved.toFixed(1) + ' kg CO2! Keep it up!',
        'Consider switching to renewable energy sources for your home electricity needs.'
      ],
      recommendations: [
        'Use public transportation or carpool when possible to reduce transport emissions.',
        'Reduce meat consumption - try Meatless Mondays!',
        'Switch to LED bulbs and energy-efficient appliances.',
        'Buy local and seasonal produce to reduce food miles.',
        'Reduce, reuse, and recycle to minimize waste.'
      ],
      quickWins: [
        'Turn off lights when leaving a room',
        'Unplug electronics when not in use',
        'Take shorter showers to save water and energy',
        'Bring reusable bags when shopping'
      ],
      longTermGoals: [
        'Aim to reduce your carbon footprint by 20% this year',
        'Consider switching to an electric vehicle',
        'Install solar panels or switch to a green energy provider',
        'Achieve a zero-waste lifestyle'
      ]
    };

    res.json({ recommendations: JSON.stringify(recommendations) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Analyze activity endpoint
router.post('/analyze-activity', protect, async (req, res) => {
  try {
    var description = req.body.description;
    var category = req.body.category;

    var carbonEstimates = {
      transport: { short: 2.1, medium: 5.4, long: 12.0 },
      food: { vegetarian: 1.2, chicken: 3.5, beef: 8.5 },
      energy: { low: 0.5, medium: 2.0, high: 5.0 },
      waste: { low: 0.3, medium: 1.0, high: 2.5 },
    };

    var estimates = carbonEstimates[category] || { medium: 2.0 };

    var analysis = {
      estimatedCO2: estimates.medium,
      comparison: 'Compared to average activities in this category',
      reductionTips: [
        'Look for eco-friendly alternatives',
        'Consider the environmental impact before purchasing',
        'Choose sustainable options when possible'
      ],
      significance: 'Every small action counts towards reducing your carbon footprint!'
    };

    res.json({ analysis: JSON.stringify(analysis) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
