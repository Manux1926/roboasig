/* roboasig.online — date de calcul. Actualizat: 19 noiembrie 2026.
   Toate valorile sunt orientative. Surse în metodologie.html. */
const DATA = {
  actualizat: "19 noiembrie 2026",

  // RCA: tarife de referință ASF, mai 2026, autoturisme (lei/an). NU sunt prețuri de piață.
  rca: {
    benzi: [50, 75, 100, 125, 150, 200, 300, Infinity], // limita superioară kW
    etichete: ["≤50 kW", "51–75 kW", "76–100 kW", "101–125 kW", "126–150 kW", "151–200 kW", "201–300 kW", ">300 kW"],
    zone: {
      bif: {
        pj:  [2156, 2490, 2206, 2150, 2196, 2756, 2689, 2695],
        le30:[3974, 4199, 4760, 4281, 4258, 5325, 5186, 4956],
        a31: [2205, 2486, 2666, 2877, 3029, 4030, 4047, 3821],
        a41: [2232, 2425, 2695, 2899, 3057, 4088, 4035, 3793],
        a51: [2143, 2319, 2566, 2796, 2974, 3941, 3855, 3676],
        a61: [2215, 2417, 2693, 2959, 3088, 4077, 4186, 3978]
      },
      rest: {
        pj:  [1476, 1719, 1495, 1499, 1569, 1825, 1925, 1868],
        le30:[2361, 2571, 2896, 3055, 3254, 4344, 4163, 3998],
        a31: [1356, 1469, 1634, 1739, 1835, 2456, 2389, 2266],
        a41: [1368, 1481, 1642, 1760, 1860, 2493, 2438, 2344],
        a51: [1283, 1420, 1584, 1686, 1812, 2382, 2352, 2249],
        a61: [1359, 1471, 1665, 1758, 1891, 2500, 2499, 2416]
      }
    },
    varste: { le30: "până în 30 de ani", a31: "31–40 de ani", a41: "41–50 de ani", a51: "51–60 de ani", a61: "peste 60 de ani" },
    // Bonus-malus: aproximare a efectului asupra primei (procente orientative).
    bm: { B8:-50, B7:-40, B6:-30, B5:-25, B4:-20, B3:-15, B2:-10, B1:-5, B0:0,
          M1:10, M2:20, M3:30, M4:40, M5:50, M6:60, M7:70, M8:80 }
  },

  // Impozit auto 2026: Cod fiscal art. 470, lei pe fiecare 200 cmc sau fracțiune.
  impozit: {
    praguri: [1600, 2000, 2600, 3000, Infinity],
    // coloane: non-euro/E0-E3, E4, E5, E6, hibrid >50 g CO2/km
    tarife: [
      [19.5, 18.8, 17.6, 16.5, 16.2],
      [29.7, 28.5, 26.7, 25.1, 24.6],
      [92.2, 88.6, 82.8, 77.8, 76.3],
      [182.9, 172.8, 154.1, 151.2, 149.8],
      [319.0, 297.3, 294.4, 290.0, 275.5]
    ],
    electric: 40
  },

  // Rovinietă autoturisme, 12 luni, de la 1 oct. 2026 (Ordinul MTI 888/2026), lei.
  rovinieta: { electric: 228, e6: 254, e45: 292, e3: 330 },

  // ITP: preț liber la stațiile RAR; interval tipic 150–250 lei.
  itp: { min: 150, max: 250 },

  // CASCO: nu există tarife publice; procent orientativ din valoarea mașinii.
  casco: { min: 0.025, max: 0.06 }
};
if (typeof module !== "undefined") module.exports = DATA;
