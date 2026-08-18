import type { ButtonHTMLAttributes } from 'react';

type KeyButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  variant?: 'default' | 'primary';
};

export function KeyButton({
  active = false,
  className = '',
  variant = 'default',
  ...props
}: KeyButtonProps) {
  return (
    <button
      className={`key-button ${className}`.trim()}
      data-active={active || undefined}
      data-variant={variant}
      type="button"
      {...props}
    />
  );
}
