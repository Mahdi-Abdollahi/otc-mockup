import { Button } from "@/components/ui/button";

type ConfirmButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export function ConfirmButton({
  onClick,
  disabled,
  loading,
}: ConfirmButtonProps) {
  return (
    <Button onClick={onClick} disabled={disabled || loading} className="w-full">
      {loading ? "Confirming…" : "Confirm"}
    </Button>
  );
}
