

function pulseSection(buttonSelector) {
  const section = document.querySelector(buttonSelector).closest('.calculator-section');
  if (section) {
    section.classList.add('active');
    setTimeout(() => section.classList.remove('active'), 800);
  }
}

function disableButtonTemporarily(buttonSelector, ms = 600) {
  const btn = document.querySelector(buttonSelector);
  if (btn) {
    btn.disabled = true;
    btn.style.opacity = "0.7";
    setTimeout(() => {
      btn.disabled = false;
      btn.style.opacity = "1";
    }, ms);
  }
}

function showResult(boxId, text, isError = false) {
  const box = document.getElementById(boxId);
  if (!box) return;
  
  box.innerHTML = text;
  box.className = 'result-box updated ' + (isError ? 'error' : 'success');
  
  setTimeout(() => {
    box.classList.remove('updated');
  }, 500);
}

function clearSection(boxId) {
  const box = document.getElementById(boxId);
  if (!box) return;
  
  box.style.opacity = '0';
  box.style.transform = 'translateY(-8px)';
  setTimeout(() => {
    box.innerHTML = '';
    box.className = 'result-box';
    box.style.opacity = '1';
    box.style.transform = 'translateY(0)';
  }, 250);
}


function calcRoulette() {
  pulseSection('[onclick="calcRoulette()"]');
  disableButtonTemporarily('[onclick="calcRoulette()"]');
  
  try {
    const rouletteType = document.querySelector('input[name="roulette-type"]:checked')?.value;
    const colorBet = document.querySelector('input[name="color-bet"]:checked')?.value;
    
    if (!rouletteType) throw new Error("Please select roulette type.");
    if (!colorBet) throw new Error("Please select a color to ‘bet’ on.");
    
    let totalNumbers, winningNumbers, colorName, emoji;
    
    if (rouletteType === 'american') {
      totalNumbers = 38; // 1-36 + 0 + 00
    } else {
      totalNumbers = 37; // 1-36 + 0
    }
    
    if (colorBet === 'red' || colorBet === 'black') {
      winningNumbers = 18;
      colorName = colorBet.charAt(0).toUpperCase() + colorBet.slice(1);
      emoji = colorBet === 'red' ? '🔴' : '⚫';
    } else if (colorBet === 'green') {
      winningNumbers = rouletteType === 'american' ? 2 : 1;
      colorName = "Green (0/00)";
      emoji = '🟢';
    }
    
    const probability = winningNumbers / totalNumbers;
    const percent = (probability * 100).toFixed(2);
    
    // Generate a “prediction” — with maximum sarcasm
    const predictions = [
      ` “Prediction”: Bet it all on ${colorName}! What’s the worst that could happen? (Spoiler: bankruptcy.)`,
      ` “Insider Tip”: Sell one kidney. Odds are better than roulette.`,
      ` “Pro Strategy”: Just set your money on fire. More predictable outcome.`,
      ` “Better Idea”: Invest in a math textbook. ROI > roulette. Guaranteed.`,
      ` “Reality Check”: Your kid’s college fund will thank you… if you DON’T use it here.`,
      ` "Tips": Casino is best serve with cold beer.`
    ];
    
    const randomPrediction = predictions[Math.floor(Math.random() * predictions.length)];
    
    showResult(
      'result-roulette',
      `
            <div class="emoji">${emoji}</div>
            <div class="main-result">You chose: ${colorName}</div>
            <div class="detail">🎯 Probability: ${winningNumbers}/${totalNumbers} = ${percent}%</div>
            <div class="detail">🏛️ House Edge: ${rouletteType === 'american' ? '5.26%' : '2.70%'}</div>
            <div class="sass">${randomPrediction}</div>
          `,
      false
    );
    
  } catch (err) {
    showResult('result-roulette', `<strong>Syntax Error:</strong> ${err.message}`, true);
  }
}