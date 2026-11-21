/* roboasig.online — funcții de calcul (fără date personale, totul rulează în browser). */
(function (root) {
  const D = (typeof DATA !== "undefined") ? DATA : require("./data.js");

  function bandaKw(kw) {
    const b = D.rca.benzi;
    for (let i = 0; i < b.length; i++) if (kw <= b[i]) return i;
    return b.length - 1;
  }

  // in: {proprietar:'pf'|'pj', varsta:'le30'|..., zona:'bif'|'rest', kw, bm:'B0'}
  function zonaJudet(j) { return j === "B" || j === "IF" ? "bif" : "rest"; }

  function rca(o) {
    const i = bandaKw(o.kw);
    const cheie = o.proprietar === "pj" ? "pj" : o.varsta;
    const ref = D.rca.zone[o.zona || zonaJudet(o.judet)][cheie][i];
    const bm = D.rca.bm[o.bm || "B0"] || 0;
    const ajustat = Math.round(ref * (1 + bm / 100));
    return { ref, ajustat, min: Math.round(ajustat * 0.75), max: Math.round(ajustat * 1.25), banda: D.rca.etichete[i] };
  }

  function coloanaEuro(euro) {
    return { e3: 0, e4: 1, e5: 2, e6: 3, hibrid: 4 }[euro];
  }

  // in: {cmc, euro:'e3'|'e4'|'e5'|'e6'|'hibrid'|'electric', majorare: procent | null}
  function impozit(o) {
    if (o.euro === "electric") return { baza: D.impozit.electric, min: D.impozit.electric, max: D.impozit.electric };
    const p = D.impozit.praguri;
    let r = 0;
    while (o.cmc > p[r]) r++;
    const fractiuni = Math.ceil(o.cmc / 200);
    const baza = Math.round(fractiuni * D.impozit.tarife[r][coloanaEuro(o.euro)]);
    if (o.judet) {
      const j = D.judete.find(x => x[0] === o.judet);
      let m = j ? j[3] : null;
      if (m && typeof m === "object" && !Array.isArray(m)) m = m.n ? m.n[o.euro] : m.b[r];
      const brut = fractiuni * D.impozit.tarife[r][coloanaEuro(o.euro)];
      if (Array.isArray(m)) return { baza, min: Math.round(brut * (1 + m[0] / 100)), max: Math.round(brut * (1 + m[1] / 100)), judet: j, cunoscut: false };
      if (m === null || m === undefined) return { baza, min: baza, max: Math.round(brut * 1.5), judet: j, cunoscut: false };
      const v = Math.round(brut * (1 + m / 100));
      return { baza, min: v, max: v, majorare: m, judet: j, cunoscut: true };
    }
    if (o.majorare === null || o.majorare === undefined) return { baza, min: baza, max: Math.round(baza * 1.5) };
    const v = Math.round(baza * (1 + o.majorare / 100));
    return { baza, min: v, max: v };
  }

  function rovinieta(euro) {
    const r = D.rovinieta;
    if (euro === "electric") return r.electric;
    if (euro === "e6" || euro === "hibrid") return r.e6;
    if (euro === "e4" || euro === "e5") return r.e45;
    return r.e3;
  }

  // costul ITP repartizat pe an, după vechime
  function itp(vechime) {
    if (vechime < 3) return { min: 0, max: 0, nota: "Primul ITP se face la 3 ani de la prima înmatriculare." };
    const fact = vechime > 12 ? 1 : 0.5;
    return { min: Math.round(D.itp.min * fact), max: Math.round(D.itp.max * fact),
      nota: vechime > 12 ? "Peste 12 ani: ITP în fiecare an." : "Între 3 și 12 ani: ITP o dată la 2 ani (costul e împărțit pe an)." };
  }

  function casco(valoareLei) {
    if (!valoareLei || valoareLei <= 0) return { min: 0, max: 0 };
    return { min: Math.round(valoareLei * D.casco.min), max: Math.round(valoareLei * D.casco.max) };
  }

  function total(o) {
    const r = rca(o), i = impozit(o), rv = rovinieta(o.euro), t = itp(o.vechime);
    const c = o.cuCasco ? casco(o.valoare) : { min: 0, max: 0 };
    return {
      rca: r, impozit: i, rovinieta: rv, itp: t, casco: c,
      min: r.min + i.min + rv + t.min + c.min,
      max: r.max + i.max + rv + t.max + c.max,
      central: r.ajustat + Math.round((i.min + i.max) / 2) + rv + Math.round((t.min + t.max) / 2) + Math.round((c.min + c.max) / 2)
    };
  }

  const API = { bandaKw, zonaJudet, rca, impozit, rovinieta, itp, casco, total };
  if (typeof module !== "undefined") module.exports = API; else root.Calc = API;
})(this);
