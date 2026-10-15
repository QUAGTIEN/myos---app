import Image from 'next/image';

export function BrandMark() {
  return <span className="brand-lockup">
    <span className="brand-symbol"><Image src="/images/brand/sunflower-logo.png" alt="" width={72} height={72} /></span>
    <span className="wordmark"><span>SUNFLOWER<span className="wordmark-dot" aria-hidden="true">.</span></span><small>TEM NHÃN · BAO BÌ · VẬT TƯ IN</small></span>
  </span>;
}
