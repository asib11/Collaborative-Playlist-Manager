import React from "react";
import { formatVotes } from "../../utils/formatSeconds";

/**
 * Vote buttons component for playlist items
 * @param {number} votes - Current vote count
 * @param {Function} onUpvote - Upvote callback
 * @param {Function} onDownvote - Downvote callback
 */
const VoteButtons = ({ votes, onUpvote, onDownvote }) => {
  return (
    <div className="flex flex-col items-center gap-1">
      {/* Upvote Button */}
      <button
        onClick={onUpvote}
        className="text-gray-400 hover:text-green-600 transition-colors p-1"
        title="Upvote"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Vote Count */}
      <span
        className={`text-sm font-semibold min-w-[2rem] text-center ${
          votes > 0
            ? "text-green-600"
            : votes < 0
            ? "text-red-600"
            : "text-gray-600"
        }`}
      >
        {formatVotes(votes)}
      </span>

      {/* Downvote Button */}
      <button
        onClick={onDownvote}
        className="text-gray-400 hover:text-red-600 transition-colors p-1"
        title="Downvote"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

export default VoteButtons;
