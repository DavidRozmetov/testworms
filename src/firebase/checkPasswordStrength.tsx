export const checkPasswordStrength = (password: string): boolean => {
  const MIN_LENGTH = 8;

  let count = 0;

  if (password.length >= MIN_LENGTH) {
    count += 1;
  }
  if (/[A-Z]/.test(password)) {
    count += 1;
  }
  if (/[a-z]/.test(password)) {
    count += 1;
  }
  if (/[0-9]/.test(password)) {
    count += 1;
  }
  if (/[!@#$%^&*)(+=._-]/.test(password)) {
    count += 1;
  }

  return count >= 5;
};
