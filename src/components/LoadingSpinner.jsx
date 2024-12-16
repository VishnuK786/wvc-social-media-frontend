import { ThreeDots } from 'react-loader-spinner';

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
      <ThreeDots
        height="80"
        width="80"
        radius="9"
        color="#f97316"
        ariaLabel="loading"
      />
      <p className="mt-4 text-white text-lg font-semibold">
        Please wait, your request is in progress...
      </p>
    </div>
  );
}