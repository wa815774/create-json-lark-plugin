export const TipIcon = ({ className = "", ...props }: any) => (
    <svg
        className={`cursor ${className}`}
        viewBox="64 64 896 896"
        focusable="false"
        data-icon="info-circle"
        width="1em"
        height="1em"
        fill="currentColor"
        aria-hidden="true"
        {...props}
    >
        <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
        <path d="M464 336a48 48 0 1096 0 48 48 0 10-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z"></path>
    </svg>
);

export const CopyIcon = ({ className = "", ...props }: any) => (
    <svg
        className={`cursor ${className}`}
        width="1em"
        height="1em"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            d="M13 12.4316V7.8125C13 6.2592 14.2592 5 15.8125 5H40.1875C41.7408 5 43 6.2592 43 7.8125V32.1875C43 33.7408 41.7408 35 40.1875 35H35.5163"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M32.1875 13H7.8125C6.2592 13 5 14.2592 5 15.8125V40.1875C5 41.7408 6.2592 43 7.8125 43H32.1875C33.7408 43 35 41.7408 35 40.1875V15.8125C35 14.2592 33.7408 13 32.1875 13Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinejoin="round"
        />
    </svg>
);

export const DownloadIcon = ({ className = "", ...props }: any) => (
    <svg
        className={`cursor ${className}`}
        width="1em"
        height="1em"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            d="M5 8C5 6.89543 5.89543 6 7 6H19L24 12H41C42.1046 12 43 12.8954 43 14V40C43 41.1046 42.1046 42 41 42H7C5.89543 42 5 41.1046 5 40V8Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinejoin="round"
        />
        <path
            d="M30 28L23.9933 34L18 28.0134"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M24 20V34"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);
