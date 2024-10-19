export default function XIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`fill-current text-foreground ${className}`}
    >
      <path d="M27.616 20.938L41.76 4H38.408L26.124 18.706L16.316 4H5L19.836 26.24L5 44H8.352L21.324 28.47L31.684 44H43L27.616 20.938ZM23.024 26.434L21.52 24.22L9.56 6.6H14.71L24.362 20.82L25.864 23.034L38.41 41.518H33.262L23.024 26.434Z" />
    </svg>
  );
}
