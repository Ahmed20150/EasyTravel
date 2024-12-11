const ShareModal = ({ isOpen, onClose, title, url }) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      alert('Link copied to clipboard!');
      onClose();
    });
  };

  const handleEmailShare = () => {
    const subject = `Check out this ${title}!`;
    const body = `I found this ${title} that you might like: ${url}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-primary mb-4">Share {title}</h2>
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={url}
              className="flex-1 p-2 rounded border border-border"
            />
            <button 
              onClick={handleCopyLink}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              Copy
            </button>
          </div>
          <button 
            onClick={handleEmailShare}
            className="w-full px-4 py-2 bg-accent text-primary rounded hover:bg-accent/90"
          >
            Share via Email
          </button>
          <button 
            onClick={onClose}
            className="w-full px-4 py-2 bg-muted text-primary rounded hover:bg-muted/90"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;