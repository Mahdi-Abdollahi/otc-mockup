import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

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
    <Button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full"
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {loading ? "Confirming…" : "Confirm"}
    </Button>
  );
}
