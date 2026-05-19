// Mac-Classic style window chrome, pinstripe title bar, faux close/zoom
// buttons, sharp 1px border + pixel offset shadow. Pure decoration.
// On mobile (<md) the chrome collapses via globals.css media query so
// content can use the full viewport width.

export default function OSWindow({
  title,
  children,
  className = "",
  bodyClassName = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <div className={`os-window ${className}`}>
      <div className="os-titlebar hidden md:flex">
        <span className="os-titlebar-btn" aria-hidden="true" />
        <span className="os-titlebar-title">{title}</span>
        <span className="os-titlebar-btn" aria-hidden="true" />
      </div>
      <div className={`relative ${bodyClassName}`}>{children}</div>
    </div>
  );
}
