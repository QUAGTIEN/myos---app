// Original vector product illustration. Not a product specification or packshot.
// Static composition for pass 1; scroll choreography is reserved for pass 2.
export function HeroLabelSculpture() {
  return <figure className="hero-sculpture">
    <svg viewBox="0 0 720 620" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="hero-roll-paper" x1="205" y1="230" x2="540" y2="385" gradientUnits="userSpaceOnUse"><stop stopColor="var(--surface-warm)" /><stop offset=".43" stopColor="var(--on-dark)" /><stop offset="1" stopColor="var(--hero-paper-edge)" /></linearGradient>
        <linearGradient id="hero-roll-face" x1="260" y1="120" x2="460" y2="295" gradientUnits="userSpaceOnUse"><stop stopColor="var(--on-dark)" /><stop offset="1" stopColor="var(--surface-warm)" /></linearGradient>
        <linearGradient id="hero-roll-core" x1="353" y1="170" x2="409" y2="249" gradientUnits="userSpaceOnUse"><stop stopColor="var(--brand-navy-deep)" /><stop offset="1" stopColor="var(--brand-blue-soft)" /></linearGradient>
        <linearGradient id="hero-label-stock" x1="284" y1="350" x2="584" y2="571" gradientUnits="userSpaceOnUse"><stop stopColor="var(--on-dark)" /><stop offset="1" stopColor="var(--surface-warm)" /></linearGradient>
        <linearGradient id="hero-label-ink" x1="230" y1="370" x2="582" y2="532" gradientUnits="userSpaceOnUse"><stop stopColor="var(--brand-blue)" /><stop offset="1" stopColor="var(--brand-navy-deep)" /></linearGradient>
        <radialGradient id="hero-contact-shadow"><stop stopColor="var(--brand-navy-deep)" stopOpacity=".28" /><stop offset="1" stopColor="var(--brand-navy-deep)" stopOpacity="0" /></radialGradient>
      </defs>
      <ellipse cx="377" cy="499" rx="297" ry="74" fill="url(#hero-contact-shadow)" />
      <g className="hero-roll-geometry" transform="rotate(-16 367 294)">
        <path d="M173 217C173 157 260 109 368 109C476 109 563 157 563 217V337C563 397 476 445 368 445C260 445 173 397 173 337V217Z" fill="url(#hero-roll-paper)" />
        {Array.from({ length: 19 }, (_, i) => <path key={i} d={`M174 ${225 + i * 6}C192 ${359 + i * 6} 541 ${359 + i * 6} 562 ${225 + i * 6}`} stroke="var(--hero-paper-line)" strokeWidth=".8" opacity=".65" />)}
        <ellipse cx="368" cy="217" rx="195" ry="108" fill="url(#hero-roll-face)" stroke="var(--hero-paper-edge)" strokeWidth="2" />
        {[184, 174, 164, 154, 144, 134, 124].map(r => <ellipse key={r} cx="368" cy="217" rx={r} ry={r * .554} stroke="var(--hero-paper-line)" strokeWidth=".65" opacity=".55" />)}
        <ellipse cx="368" cy="217" rx="69" ry="39" fill="var(--hero-core-rim)" />
        <ellipse cx="368" cy="219" rx="59" ry="32" fill="url(#hero-roll-core)" />
        <path d="M310 221C322 195 405 195 426 222" stroke="var(--brand-navy-deep)" strokeWidth="6" />
        <ellipse cx="368" cy="217" rx="194" ry="107" stroke="var(--on-dark)" strokeWidth="3" />
      </g>
      <g className="hero-ribbon-geometry">
        <path d="M200 345C219 412 259 434 322 447L634 516L532 589L233 512C164 495 152 463 166 426L200 345Z" fill="var(--hero-paper-edge)" />
        <path d="M200 338C221 397 266 417 328 430L642 505L532 577L237 501C170 484 157 454 170 417L200 338Z" fill="url(#hero-label-stock)" />
        <path d="M224 376C246 402 281 412 326 423L391 439L328 483L245 462C207 452 194 435 196 415L224 376Z" fill="url(#hero-label-ink)" />
        <path d="M410 443L501 465L435 510L345 487L410 443Z" fill="var(--action-accent)" />
        <path d="M517 468L607 490L532 541L452 519L517 468Z" fill="url(#hero-label-ink)" />
        <g stroke="var(--on-dark)" strokeWidth="2" opacity=".8"><path d="M248 415L304 431M242 424L288 437M236 433L271 443" /><path d="M513 493L554 504M504 500L546 511M495 507L537 519" /></g>
        <path d="M420 461L468 473L441 491L393 479L420 461Z" stroke="var(--brand-navy-deep)" strokeWidth="2" />
        <path d="M329 434L262 479M505 475L442 516" stroke="var(--hero-paper-line)" strokeDasharray="3 5" />
      </g>
    </svg>
    <figcaption><span className="hero-material-dot" aria-hidden="true" />Tem cuộn / Minh họa sản phẩm</figcaption>
  </figure>;
}
