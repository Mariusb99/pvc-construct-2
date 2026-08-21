"use client";

export function ConfirmButton({
  action,
  confirmMessage,
  children,
  className,
}: {
  action: () => Promise<void>;
  confirmMessage: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <form
      action={async () => {
        if (window.confirm(confirmMessage)) {
          await action();
        }
      }}
    >
      <button type="submit" className={className}>
        {children}
      </button>
    </form>
  );
}
