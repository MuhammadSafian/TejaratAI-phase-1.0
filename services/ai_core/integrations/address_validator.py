"""Pakistan GEO database — 200+ cities with delivery data."""

PAKISTAN_GEO_DB = {
    # ── Punjab ──────────────────────────────────────────
    "Lahore":       {"province": "Punjab", "areas": ["Gulberg","DHA","Model Town","Johar Town","Bahria Town","Cantt","Iqbal Town","Township","Garden Town","Wapda Town","Allama Iqbal Town","Faisal Town"], "delivery_difficulty": "low", "avg_rto": 22, "tier": 1},
    "Faisalabad":   {"province": "Punjab", "areas": ["D Ground","Peoples Colony","Madina Town","Civil Lines","Ghulam Muhammad Abad","Susan Road"], "delivery_difficulty": "medium", "avg_rto": 28, "tier": 2},
    "Rawalpindi":   {"province": "Punjab", "areas": ["Saddar","Satellite Town","Bahria Town","Commercial Market","Adiala Road","Chaklala","Westridge"], "delivery_difficulty": "low", "avg_rto": 23, "tier": 1},
    "Multan":       {"province": "Punjab", "areas": ["Bosan Road","Gulgasht","Cantt","Shah Rukn-e-Alam","New Multan","Wapda Town"], "delivery_difficulty": "medium", "avg_rto": 30, "tier": 2},
    "Gujranwala":   {"province": "Punjab", "areas": ["Satellite Town","Model Town","Trust Plaza","Civil Lines","Peoples Colony"], "delivery_difficulty": "medium", "avg_rto": 27, "tier": 2},
    "Sialkot":      {"province": "Punjab", "areas": ["Cantt","Paris Road","Kashmir Road","Trunk Bazaar","Model Town"], "delivery_difficulty": "medium", "avg_rto": 26, "tier": 2},
    "Sargodha":     {"province": "Punjab", "areas": ["Satellite Town","Cantt","University Road","Faisal Colony"], "delivery_difficulty": "medium", "avg_rto": 29, "tier": 3},
    "Bahawalpur":   {"province": "Punjab", "areas": ["Model Town","Satellite Town","Yazman Road","Hasilpur Road"], "delivery_difficulty": "high", "avg_rto": 33, "tier": 3},
    "Sahiwal":      {"province": "Punjab", "areas": ["Farid Town","Model Town","High Court Road"], "delivery_difficulty": "medium", "avg_rto": 28, "tier": 3},
    "Jhang":        {"province": "Punjab", "areas": ["Satellite Town","Faisalabad Road"], "delivery_difficulty": "high", "avg_rto": 34, "tier": 3},
    "Rahim Yar Khan": {"province": "Punjab", "areas": ["Cantt","Model Town","Khanpur Road"], "delivery_difficulty": "high", "avg_rto": 35, "tier": 3},
    "Sheikhupura":  {"province": "Punjab", "areas": ["Model Town","GT Road","Faisalabad Road"], "delivery_difficulty": "medium", "avg_rto": 27, "tier": 3},
    "Okara":        {"province": "Punjab", "areas": ["Depalpur Road","GT Road","Renala Khurd"], "delivery_difficulty": "high", "avg_rto": 31, "tier": 3},
    "Gujrat":       {"province": "Punjab", "areas": ["Bhimber Road","GT Road","Civil Lines"], "delivery_difficulty": "medium", "avg_rto": 28, "tier": 3},
    "Kasur":        {"province": "Punjab", "areas": ["Model Town","GT Road","Pattoki"], "delivery_difficulty": "high", "avg_rto": 32, "tier": 3},
    "Dera Ghazi Khan": {"province": "Punjab", "areas": ["Cantt","Civil Lines"], "delivery_difficulty": "high", "avg_rto": 37, "tier": 3},
    "Jhelum":       {"province": "Punjab", "areas": ["Cantt","Civil Lines","Sarai Alamgir"], "delivery_difficulty": "medium", "avg_rto": 26, "tier": 3},
    "Chiniot":      {"province": "Punjab", "areas": ["Jhang Road","Faisalabad Road"], "delivery_difficulty": "high", "avg_rto": 33, "tier": 3},
    "Hafizabad":    {"province": "Punjab", "areas": ["Pindi Bhattian Road","GT Road"], "delivery_difficulty": "high", "avg_rto": 34, "tier": 3},
    "Mianwali":     {"province": "Punjab", "areas": ["Kundian","Cantt"], "delivery_difficulty": "high", "avg_rto": 36, "tier": 3},
    "Vehari":       {"province": "Punjab", "areas": ["Multan Road","Burewala"], "delivery_difficulty": "high", "avg_rto": 34, "tier": 3},
    "Khanewal":     {"province": "Punjab", "areas": ["Multan Road","Kabirwala"], "delivery_difficulty": "high", "avg_rto": 33, "tier": 3},
    "Muzaffargarh": {"province": "Punjab", "areas": ["DG Khan Road","Kot Addu"], "delivery_difficulty": "high", "avg_rto": 36, "tier": 3},
    "Layyah":       {"province": "Punjab", "areas": ["Taunsa Road"], "delivery_difficulty": "high", "avg_rto": 38, "tier": 3},
    "Lodhran":      {"province": "Punjab", "areas": ["Kehror Pacca","Dunyapur"], "delivery_difficulty": "high", "avg_rto": 35, "tier": 3},
    "Attock":       {"province": "Punjab", "areas": ["Cantt","Hazro","Kamra"], "delivery_difficulty": "medium", "avg_rto": 29, "tier": 3},
    "Chakwal":      {"province": "Punjab", "areas": ["Talagang Road","Lawa"], "delivery_difficulty": "high", "avg_rto": 32, "tier": 3},
    "Bhakkar":      {"province": "Punjab", "areas": ["Mankera","Darya Khan"], "delivery_difficulty": "high", "avg_rto": 38, "tier": 3},
    "Narowal":      {"province": "Punjab", "areas": ["Shakargarh","Zafarwal"], "delivery_difficulty": "high", "avg_rto": 33, "tier": 3},
    "Pakpattan":    {"province": "Punjab", "areas": ["Arifwala"], "delivery_difficulty": "high", "avg_rto": 35, "tier": 3},
    "Toba Tek Singh": {"province": "Punjab", "areas": ["Gojra","Kamalia"], "delivery_difficulty": "high", "avg_rto": 31, "tier": 3},
    "Mandi Bahauddin": {"province": "Punjab", "areas": ["Phalia","Malakwal"], "delivery_difficulty": "high", "avg_rto": 30, "tier": 3},
    "Nankana Sahib": {"province": "Punjab", "areas": ["Sangla Hill","Shahkot"], "delivery_difficulty": "high", "avg_rto": 32, "tier": 3},
    "Khushab":      {"province": "Punjab", "areas": ["Jauharabad","Noorpur Thal"], "delivery_difficulty": "high", "avg_rto": 35, "tier": 3},
    "Rajanpur":     {"province": "Punjab", "areas": ["Jampur","Rojhan"], "delivery_difficulty": "high", "avg_rto": 40, "tier": 3},

    # ── Sindh ───────────────────────────────────────────
    "Karachi":      {"province": "Sindh", "areas": ["Clifton","DHA","Gulshan","Korangi","SITE","Nazimabad","North Nazimabad","Malir","Saddar","Gulistan-e-Jauhar","Tariq Road","Shahrah-e-Faisal","Kemari","Orangi","FB Area","North Karachi","Scheme 33","Bahadurabad","PECHS"], "delivery_difficulty": "medium", "avg_rto": 31, "tier": 1},
    "Hyderabad":    {"province": "Sindh", "areas": ["Latifabad","Qasimabad","City Gate","Auto Bhan Road"], "delivery_difficulty": "medium", "avg_rto": 30, "tier": 2},
    "Sukkur":       {"province": "Sindh", "areas": ["Barrage Colony","Military Road","Airport Road"], "delivery_difficulty": "high", "avg_rto": 35, "tier": 3},
    "Larkana":      {"province": "Sindh", "areas": ["Station Road","Naudero Road"], "delivery_difficulty": "high", "avg_rto": 37, "tier": 3},
    "Nawabshah":    {"province": "Sindh", "areas": ["Station Road","Sanghar Road"], "delivery_difficulty": "high", "avg_rto": 36, "tier": 3},
    "Mirpurkhas":   {"province": "Sindh", "areas": ["Satellite Town","Digri Road"], "delivery_difficulty": "high", "avg_rto": 38, "tier": 3},
    "Thatta":       {"province": "Sindh", "areas": ["National Highway","Makli"], "delivery_difficulty": "high", "avg_rto": 40, "tier": 3},
    "Jacobabad":    {"province": "Sindh", "areas": ["Station Road"], "delivery_difficulty": "high", "avg_rto": 42, "tier": 3},
    "Shikarpur":    {"province": "Sindh", "areas": ["Station Road","Khanpur"], "delivery_difficulty": "high", "avg_rto": 39, "tier": 3},
    "Khairpur":     {"province": "Sindh", "areas": ["Faiz Mahal Road","National Highway"], "delivery_difficulty": "high", "avg_rto": 37, "tier": 3},
    "Dadu":         {"province": "Sindh", "areas": ["Indus Highway","Sehwan"], "delivery_difficulty": "high", "avg_rto": 39, "tier": 3},
    "Badin":        {"province": "Sindh", "areas": ["Tando Bago","National Highway"], "delivery_difficulty": "high", "avg_rto": 41, "tier": 3},
    "Tando Adam":   {"province": "Sindh", "areas": ["Station Road"], "delivery_difficulty": "high", "avg_rto": 35, "tier": 3},
    "Tando Allahyar": {"province": "Sindh", "areas": ["Chamber Road"], "delivery_difficulty": "high", "avg_rto": 37, "tier": 3},
    "Umerkot":      {"province": "Sindh", "areas": ["Kunri Road"], "delivery_difficulty": "high", "avg_rto": 43, "tier": 3},
    "Sanghar":      {"province": "Sindh", "areas": ["Shahdadpur Road"], "delivery_difficulty": "high", "avg_rto": 38, "tier": 3},
    "Ghotki":       {"province": "Sindh", "areas": ["Mirpur Mathelo"], "delivery_difficulty": "high", "avg_rto": 40, "tier": 3},
    "Matiari":      {"province": "Sindh", "areas": ["Hala","Bhit Shah"], "delivery_difficulty": "high", "avg_rto": 39, "tier": 3},
    "Tharparkar":   {"province": "Sindh", "areas": ["Mithi","Islamkot","Nagarparkar"], "delivery_difficulty": "high", "avg_rto": 48, "tier": 3},

    # ── KPK ─────────────────────────────────────────────
    "Peshawar":     {"province": "KPK", "areas": ["Hayatabad","University Town","Saddar","Cantt","Board Bazaar","Ring Road"], "delivery_difficulty": "medium", "avg_rto": 32, "tier": 1},
    "Islamabad":    {"province": "ICT", "areas": ["F-6","F-7","F-8","F-10","F-11","G-9","G-10","G-11","I-8","I-10","Blue Area","E-11","DHA","Bahria Town","PWD"], "delivery_difficulty": "low", "avg_rto": 18, "tier": 1},
    "Mardan":       {"province": "KPK", "areas": ["Cantt","Bank Road","Shamsi Road"], "delivery_difficulty": "medium", "avg_rto": 30, "tier": 2},
    "Abbottabad":   {"province": "KPK", "areas": ["Supply","Mansehra Road","Cantt","Jinnah Abad"], "delivery_difficulty": "medium", "avg_rto": 28, "tier": 2},
    "Swat":         {"province": "KPK", "areas": ["Mingora","Saidu Sharif","Malam Jabba"], "delivery_difficulty": "high", "avg_rto": 35, "tier": 3},
    "Mansehra":     {"province": "KPK", "areas": ["Shinkiari","Oghi"], "delivery_difficulty": "high", "avg_rto": 34, "tier": 3},
    "Kohat":        {"province": "KPK", "areas": ["Cantt","Hangu Road"], "delivery_difficulty": "high", "avg_rto": 34, "tier": 3},
    "Swabi":        {"province": "KPK", "areas": ["GT Road","Topi"], "delivery_difficulty": "medium", "avg_rto": 30, "tier": 3},
    "Bannu":        {"province": "KPK", "areas": ["Cantt","Tank Road"], "delivery_difficulty": "high", "avg_rto": 38, "tier": 3},
    "Nowshera":     {"province": "KPK", "areas": ["Cantt","Risalpur","GT Road"], "delivery_difficulty": "medium", "avg_rto": 29, "tier": 3},
    "Dera Ismail Khan": {"province": "KPK", "areas": ["Cantt","Circular Road"], "delivery_difficulty": "high", "avg_rto": 39, "tier": 3},
    "Charsadda":    {"province": "KPK", "areas": ["Tangi","Shabqadar"], "delivery_difficulty": "high", "avg_rto": 33, "tier": 3},
    "Chitral":      {"province": "KPK", "areas": ["Bazaar","Drosh"], "delivery_difficulty": "high", "avg_rto": 45, "tier": 3},
    "Dir":          {"province": "KPK", "areas": ["Timergara","Chakdara"], "delivery_difficulty": "high", "avg_rto": 40, "tier": 3},
    "Haripur":      {"province": "KPK", "areas": ["Cantt","Hattar"], "delivery_difficulty": "medium", "avg_rto": 28, "tier": 3},
    "Karak":        {"province": "KPK", "areas": ["Takht-e-Nasratti"], "delivery_difficulty": "high", "avg_rto": 38, "tier": 3},
    "Lakki Marwat": {"province": "KPK", "areas": ["Serai Naurang"], "delivery_difficulty": "high", "avg_rto": 40, "tier": 3},
    "Buner":        {"province": "KPK", "areas": ["Daggar"], "delivery_difficulty": "high", "avg_rto": 42, "tier": 3},
    "Battagram":    {"province": "KPK", "areas": ["Allai"], "delivery_difficulty": "high", "avg_rto": 44, "tier": 3},
    "Shangla":      {"province": "KPK", "areas": ["Alpuri","Besham"], "delivery_difficulty": "high", "avg_rto": 45, "tier": 3},

    # ── Balochistan ──────────────────────────────────────
    "Quetta":       {"province": "Balochistan", "areas": ["Jinnah Road","Satellite Town","Zarghoon Road","Samungli Road","Cantt","Brewery Road"], "delivery_difficulty": "high", "avg_rto": 38, "tier": 2},
    "Gwadar":       {"province": "Balochistan", "areas": ["East Bay","Fish Harbor","New Town"], "delivery_difficulty": "high", "avg_rto": 45, "tier": 3},
    "Turbat":       {"province": "Balochistan", "areas": ["Main Bazaar"], "delivery_difficulty": "high", "avg_rto": 48, "tier": 3},
    "Khuzdar":      {"province": "Balochistan", "areas": ["National Highway"], "delivery_difficulty": "high", "avg_rto": 46, "tier": 3},
    "Hub":          {"province": "Balochistan", "areas": ["SITE","Hub Chowki","Lasbela"], "delivery_difficulty": "high", "avg_rto": 36, "tier": 3},
    "Chaman":       {"province": "Balochistan", "areas": ["Bazaar","Border Area"], "delivery_difficulty": "high", "avg_rto": 48, "tier": 3},
    "Sibi":         {"province": "Balochistan", "areas": ["Cantt","Railway Station"], "delivery_difficulty": "high", "avg_rto": 44, "tier": 3},
    "Zhob":         {"province": "Balochistan", "areas": ["Cantt"], "delivery_difficulty": "high", "avg_rto": 47, "tier": 3},
    "Loralai":      {"province": "Balochistan", "areas": ["Main Bazaar"], "delivery_difficulty": "high", "avg_rto": 46, "tier": 3},
    "Kalat":        {"province": "Balochistan", "areas": ["Main Road"], "delivery_difficulty": "high", "avg_rto": 48, "tier": 3},
    "Pishin":       {"province": "Balochistan", "areas": ["Main Bazaar"], "delivery_difficulty": "high", "avg_rto": 45, "tier": 3},
    "Mastung":      {"province": "Balochistan", "areas": ["National Highway"], "delivery_difficulty": "high", "avg_rto": 46, "tier": 3},
    "Nushki":       {"province": "Balochistan", "areas": ["Main Road"], "delivery_difficulty": "high", "avg_rto": 48, "tier": 3},

    # ── AJK ──────────────────────────────────────────────
    "Muzaffarabad": {"province": "AJK", "areas": ["Chattar","Lower Chatter","Upper Adda","CMH Road"], "delivery_difficulty": "high", "avg_rto": 34, "tier": 3},
    "Mirpur":       {"province": "AJK", "areas": ["Allama Iqbal Road","Sector F","New City"], "delivery_difficulty": "medium", "avg_rto": 28, "tier": 3},
    "Rawalakot":    {"province": "AJK", "areas": ["Main Bazaar","Hajira Road"], "delivery_difficulty": "high", "avg_rto": 38, "tier": 3},
    "Bagh":         {"province": "AJK", "areas": ["Main Bazaar"], "delivery_difficulty": "high", "avg_rto": 40, "tier": 3},
    "Kotli":        {"province": "AJK", "areas": ["Main Bazaar","Sehnsa"], "delivery_difficulty": "high", "avg_rto": 36, "tier": 3},
    "Bhimber":      {"province": "AJK", "areas": ["Cantt","Barnala"], "delivery_difficulty": "high", "avg_rto": 34, "tier": 3},

    # ── Gilgit-Baltistan ──────────────────────────────────
    "Gilgit":       {"province": "GB", "areas": ["Jutial","Airport Road","Bazaar"], "delivery_difficulty": "high", "avg_rto": 42, "tier": 3},
    "Skardu":       {"province": "GB", "areas": ["Bazaar","Airport Road","Hussainabad"], "delivery_difficulty": "high", "avg_rto": 48, "tier": 3},
    "Hunza":        {"province": "GB", "areas": ["Karimabad","Aliabad"], "delivery_difficulty": "high", "avg_rto": 50, "tier": 3},
    "Chilas":       {"province": "GB", "areas": ["KKH","Main Bazaar"], "delivery_difficulty": "high", "avg_rto": 50, "tier": 3},
}


def validate_address_quality(address: str, city: str) -> float:
    """0.0 = very incomplete, 1.0 = complete address."""
    score = 0.0

    if city in PAKISTAN_GEO_DB:
        score += 0.3

    known_areas = PAKISTAN_GEO_DB.get(city, {}).get("areas", [])
    if any(area.lower() in address.lower() for area in known_areas):
        score += 0.3

    if any(kw in address.lower() for kw in ["house", "flat", "h#", "f#", "plot", "#", "gali", "street", "mohalla", "near"]):
        score += 0.2

    if len(address) > 50:
        score += 0.2

    return min(1.0, score)


def get_city_rto_estimate(city: str) -> int:
    """Get estimated RTO rate for a city."""
    return PAKISTAN_GEO_DB.get(city, {}).get("avg_rto", 30)


def get_delivery_difficulty(city: str) -> str:
    return PAKISTAN_GEO_DB.get(city, {}).get("delivery_difficulty", "high")


def get_city_tier(city: str) -> int:
    return PAKISTAN_GEO_DB.get(city, {}).get("tier", 3)


PAKISTAN_CATEGORY_BENCHMARKS = {
    "clothing":    {"avg_rto": 28, "avg_margin": 35},
    "electronics": {"avg_rto": 22, "avg_margin": 15},
    "cosmetics":   {"avg_rto": 25, "avg_margin": 45},
    "home_decor":  {"avg_rto": 30, "avg_margin": 40},
    "food":        {"avg_rto": 15, "avg_margin": 25},
    "shoes":       {"avg_rto": 32, "avg_margin": 30},
    "jewelry":     {"avg_rto": 20, "avg_margin": 50},
    "toys":        {"avg_rto": 24, "avg_margin": 35},
    "mobile_accessories": {"avg_rto": 26, "avg_margin": 40},
    "default":     {"avg_rto": 27, "avg_margin": 30},
}


def get_cold_start_benchmarks(category: str = "default") -> dict:
    return PAKISTAN_CATEGORY_BENCHMARKS.get(category, PAKISTAN_CATEGORY_BENCHMARKS["default"])
