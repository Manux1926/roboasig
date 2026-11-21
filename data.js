/* roboasig.online — date de calcul. Actualizat: 21 noiembrie 2026.
   Toate valorile sunt orientative. Surse în metodologie.html. */
const DATA = {
  actualizat: "21 noiembrie 2026",

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
  casco: { min: 0.025, max: 0.06 },

  // Județe: zona RCA (ASF are doar 2 zone) + majorarea impozitului auto 2026 în reședința de județ.
  // m: procent fix | {n:{e3,e4,e5,e6,hibrid}} pe normă | {b:[≤1600,1601-2000,2001-2600,2601-3000,>3000]} pe capacitate.
  // [min,max] = interval cunoscut; null într-o bandă sau m:null = nu am putut verifica (afișăm interval 0–50%).
  // Surse: HCL-urile 2026 ale fiecărui municipiu (inclusiv modificările după OUG 9/2026). Verificat 21.11.2026.
  judete: [
    ["AB","Alba","Alba Iulia",0,"HCL 403/2025"],
    ["AR","Arad","Arad",{b:[0,42.3,29.2,null,null]},"HCL 822/2025 (tabel propriu)"],
    ["AG","Argeș","Pitești",0,"HCL 180/2025 mod. HCL 625/2025"],
    ["BC","Bacău","Bacău",50,"HCL 553/2025"],
    ["BH","Bihor","Oradea",{b:[0,20,20,20,20]},"HCL 854/2025"],
    ["BN","Bistrița-Năsăud","Bistrița",0,"HCL 302/2025"],
    ["BT","Botoșani","Botoșani",{b:[0,28,58,63,71]},"HCL 602/2025"],
    ["BR","Brăila","Brăila",0,"HCL 716/2025"],
    ["BV","Brașov","Brașov",{n:{e3:100,e4:75,e5:50,e6:35,hibrid:5}},"HCL 1142/2025 rep. HCL 120/2026"],
    ["B","București","București",0,"HCGMB 514/2025"],
    ["BZ","Buzău","Buzău",5,"HCL 244/2025 mod. HCL 34/2026"],
    ["CL","Călărași","Călărași",0,"HCL 241/2025"],
    ["CS","Caraș-Severin","Reșița",null,""],
    ["CJ","Cluj","Cluj-Napoca",0,"HCL 760/2025"],
    ["CT","Constanța","Constanța",10.4,"HCL 462/2025 (prima mașină; a doua +20%, de la a treia +50%)"],
    ["CV","Covasna","Sfântu Gheorghe",0,"HCL 557/2025 mod. HCL 75/2026"],
    ["DB","Dâmbovița","Târgoviște",0,"HCL 434/2025"],
    ["DJ","Dolj","Craiova",13,"HCL 496/2025"],
    ["GL","Galați","Galați",0,"HCL 416/2025 mod. HCL 670/2025"],
    ["GR","Giurgiu","Giurgiu",{b:[0,10,10,10,10]},"HCL 84/2025 mod. HCL 30/2026"],
    ["GJ","Gorj","Târgu Jiu",{b:[0,10,17,17,36]},"HCL 645/2025"],
    ["HR","Harghita","Miercurea Ciuc",0,"HCL 354/2025 mod. HCL 46/2026"],
    ["HD","Hunedoara","Deva",0,"HCL 549/2025"],
    ["IL","Ialomița","Slobozia",0,"HCL 454/2025"],
    ["IS","Iași","Iași",0,"HCL 507/2025"],
    ["IF","Ilfov","Buftea",0,"HCL 185/2025"],
    ["MM","Maramureș","Baia Mare",0,"HCL 576/2025"],
    ["MH","Mehedinți","Drobeta-Turnu Severin",0,"HCL 304/2025 mod. HCL 30/2026"],
    ["MS","Mureș","Târgu Mureș",0,"HCL 330/2025 mod. HCL 36/2026"],
    ["NT","Neamț","Piatra Neamț",0,"HCL 551/2025"],
    ["OT","Olt","Slatina",0,"HCL 559/2025 mod. HCL 63/2026"],
    ["PH","Prahova","Ploiești",{b:[0,23.2,58.7,[58.7,71],71]},"HCL 744/2025"],
    ["SJ","Sălaj","Zalău",{b:[0,20,20,20,20]},"HCL 415/2025"],
    ["SM","Satu Mare","Satu Mare",0,"HCL 98/2025 mod. HCL 343/2025"],
    ["SB","Sibiu","Sibiu",0,"HCL 125/2025 mod. HCL 462/2025"],
    ["SV","Suceava","Suceava",0,"HCL 329/2025"],
    ["TR","Teleorman","Alexandria",50,"HCL 403/2025"],
    ["TM","Timiș","Timișoara",50,"HCL 719/2025"],
    ["TL","Tulcea","Tulcea",0,"HCL 370/2025"],
    ["VL","Vâlcea","Râmnicu Vâlcea",{b:[0,0,20,20,20]},"HCL 356/2025 mod. HCL 389/2025"],
    ["VS","Vaslui","Vaslui",null,""],
    ["VN","Vrancea","Focșani",{b:[0,0,15,null,null]},"HCL 474/2025 (tabel propriu)"]
  ]
};
if (typeof module !== "undefined") module.exports = DATA;
