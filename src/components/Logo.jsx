const Logo = ({ size = 40, showText = false, textSize = 'text-xl', textColor = 'text-gray-800' }) => {
  return (
    <div className="flex items-center space-x-2">
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* SPEED LINES (Fast Delivery) */}
        <rect x="72" y="8" width="14" height="3" fill="#f97316" rx="1.5" />
        <rect x="78" y="15" width="10" height="3" fill="#f97316" rx="1.5" />
        <rect x="82" y="22" width="6" height="3" fill="#f97316" rx="1.5" />

        {/* SHIELD SHAPE (Security) */}
        <path 
          d="M 50 10 
             L 18 22 
             L 18 50 
             Q 18 75 50 92 
             Q 82 75 82 50 
             L 82 22 Z" 
          fill="#dc2626"
          stroke="#1f2937"
          strokeWidth="3"
        />

        {/* PLATE (Eating) */}
        <circle cx="50" cy="48" r="20" fill="#ffffff" stroke="#1f2937" strokeWidth="2" />
        
        {/* PLATE INNER RING */}
        <circle cx="50" cy="48" r="15" fill="none" stroke="#f97316" strokeWidth="2" />

        {/* FORK (Hygiene) */}
        <rect x="40" y="40" width="2" height="16" fill="#1f2937" rx="1" />
        <rect x="38" y="40" width="2" height="6" fill="#1f2937" rx="1" />
        <rect x="42" y="40" width="2" height="6" fill="#1f2937" rx="1" />

        {/* KNIFE (Hygiene) */}
        <rect x="58" y="40" width="2" height="16" fill="#1f2937" rx="1" />
        <polygon points="56,40 62,40 60,46" fill="#1f2937" />

        {/* CHECKMARK (Quality) */}
        <path 
          d="M 42 75 L 47 80 L 58 70" 
          fill="none" 
          stroke="#ffffff" 
          strokeWidth="3" 
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      
      {showText && (
        <span className={`${textSize} font-bold ${textColor}`}>
          Quick<span className="text-orange-500">Bite</span>
        </span>
      )}
    </div>
  );
};

export default Logo;