export const validarSenhaForte = (password: string): string | null => {
  if (password.length < 8) return "Mínimo 8 caracteres";
  if (!/[a-z]/.test(password)) return "Inclua letra minúscula";
  if (!/[A-Z]/.test(password)) return "Inclua letra maiúscula";
  if (!/\d/.test(password)) return "Inclua número";
  if (!/[^\w\s]/.test(password)) return "Inclua caractere especial";
  return null;
};
