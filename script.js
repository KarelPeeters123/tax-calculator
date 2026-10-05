document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("tax-form");
  const salaryInput = document.getElementById("salary");
  const taxStandard = document.getElementById("tax-standard");
  const taxGreens = document.getElementById("tax-greens");
  const taxTpm = document.getElementById("tax-tpm");
  const taxAlliance = document.getElementById("tax-alliance");
  const taxTop = document.getElementById("tax-top");

  const taxCells = [
    { element: taxStandard, key: "standard" },
    { element: taxGreens, key: "greens" },
    { element: taxTpm, key: "tpm" },
    { element: taxAlliance, key: "alliance" },
    { element: taxTop, key: "top" },
  ];

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const salary = Number(salaryInput.value);

    if (Number.isNaN(salary) || salary < 0) {
      taxCells.forEach(({ element }) => {
        element.textContent = formatCurrency(0);
        element.classList.remove("highest-tax", "lowest-tax");
      });
      return;
    }

    const tax = calculateYearlyTax(salary);

    taxCells.forEach(({ element, key }) => {
      element.textContent = formatCurrency(tax[key]);
      element.classList.remove("highest-tax", "lowest-tax");
    });

    const values = taxCells.map(({ key }) => tax[key]);
    const highest = Math.max(...values);
    const lowest = Math.min(...values);

    taxCells.forEach(({ element, key }) => {
      if (tax[key] === highest) {
        element.classList.add("highest-tax");
      }
      if (tax[key] === lowest) {
        element.classList.add("lowest-tax");
      }
    });
  });
});

const taxBrackets = [
  { threshold: 180001, rate: 0.39 },
  { threshold: 78001, rate: 0.33 },
  { threshold: 53501, rate: 0.30 },
  { threshold: 15601, rate: 0.175 },
  { threshold: 0, rate: 0.105 },
];

const taxBracketsGreens = [
  { threshold: 160000, rate: 0.45 },
  { threshold: 80000, rate: 0.335 },
  { threshold: 60000, rate: 0.305 },
  { threshold: 40000, rate: 0.255 },
  { threshold: 20000, rate: 0.175 },
  { threshold: 10000, rate: 0.10 },
  { threshold: 0, rate: 0 },
];

const taxBracketsTPM = [
  { threshold: 300001, rate: 0.48 },
  { threshold: 180001, rate: 0.42 },
  { threshold: 90001, rate: 0.39 },
  { threshold: 60001, rate: 0.33 },
  { threshold: 30001, rate: 0.15 },
  { threshold: 0, rate: 0 },
];

const taxBracketsAlliance = [
  { threshold: 250000, rate: 0.47 },
  { threshold: 150000, rate: 0.39 },
  { threshold: 78100, rate: 0.34 },
  { threshold: 53500, rate: 0.30 },
  { threshold: 20000, rate: 0.175 },
  { threshold: 0, rate: 0 },
];

const taxBracketsTOP = [
  { threshold: 200000, rate: 0.39 },
  { threshold: 50000, rate: 0.34 },
  { threshold: 0, rate: 0.28 },
];

function calculateYearlyTax(salary) {
  return {
    standard: taxBracketsRecursive(salary, taxBrackets),
    greens: taxBracketsRecursive(salary, taxBracketsGreens),
    tpm: taxBracketsRecursive(salary, taxBracketsTPM),
    alliance: taxBracketsRecursive(salary, taxBracketsAlliance),
    top: taxBracketsRecursive(salary, taxBracketsTOP),
  };
}
function taxBracketsRecursive(salary, brackets = taxBrackets, index = 0, tax = 0) {
  if (index >= brackets.length || salary <= 0) {
    return tax;
  }

  const { threshold, rate } = brackets[index];
  if (salary > threshold) {
    tax += (salary - threshold) * rate;
    salary = threshold;
  }

  return taxBracketsRecursive(salary, brackets, index + 1, tax);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NZD",
  }).format(value);
}
