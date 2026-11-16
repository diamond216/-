/** The hamster. */
export function BrandMark({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="10" cy="9" r="6" fill="#d8923a" />
      <circle cx="30" cy="9" r="6" fill="#d8923a" />
      <circle cx="10" cy="9" r="2.8" fill="#f6e3c3" />
      <circle cx="30" cy="9" r="2.8" fill="#f6e3c3" />
      <ellipse cx="20" cy="22" rx="17" ry="15.5" fill="#d8923a" />
      <ellipse cx="11" cy="27" rx="7" ry="6" fill="#f6e3c3" />
      <ellipse cx="29" cy="27" rx="7" ry="6" fill="#f6e3c3" />
      <circle cx="13.5" cy="19" r="2.1" fill="#25211c" />
      <circle cx="26.5" cy="19" r="2.1" fill="#25211c" />
      <ellipse cx="20" cy="24" rx="2" ry="1.4" fill="#25211c" />
    </svg>
  );
}
