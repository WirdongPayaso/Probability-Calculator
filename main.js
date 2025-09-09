function pulseSection(buttonSelector) {
  const section = document.querySelector(buttonSelector).closest('.calculator-section');
  section.classList.add('active');
  setTimeout(() => section.classList.remove('active'), 800);
}

function disableButtonTemporarily(buttonSelector, ms = 600) {
  const btn = document.querySelector(buttonSelector);
  btn.disabled = true;
  btn.style.opacity = "0.7";
  setTimeout(() => {
    btn.disabled = false;
    btn.style.opacity = "1";
  }, ms);
}

function validateNumberInput(elementId, label = "Input") {
  const value = document.getElementById(elementId).value.trim();
  if (value === "") {
    throw new Error(`${label} is empty. Please enter a number.`);
  }
  const num = parseFloat(value);
  if (isNaN(num)) {
    throw new Error(`${label} is not a valid number. Got: "${value}"`);
  }
  return num;
}


function showResult(boxId, text, isError = false) {
  const box = document.getElementById(boxId);
  box.innerHTML = text;
  box.className = 'result-box updated ' + (isError ? 'error' : 'success');
  
  
  setTimeout(() => {
    box.classList.remove('updated');
  }, 500);
}


function isValidProbability(p) {
  return p >= 0 && p <= 1;
}


function calcSingle() {
  pulseSection('[onclick="calcSingle()"]');
  disableButtonTemporarily('[onclick="calcSingle()"]');
  
  try {
    const f = validateNumberInput('favorable', 'Favorable Outcomes');
    const t = validateNumberInput('total', 'Total Outcomes');
    
    if (t <= 0) {
      throw new Error("Total Outcomes must be greater than 0.");
    }
    
    if (f < 0 || f > t) {
      throw new Error("Favorable Outcomes must be between 0 and Total Outcomes.");
    }
    
    const p = f / t;
    showResult('result-single', `P(A) = ${f} / ${t} = <strong>${p.toFixed(4)}</strong>`);
  } catch (err) {
    showResult('result-single', `<strong>Syntax Error:</strong> ${err.message}`, true);
  }
}

function calcComplement() {
  pulseSection('[onclick="calcComplement()"]');
  disableButtonTemporarily('[onclick="calcComplement()"]');
  
  try {
    const pA = validateNumberInput('p_a', 'P(A)');
    
    if (!isValidProbability(pA)) {
      throw new Error("P(A) must be between 0 and 1 (inclusive).");
    }
    
    const pNotA = 1 - pA;
    showResult('result-complement', `P(not A) = 1 - ${pA} = <strong>${pNotA.toFixed(4)}</strong>`);
  } catch (err) {
    showResult('result-complement', `<strong>Syntax Error:</strong> ${err.message}`, true);
  }
}

function calcAnd() {
  pulseSection('[onclick="calcAnd()"]');
  disableButtonTemporarily('[onclick="calcAnd()"]');
  
  try {
    const pA = validateNumberInput('p_a_and', 'P(A)');
    const pB = validateNumberInput('p_b_and', 'P(B)');
    
    if (!isValidProbability(pA)) throw new Error("P(A) must be between 0 and 1.");
    if (!isValidProbability(pB)) throw new Error("P(B) must be between 0 and 1.");
    
    const pAB = pA * pB;
    showResult('result-and', `P(A and B) = ${pA} × ${pB} = <strong>${pAB.toFixed(4)}</strong>`);
  } catch (err) {
    showResult('result-and', `<strong>Syntax Error:</strong> ${err.message}`, true);
  }
}

function calcOr() {
  pulseSection('[onclick="calcOr()"]');
  disableButtonTemporarily('[onclick="calcOr()"]');
  
  try {
    const pA = validateNumberInput('p_a_or', 'P(A)');
    const pB = validateNumberInput('p_b_or', 'P(B)');
    const pAB = validateNumberInput('p_a_and_b', 'P(A and B)');
    
    if (!isValidProbability(pA)) throw new Error("P(A) must be between 0 and 1.");
    if (!isValidProbability(pB)) throw new Error("P(B) must be between 0 and 1.");
    if (!isValidProbability(pAB)) throw new Error("P(A and B) must be between 0 and 1.");
    
    if (pAB > Math.min(pA, pB)) {
      throw new Error("P(A and B) cannot be greater than P(A) or P(B). That’s logically impossible.");
    }
    
    const pAorB = pA + pB - pAB;
    if (pAorB < 0 || pAorB > 1) {
      throw new Error(`Resulting P(A or B) = ${pAorB.toFixed(4)} is invalid. Must be in [0,1]. Check inputs.`);
    }
    
    showResult(
      'result-or',
      `P(A or B) = ${pA} + ${pB} - ${pAB} = <strong>${pAorB.toFixed(4)}</strong>`
    );
  } catch (err) {
    showResult('result-or', `<strong>Syntax Error:</strong> ${err.message}`, true);
  }
}

function clearSection(boxId) {
  const box = document.getElementById(boxId);
  
  box.style.opacity = '0';
  box.style.transform = 'translateY(-5px)';
  setTimeout(() => {
    box.innerHTML = '';
    box.className = 'result-box';
    box.style.opacity = '1';
    box.style.transform = 'translateY(0)';
  }, 200);
}