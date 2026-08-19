function onlyDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

function isValidCPF(rawValue) {
  const cpf = onlyDigits(rawValue);

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  const calcDigit = (base) => {
    let sum = 0;
    for (let i = 0; i < base.length; i++) {
      sum += Number(base[i]) * (base.length + 1 - i);
    }
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  const digit1 = calcDigit(cpf.slice(0, 9));
  const digit2 = calcDigit(cpf.slice(0, 9) + digit1);

  return cpf === cpf.slice(0, 9) + String(digit1) + String(digit2);
}

function isValidCNPJ(rawValue) {
  const cnpj = onlyDigits(rawValue);

  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) {
    return false;
  }

  const calcDigit = (base) => {
    const weights =
      base.length === 12
        ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    let sum = 0;
    for (let i = 0; i < base.length; i++) {
      sum += Number(base[i]) * weights[i];
    }
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  const digit1 = calcDigit(cnpj.slice(0, 12));
  const digit2 = calcDigit(cnpj.slice(0, 12) + digit1);

  return cnpj === cnpj.slice(0, 12) + String(digit1) + String(digit2);
}

module.exports = {
  onlyDigits,
  isValidCPF,
  isValidCNPJ,
};
