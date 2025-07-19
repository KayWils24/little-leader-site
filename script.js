/*
 * Shared JavaScript for Little Leader website.
 *
 * This script handles simple financial simulations, progress tracking via
 * localStorage and generation of the grade roadmap. It is intentionally
 * lightweight and uses vanilla JavaScript to remain easy to maintain and
 * extend. All currency values are purely virtual and used solely for
 * educational purposes—no real transactions occur.
 */

// Utility: get and set XP and badges in localStorage
function getXP() {
  return parseInt(localStorage.getItem('xp') || '0', 10);
}

function setXP(value) {
  localStorage.setItem('xp', value.toString());
}

function addXP(amount) {
  const current = getXP();
  setXP(current + amount);
}

function getBadges() {
  const raw = localStorage.getItem('badges');
  return raw ? JSON.parse(raw) : [];
}

function addBadge(name) {
  const badges = getBadges();
  if (!badges.includes(name)) {
    badges.push(name);
    localStorage.setItem('badges', JSON.stringify(badges));
  }
}

// Budgeting Game logic
window.calculateBudget = function () {
  const budget = parseFloat(document.getElementById('budget-input').value) || 0;
  const housing = parseFloat(document.getElementById('housing-input').value) || 0;
  const food = parseFloat(document.getElementById('food-input').value) || 0;
  const entertainment = parseFloat(document.getElementById('entertainment-input').value) || 0;
  const savings = parseFloat(document.getElementById('savings-input').value) || 0;
  const total = housing + food + entertainment + savings;
  const remaining = budget - total;
  const output = document.getElementById('budget-output');
  let message = '';
  if (remaining < 0) {
    message = `<p>You’ve overspent by $${Math.abs(remaining).toFixed(2)}! Try adjusting your amounts.</p>`;
  } else {
    message = `<p>You have $${remaining.toFixed(2)} left.</p>`;
    // Award XP for budgeting and badge if saving at least 20%
    addXP(10);
    if (savings >= budget * 0.2) {
      addBadge('Savings Star');
    }
  }
  output.innerHTML = message;
};

// Stock Trading Simulation
const stockGame = {
  balance: 1000,
  stocks: [
    { name: 'AlphaTech', price: 50, shares: 0 },
    { name: 'BetaEnergy', price: 30, shares: 0 },
    { name: 'GammaFoods', price: 20, shares: 0 }
  ]
};

function populateStockTable() {
  const tbody = document.querySelector('#stock-table tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  stockGame.stocks.forEach((stock, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${stock.name}</td>
      <td id="price-${index}">$${stock.price.toFixed(2)}</td>
      <td id="shares-${index}">${stock.shares}</td>
      <td><input type="number" id="buy-${index}" min="0" placeholder="0" style="width:60px;" /></td>
    `;
    tbody.appendChild(tr);
  });
}

function updateStockBalance() {
  const balanceDiv = document.getElementById('stock-balance');
  if (balanceDiv) {
    balanceDiv.textContent = `Balance: $${stockGame.balance.toFixed(2)}`;
  }
}

function updatePortfolioValue() {
  const valueDiv = document.getElementById('portfolio-value');
  if (!valueDiv) return;
  let totalValue = stockGame.balance;
  stockGame.stocks.forEach((stock) => {
    totalValue += stock.shares * stock.price;
  });
  valueDiv.textContent = `Portfolio value: $${totalValue.toFixed(2)}`;
}

function buyStock(index) {
  const input = document.getElementById(`buy-${index}`);
  if (!input) return;
  const quantity = parseInt(input.value || '0', 10);
  if (quantity <= 0) return;
  const cost = quantity * stockGame.stocks[index].price;
  if (cost <= stockGame.balance) {
    stockGame.balance -= cost;
    stockGame.stocks[index].shares += quantity;
    addXP(5);
    updateStockGameUI();
  } else {
    alert('Not enough balance!');
  }
  input.value = '';
}

function updateStockGameUI() {
  stockGame.stocks.forEach((stock, index) => {
    const priceCell = document.getElementById(`price-${index}`);
    const sharesCell = document.getElementById(`shares-${index}`);
    if (priceCell) priceCell.textContent = `$${stock.price.toFixed(2)}`;
    if (sharesCell) sharesCell.textContent = stock.shares;
  });
  updateStockBalance();
  updatePortfolioValue();
}

// Called when user clicks "Next Day" button
window.nextDay = function () {
  // Before price update, process purchases
  stockGame.stocks.forEach((stock, index) => {
    buyStock(index);
  });
  // Randomly adjust prices ±5%
  stockGame.stocks.forEach((stock) => {
    const change = 1 + (Math.random() * 0.1 - 0.05);
    stock.price = Math.max(1, stock.price * change);
  });
  updateStockGameUI();
  addXP(5);
};

// Progress page handler
function renderProgress() {
  const xp = getXP();
  const fill = document.getElementById('xp-fill');
  const xpText = document.getElementById('xp-text');
  const badgeList = document.getElementById('badge-list');
  if (fill && xpText) {
    const levelXP = 100; // points per level
    const percentage = Math.min((xp % levelXP) / levelXP * 100, 100);
    fill.style.width = `${percentage}%`;
    const level = Math.floor(xp / levelXP) + 1;
    xpText.textContent = `Level ${level} – ${xp} XP`;
  }
  if (badgeList) {
    badgeList.innerHTML = '';
    getBadges().forEach((badge) => {
      const span = document.createElement('span');
      span.className = 'badge';
      span.textContent = badge;
      badgeList.appendChild(span);
    });
  }
}

// Roadmap handler
function generateRoadmap() {
  const grades = [
    { label: 'K', topics: ['Counting money', 'Needs vs wants', 'Cause & effect in science'] },
    { label: '1', topics: ['Earning money through chores', 'Saving coins', 'Patterns in nature'] },
    { label: '2', topics: ['Spending wisely', 'Making simple graphs', 'Life cycles'] },
    { label: '3', topics: ['Producers & consumers', 'Data tables', 'Forces & motion'] },
    { label: '4', topics: ['Earning Income', 'Budget basics', 'Electricity & energy'] },
    { label: '5', topics: ['Saving vs spending', 'Fractions & percentages', 'Earth systems'] },
    { label: '6', topics: ['Entrepreneurship basics', 'Ratios & rates', 'Cells & organisms'] },
    { label: '7', topics: ['Credit & loans', 'Proportional reasoning', 'Chemical reactions'] },
    { label: '8', topics: ['Investing & interest', 'Linear equations', 'Waves & information'] },
    { label: '9', topics: ['Career planning', 'Exponential functions', 'Newton’s laws'] },
    { label: '10', topics: ['Saving for college', 'Statistics & probability', 'Climate change'] },
    { label: '11', topics: ['Managing risk', 'Functions & modelling', 'Genetics & heredity'] },
    { label: '12', topics: ['Personal finance capstone', 'Calculus basics', 'Engineering design'] }
  ];
  const grid = document.getElementById('roadmap-grid');
  const detailsDiv = document.getElementById('roadmap-details');
  if (!grid) return;
  grades.forEach((grade, idx) => {
    const item = document.createElement('div');
    item.className = 'roadmap-item';
    item.innerHTML = `<h5>Grade ${grade.label}</h5><p>${grade.topics[0]}</p>`;
    item.addEventListener('click', () => {
      // Show details
      detailsDiv.style.display = 'block';
      detailsDiv.innerHTML = `<h4>Grade ${grade.label} Topics</h4>`;
      const ul = document.createElement('ul');
      grade.topics.forEach((topic) => {
        const li = document.createElement('li');
        li.textContent = topic;
        ul.appendChild(li);
      });
      detailsDiv.appendChild(ul);
    });
    grid.appendChild(item);
  });
}

/* ---------------------------------------------------------------------
 * Additional modules added for the expanded Simulation Lab.
 *
 * These functions implement new features: daily affirmations, a real
 * estate investing game, a college & career planner and a simple quiz
 * tied to a video lesson. Each feature awards XP to encourage
 * participation and can award badges for specific achievements. The
 * operations remain entirely client-side for ease of use and safety.
 */

// Positive affirmations to motivate learners. Each page load selects one.
const affirmations = [
  "You are building a bright future, one smart choice at a time.",
  "Every mistake is a lesson that brings you closer to success.",
  "Your goals are within reach—keep learning and growing!",
  "Invest in yourself first. You are your most valuable asset.",
  "Dream big and take small steps every day to achieve it.",
  "Confidence comes from knowledge; keep asking questions."
];

function showAffirmation() {
  const el = document.getElementById('affirmation-text');
  if (!el) return;
  const index = Math.floor(Math.random() * affirmations.length);
  el.textContent = affirmations[index];
}

// Real Estate Investing Game
const propertyGame = {
  balance: 5000,
  properties: [
    { name: 'Small House', price: 2000, units: 0 },
    { name: 'Townhouse', price: 3000, units: 0 },
    { name: 'Apartment', price: 4000, units: 0 }
  ]
};

function populatePropertyTable() {
  const tbody = document.querySelector('#property-table tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  propertyGame.properties.forEach((prop, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${prop.name}</td>
      <td id="prop-price-${index}">$${prop.price.toFixed(2)}</td>
      <td id="prop-units-${index}">${prop.units}</td>
      <td><input type="number" id="prop-buy-${index}" min="0" placeholder="0" style="width:60px;" /></td>
    `;
    tbody.appendChild(tr);
  });
}

function updatePropertyBalance() {
  const balDiv = document.getElementById('property-balance');
  if (balDiv) {
    balDiv.textContent = `Balance: $${propertyGame.balance.toFixed(2)}`;
  }
}

function updatePropertyPortfolioValue() {
  const valDiv = document.getElementById('property-portfolio-value');
  if (!valDiv) return;
  let total = propertyGame.balance;
  propertyGame.properties.forEach((prop) => {
    total += prop.units * prop.price;
  });
  valDiv.textContent = `Portfolio value: $${total.toFixed(2)}`;
}

function updatePropertyGameUI() {
  propertyGame.properties.forEach((prop, index) => {
    const priceCell = document.getElementById(`prop-price-${index}`);
    const unitsCell = document.getElementById(`prop-units-${index}`);
    if (priceCell) priceCell.textContent = `$${prop.price.toFixed(2)}`;
    if (unitsCell) unitsCell.textContent = prop.units;
  });
  updatePropertyBalance();
  updatePropertyPortfolioValue();
}

function buyProperty(index) {
  const input = document.getElementById(`prop-buy-${index}`);
  if (!input) return;
  const quantity = parseInt(input.value || '0', 10);
  if (quantity <= 0) return;
  const cost = quantity * propertyGame.properties[index].price;
  if (cost <= propertyGame.balance) {
    propertyGame.balance -= cost;
    propertyGame.properties[index].units += quantity;
    addXP(5);
    updatePropertyGameUI();
  } else {
    alert('Not enough balance to purchase that many units.');
  }
  input.value = '';
}

// Called when user clicks "Next Week" button
window.nextWeek = function () {
  // Process purchases
  propertyGame.properties.forEach((prop, index) => {
    buyProperty(index);
  });
  // Adjust property prices randomly ±10%
  propertyGame.properties.forEach((prop) => {
    const change = 1 + (Math.random() * 0.2 - 0.1);
    prop.price = Math.max(100, prop.price * change);
  });
  updatePropertyGameUI();
  addXP(5);
};

// College & Career Planner
window.calculateCollegePlan = function () {
  const collegeSelect = document.getElementById('college-select');
  const yearsInput = document.getElementById('years-input');
  const scholarshipInput = document.getElementById('scholarship-input');
  const careerSelect = document.getElementById('career-select');
  const resultDiv = document.getElementById('college-result');
  if (!collegeSelect || !yearsInput || !scholarshipInput || !careerSelect || !resultDiv) {
    return;
  }
  const tuitionMap = {
    community: 10000,
    state: 20000,
    private: 40000
  };
  const salaryMap = {
    teacher: 45000,
    engineer: 70000,
    artist: 30000,
    entrepreneur: 60000,
    scientist: 65000
  };
  const college = collegeSelect.value;
  const years = parseInt(yearsInput.value || '4', 10);
  let scholarship = parseFloat(scholarshipInput.value || '0');
  const career = careerSelect.value;
  const tuitionPerYear = tuitionMap[college];
  const totalTuition = tuitionPerYear * years;
  if (scholarship > totalTuition) scholarship = totalTuition;
  const loanPrincipal = totalTuition - scholarship;
  // Approximate monthly payment over 10 years at 5% annual interest.
  const monthlyPayment = (loanPrincipal * 0.05) / 12;
  const salary = salaryMap[career];
  let message = `<p>Total tuition cost: $${totalTuition.toFixed(0)}</p>`;
  message += `<p>Scholarship amount: $${scholarship.toFixed(0)}</p>`;
  message += `<p>Loan principal: $${loanPrincipal.toFixed(0)}</p>`;
  message += `<p>Estimated monthly loan payment: $${monthlyPayment.toFixed(0)}</p>`;
  message += `<p>Expected starting salary as a ${career}: $${salary.toFixed(0)}/year</p>`;
  resultDiv.innerHTML = message;
  addXP(15);
  if (scholarship > 0) addBadge('Scholarship Seeker');
};

// Quiz handling
window.submitQuiz = function () {
  const options = document.getElementsByName('quiz');
  let selected = -1;
  options.forEach((opt) => {
    if (opt.checked) selected = parseInt(opt.value, 10);
  });
  const feedback = document.getElementById('quiz-feedback');
  if (!feedback) return;
  if (selected === -1) {
    feedback.textContent = 'Please select an answer before submitting.';
    return;
  }
  // correct answer index is 1 (20% saving recommended)
  if (selected === 1) {
    feedback.textContent = 'Correct! Aim to save around 20% of your income each month.';
    addXP(10);
    addBadge('Quiz Whiz');
  } else {
    feedback.textContent = 'Not quite. Many experts recommend saving about 20% of your earnings.';
    addXP(2);
  }
};

// On load, detect which page and initialise appropriate modules
document.addEventListener('DOMContentLoaded', () => {
  // Determine current page by checking for unique elements
  // When on the simulation lab page, initialise games and affirmation.
  if (document.getElementById('budget-game')) {
    // Budget & stock
    populateStockTable();
    updateStockGameUI();
    // Real estate
    populatePropertyTable();
    updatePropertyGameUI();
    // Show a random positive affirmation
    showAffirmation();
  }
  // On progress page, render XP and badges
  if (document.getElementById('xp-fill')) {
    renderProgress();
  }
  // On roadmap page, generate grade cards
  if (document.getElementById('roadmap-grid')) {
    generateRoadmap();
  }

  // Initialise needs vs wants game if present
  if (document.getElementById('needs-wants-game')) {
    initNeedsWantsGame();
  }
  // Initialise storybook game if present
  if (document.getElementById('storybook-game')) {
    initStoryGame();
  }
  // Initialise penny game if present
  if (document.getElementById('penny-game')) {
    initPennyGame();
  }
});

/* ---------------------------------------------------------------------
 * Kindergarten interactive games
 *
 * These functions implement simple games to practice classifying needs and
 * wants, exploring forces through pushes and pulls, reading comprehension
 * via a short story, and counting coins. They award XP and badges to
 * encourage participation.
 */

// Needs vs Wants Sorting Game
const needsWantsItems = [
  { name: 'Apple', correct: 'need' },
  { name: 'Toy Car', correct: 'want' },
  { name: 'Milk', correct: 'need' },
  { name: 'Ice Cream', correct: 'want' },
  { name: 'Shoes', correct: 'need' }
];
const nwSelections = {};

function initNeedsWantsGame() {
  const container = document.getElementById('nw-game-container');
  if (!container) return;
  container.innerHTML = '';
  needsWantsItems.forEach((item, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.style.marginBottom = '8px';
    const label = document.createElement('span');
    label.textContent = item.name;
    label.style.display = 'inline-block';
    label.style.width = '120px';
    const needBtn = document.createElement('button');
    needBtn.textContent = 'Need';
    needBtn.addEventListener('click', () => selectNW(index, 'need'));
    const wantBtn = document.createElement('button');
    wantBtn.textContent = 'Want';
    wantBtn.addEventListener('click', () => selectNW(index, 'want'));
    itemDiv.appendChild(label);
    itemDiv.appendChild(needBtn);
    itemDiv.appendChild(wantBtn);
    container.appendChild(itemDiv);
  });
}

function selectNW(index, answer) {
  nwSelections[index] = answer;
}

window.submitNeedsWants = function () {
  let correctCount = 0;
  needsWantsItems.forEach((item, index) => {
    if (nwSelections[index] === item.correct) {
      correctCount++;
    }
  });
  const feedback = document.getElementById('nw-feedback');
  if (!feedback) return;
  feedback.textContent = `You classified ${correctCount} out of ${needsWantsItems.length} items correctly.`;
  addXP(correctCount * 2);
  if (correctCount === needsWantsItems.length) {
    addBadge('Needs vs Wants Pro');
  }
};

// Pushes & Pulls Motion Lab
let forceExperiments = 0;
window.applyForce = function (type) {
  const input = document.getElementById('force-strength');
  const output = document.getElementById('force-output');
  if (!input || !output) return;
  let strength = parseInt(input.value || '0', 10);
  if (isNaN(strength) || strength < 1) strength = 1;
  if (strength > 10) strength = 10;
  const distance = strength * 2;
  if (type === 'push') {
    output.textContent = `You pushed with strength ${strength}. The object moved ${distance} units forward.`;
  } else {
    output.textContent = `You pulled with strength ${strength}. The object moved ${distance} units backward.`;
  }
  forceExperiments++;
  addXP(2);
  if (forceExperiments >= 3) {
    addBadge('Force Investigator');
  }
};

// Storybook Adventure
const storyContent =
  'Once upon a time, a little rabbit named Ruby lived in a forest. She loved to explore and make new friends. One day, she met a shy turtle named Max and together they found a beautiful garden.';
const storyQuestions = [
  {
    text: 'Who is the main character?',
    options: ['Ruby', 'Max', 'Bear'],
    answer: 0
  },
  {
    text: 'What did Ruby find in the story?',
    options: ['A river', 'A garden', 'A cave'],
    answer: 1
  },
  {
    text: 'Who did Ruby meet?',
    options: ['A turtle named Max', 'A mouse named Sam', 'A bird named Bella'],
    answer: 0
  }
];

function initStoryGame() {
  const textEl = document.getElementById('story-text');
  const questionsDiv = document.getElementById('story-questions');
  if (!textEl || !questionsDiv) return;
  textEl.textContent = storyContent;
  questionsDiv.innerHTML = '';
  storyQuestions.forEach((q, qIndex) => {
    const qDiv = document.createElement('div');
    qDiv.style.marginBottom = '8px';
    const p = document.createElement('p');
    p.textContent = q.text;
    qDiv.appendChild(p);
    q.options.forEach((opt, optIndex) => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = `story-q${qIndex}`;
      input.value = optIndex.toString();
      label.appendChild(input);
      label.appendChild(document.createTextNode(opt));
      qDiv.appendChild(label);
      qDiv.appendChild(document.createElement('br'));
    });
    questionsDiv.appendChild(qDiv);
  });
}

window.submitStoryAnswers = function () {
  let correct = 0;
  storyQuestions.forEach((q, qIndex) => {
    const options = document.getElementsByName(`story-q${qIndex}`);
    let selected = -1;
    options.forEach((opt) => {
      if (opt.checked) {
        selected = parseInt(opt.value, 10);
      }
    });
    if (selected === q.answer) {
      correct++;
    }
  });
  const feedback = document.getElementById('story-feedback');
  if (!feedback) return;
  feedback.textContent = `You answered ${correct} out of ${storyQuestions.length} questions correctly.`;
  addXP(correct * 2);
  if (correct === storyQuestions.length) {
    addBadge('Story Explorer');
  }
};

// Penny Bank Counting Game
let pennyTarget = 10;
let pennyCount = 0;
let nickelCount = 0;

function initPennyGame() {
  const targetEl = document.getElementById('penny-target');
  const totalEl = document.getElementById('penny-total');
  if (!targetEl || !totalEl) return;
  // Choose a random target in multiples of 5 between 5 and 20
  const targets = [5, 10, 15, 20];
  pennyTarget = targets[Math.floor(Math.random() * targets.length)];
  targetEl.textContent = pennyTarget;
  pennyCount = 0;
  nickelCount = 0;
  updatePennyTotal();
}

function updatePennyTotal() {
  const totalEl = document.getElementById('penny-total');
  const pennyCountEl = document.getElementById('penny-count');
  const nickelCountEl = document.getElementById('nickel-count');
  if (totalEl && pennyCountEl && nickelCountEl) {
    const total = pennyCount * 1 + nickelCount * 5;
    totalEl.textContent = `Total: ${total}¢`;
    pennyCountEl.textContent = pennyCount.toString();
    nickelCountEl.textContent = nickelCount.toString();
  }
}

window.changeCoins = function (type, delta) {
  if (type === 'penny') {
    pennyCount = Math.max(0, pennyCount + delta);
  } else {
    nickelCount = Math.max(0, nickelCount + delta);
  }
  updatePennyTotal();
};

window.checkPennyGame = function () {
  const total = pennyCount * 1 + nickelCount * 5;
  const feedback = document.getElementById('penny-feedback');
  if (!feedback) return;
  if (total === pennyTarget) {
    feedback.textContent = `Great job! You made exactly ${pennyTarget}¢.`;
    addXP(5);
    addBadge('Coin Counter');
    // Restart with a new target
    initPennyGame();
  } else if (total < pennyTarget) {
    feedback.textContent = `You have ${total}¢. Add ${pennyTarget - total}¢ more.`;
  } else {
    feedback.textContent = `You have ${total}¢. Remove ${total - pennyTarget}¢ to reach ${pennyTarget}¢.`;
  }
};