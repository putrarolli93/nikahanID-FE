// components/ui/Button.jsx
export const Button = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  disabled = false,
  className = '' 
}) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-outline',
    ghost: 'btn-ghost',
    solid: 'btn-solid',
    price: 'btn-price',
    'price-solid': 'btn-price solid',
  };

  return (
    <button
      className={`${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};