function Message({ text, senderName, timestamp, isSender }) {
    // This defines the core styles for color and alignment
    const messageClass = isSender
        ? 'bg-accent-green text-primary self-end rounded-br-none' // 'me' styling
        : 'bg-secondary text-text-primary self-start rounded-bl-none'; // 'you' styling

    // This defines the timestamp color
    const timestampClass = isSender ? 'text-green-200' : 'text-text-secondary';

    return (
        <div
          // This combines the base styles with our conditional ones
          className={`max-w-xs md:max-w-md w-fit rounded-xl p-3 shadow-md flex flex-col ${messageClass}`}
        >
          {/* Main message text */}
          <p className="text-base break-words">
            {text}
          </p>

          {/* Timestamp and Sender */}
          <p className={`text-xs mt-1 text-right ${timestampClass}`}>
            {senderName} - {timestamp}
          </p>
        </div>
      );
}

export default Message;