type RestartLoginButtonProps = {
  onRestart: () => void;
};

export function RestartLoginButton({ onRestart }: RestartLoginButtonProps) {
  return (
    <div className="flex justify-center">
      <button
        type="button"
        onClick={onRestart}
        className="text-sm font-medium text-red-700 transition-colors hover:text-red-900"
      >
        Zacznij od nowa
      </button>
    </div>
  );
}
