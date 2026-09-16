import Image from "next/image";

const artwork = "/images/brand/magicbook-original.webp";

/** Preserve the supplied artwork; compact layout crops it only in CSS. */
export default function BrandLogo({ full = false }) {
  if (full) {
    return (
      <Image
        className="magicbook-full-logo"
        src={artwork}
        width={1254}
        height={1254}
        sizes="240px"
        alt="MagicBook — персонализированные сказки для особенных детей"
      />
    );
  }
  return (
    <span className="magicbook-compact-logo" aria-hidden="true">
      <span className="magicbook-emblem">
        <Image src={artwork} alt="" width={1254} height={1254} sizes="96px" priority />
      </span>
      <span className="magicbook-lettering">
        <Image src={artwork} alt="" width={1254} height={1254} sizes="180px" priority />
      </span>
    </span>
  );
}
