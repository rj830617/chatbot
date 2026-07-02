// Validation utilities
export const validators = {
  email: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },

  required: (value: string): boolean => {
    return value.trim().length > 0;
  },

  minLength: (value: string, min: number): boolean => {
    return value.length >= min;
  },

  maxLength: (value: string, max: number): boolean => {
    return value.length <= max;
  },

  otp: (value: string): boolean => {
    return /^\d{5}$/.test(value);
  },
};

export const validateField = (
  value: string,
  rules: Array<{ type: keyof typeof validators; param?: number; message: string }>
): string | null => {
  for (const rule of rules) {
    const validator = validators[rule.type] as any;
    const isValid = rule.param !== undefined
      ? validator(value, rule.param)
      : validator(value);

    if (!isValid) {
      return rule.message;
    }
  }
  return null;
};