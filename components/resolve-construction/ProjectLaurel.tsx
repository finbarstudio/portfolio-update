import { LAUREL_PATH } from "@/components/resolve-construction/laurelPath";

/** Small static laurel (filled) with an optional inner mark. */
export default function ProjectLaurel({
  mark,
  className = "",
  fill = "white",
}: {
  mark?: string;
  className?: string;
  fill?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 90 73.04"
        className="w-full h-auto"
      >
        <path d={LAUREL_PATH} fill={fill} />
      </svg>
      {mark && (
        <span
          className="absolute inset-0 flex items-center justify-center violet text-[11px] pt-0.5"
          style={{ color: fill }}
        >
          {mark}
        </span>
      )}
    </div>
  );
}
