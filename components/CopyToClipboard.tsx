import { ClipboardCopyIcon } from "@heroicons/react/outline";

const CopyToClipboard: React.FC = () => {
  return (
    <div
      className="flex space-x-2 btn btn-secondary btn-sm"
      onClick={() => {
        navigator.clipboard.writeText(window.location.href);
      }}
    >
      <p>copy and share</p>
      <ClipboardCopyIcon className="h-5 w-5" />
    </div>
  );
};

export default CopyToClipboard;
