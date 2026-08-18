import { Button } from "@/components/ui/button";

type CancelButtonProps = {
  onClick: () => void;
};

export function CancelButton({ onClick }: CancelButtonProps) {
  return (
    <Button
      type="button"
      onClick={onClick}
      className="w-full"
      variant={"destructive"}
    >
      Cancel
    </Button>
  );
}
