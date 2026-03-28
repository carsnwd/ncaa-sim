import { useState, useMemo, useCallback, useRef, useEffect } from "react";

// ============================================================
// SCHOOL COLORS: [primary, secondary/text] hex pairs
// ============================================================
const SCHOOL_COLORS = {
  "Duke": ["#003087", "#fff"], "North Carolina": ["#7BAFD4", "#13294B"], "Virginia": ["#232D4B", "#F84C1E"],
  "Wake Forest": ["#9E7E38", "#000"], "Clemson": ["#F56600", "#522D80"], "NC State": ["#CC0000", "#fff"],
  "Pittsburgh": ["#003594", "#FFB81C"], "Syracuse": ["#F76900", "#002244"], "Louisville": ["#AD0000", "#000"],
  "Miami (FL)": ["#F47321", "#005030"], "Virginia Tech": ["#630031", "#CF4420"], "Georgia Tech": ["#B3A369", "#003057"],
  "Notre Dame": ["#0C2340", "#C99700"], "Boston College": ["#8C2633", "#B29D6C"], "Florida State": ["#782F40", "#CEB888"],
  "SMU": ["#CC0035", "#0033A0"], "Stanford": ["#8C1515", "#fff"], "California": ["#003262", "#FDB515"],
  "Purdue": ["#CEB888", "#000"], "Michigan State": ["#18453B", "#fff"], "Illinois": ["#E84A27", "#13294B"],
  "Wisconsin": ["#C5050C", "#fff"], "Iowa": ["#FFCD00", "#000"], "Michigan": ["#00274C", "#FFCB05"],
  "Indiana": ["#990000", "#fff"], "Ohio State": ["#BB0000", "#666"], "Maryland": ["#E03A3E", "#FFD520"],
  "Penn State": ["#041E42", "#fff"], "Rutgers": ["#CC0033", "#5F6A72"], "Minnesota": ["#7A0019", "#FFCC33"],
  "Nebraska": ["#E41C38", "#fff"], "Northwestern": ["#4E2A84", "#fff"], "Oregon": ["#154733", "#FEE123"],
  "UCLA": ["#2D68C4", "#F2A900"], "USC": ["#990000", "#FFC72C"], "Washington": ["#4B2E83", "#B7A57A"],
  "Houston": ["#C8102E", "#fff"], "Auburn": ["#0C2340", "#E87722"], "Tennessee": ["#FF8200", "#fff"],
  "Kentucky": ["#0033A0", "#fff"], "Alabama": ["#9E1B32", "#fff"], "Texas A&M": ["#500000", "#fff"],
  "Arkansas": ["#9D2235", "#fff"], "Florida": ["#0021A5", "#FA4616"], "Missouri": ["#F1B82D", "#000"],
  "Ole Miss": ["#CE1126", "#14213D"], "LSU": ["#461D7C", "#FDD023"], "Georgia": ["#BA0C2F", "#000"],
  "Mississippi State": ["#660000", "#fff"], "South Carolina": ["#73000A", "#000"], "Vanderbilt": ["#000", "#866D4B"],
  "Texas": ["#BF5700", "#fff"], "Oklahoma": ["#841617", "#fff"],
  "Kansas": ["#0051BA", "#E8000D"], "Iowa State": ["#C8102E", "#F1BE48"], "Baylor": ["#154734", "#FFB81C"],
  "BYU": ["#002E5D", "#fff"], "Texas Tech": ["#CC0000", "#000"], "TCU": ["#4D1979", "#fff"],
  "Kansas State": ["#512888", "#fff"], "West Virginia": ["#002855", "#EAAA00"], "Oklahoma State": ["#FF6600", "#000"],
  "Cincinnati": ["#E00122", "#000"], "UCF": ["#000", "#BA9B37"], "Colorado": ["#CFB87C", "#000"],
  "Arizona": ["#CC0033", "#003366"], "Arizona State": ["#8C1D40", "#FFC627"], "Utah": ["#CC0000", "#fff"],
  "Houston Christian": ["#002D62", "#F6893D"],
  "UConn": ["#002868", "#fff"], "Marquette": ["#003366", "#FFCC00"], "Creighton": ["#005CA9", "#fff"],
  "Villanova": ["#003366", "#fff"], "St. John's": ["#C8102E", "#fff"], "Xavier": ["#002147", "#9EA2A2"],
  "Providence": ["#000", "#fff"], "Seton Hall": ["#004488", "#fff"], "Georgetown": ["#041E42", "#63666A"],
  "Butler": ["#13294B", "#fff"], "DePaul": ["#005EB8", "#E4002B"],
  "Memphis": ["#003087", "#8D9093"], "Wichita State": ["#000", "#FFCD00"], "Tulane": ["#006747", "#87CEEB"],
  "Temple": ["#9D2235", "#fff"], "South Florida": ["#006747", "#CFC493"], "Tulsa": ["#002D72", "#C8102E"],
  "East Carolina": ["#592A8A", "#FFC72C"], "UAB": ["#1E6B52", "#FFD700"], "Charlotte": ["#005035", "#B9975B"],
  "FAU": ["#003366", "#CC0000"], "UTSA": ["#0C2340", "#F15A22"], "North Texas": ["#00853E", "#fff"],
  "Rice": ["#002469", "#5E6062"], "Navy": ["#003B5C", "#C5B783"],
  "San Diego State": ["#A6192E", "#000"], "Nevada": ["#003366", "#807F84"], "New Mexico": ["#BA0C2F", "#63666A"],
  "Utah State": ["#0F2439", "#fff"], "Boise State": ["#0033A0", "#D64309"], "Colorado State": ["#1E4D2B", "#C8C372"],
  "UNLV": ["#CF0A2C", "#666"], "Fresno State": ["#DB0032", "#002E6D"], "Wyoming": ["#492F24", "#FFC425"],
  "Air Force": ["#003087", "#8D9093"], "San Jose State": ["#0055A2", "#E5A823"],
  "Gonzaga": ["#002967", "#C8102E"], "Saint Mary's": ["#0038A8", "#CE1141"], "San Francisco": ["#006633", "#FDBB30"],
  "Santa Clara": ["#862633", "#fff"], "Loyola Marymount": ["#00386B", "#960028"], "Pacific": ["#F47920", "#000"],
  "Pepperdine": ["#00205C", "#F67828"], "Portland": ["#3E1A6E", "#fff"], "San Diego": ["#002B5C", "#97D4E9"],
  "Oregon State": ["#DC4405", "#000"], "Washington State": ["#981E32", "#5E6A71"],
  "Dayton": ["#CE1141", "#004B8D"], "VCU": ["#000", "#FFB300"], "Saint Louis": ["#003DA5", "#fff"],
  "Richmond": ["#990000", "#00205B"], "George Mason": ["#006633", "#FFCC33"], "Rhode Island": ["#002147", "#75B2DD"],
  "Fordham": ["#6E0E2E", "#fff"], "La Salle": ["#002B5C", "#F1C400"], "Duquesne": ["#002D62", "#BA0C2F"],
  "George Washington": ["#004065", "#E8D4A2"], "St. Bonaventure": ["#6E3B23", "#fff"],
  "UMass": ["#881C1C", "#fff"], "Davidson": ["#CC0000", "#000"], "Loyola Chicago": ["#6C1D45", "#FDBB30"],
  "Drake": ["#004477", "#fff"], "Bradley": ["#A8102F", "#fff"], "Indiana State": ["#00609E", "#fff"],
  "Belmont": ["#002469", "#C8102E"], "Murray State": ["#002484", "#FDB736"], "Southern Illinois": ["#6E0028", "#fff"],
  "UNI": ["#4B116F", "#FFCC00"], "Illinois State": ["#CE1126", "#fff"], "Missouri State": ["#5F0000", "#fff"],
  "Valparaiso": ["#613318", "#FDBB30"], "Evansville": ["#4B0082", "#FF6100"],
  "Liberty": ["#002D62", "#C41230"], "Western Kentucky": ["#C60C30", "#fff"],
  "Louisiana Tech": ["#002F8B", "#C8102E"], "Middle Tennessee": ["#0066CC", "#fff"],
  "FIU": ["#081E3F", "#B6862C"], "Jacksonville State": ["#CC0000", "#fff"],
  "New Mexico State": ["#8B0D2E", "#fff"], "Sam Houston": ["#F06C00", "#fff"], "Kennesaw State": ["#FDBB30", "#000"],
  "James Madison": ["#450084", "#C2A14E"], "App State": ["#000", "#FFCC00"],
  "Marshall": ["#00B140", "#fff"], "Georgia State": ["#0039A6", "#CC0000"],
  "Louisiana": ["#CE181E", "#fff"], "Texas State": ["#501214", "#8D734A"],
  "Old Dominion": ["#003057", "#7C878E"], "Southern Miss": ["#000", "#FFB81C"],
  "Troy": ["#8B2332", "#fff"], "Coastal Carolina": ["#006F71", "#A27752"],
  "Arkansas State": ["#CC092F", "#000"], "South Alabama": ["#003E7E", "#C41230"], "ULM": ["#6F2C3F", "#C5960C"],
  "Charleston": ["#800000", "#fff"], "Hofstra": ["#003591", "#FFCE00"],
  "UNC Wilmington": ["#006666", "#FFD100"], "Towson": ["#000", "#FFD200"],
  "Drexel": ["#07294D", "#FFC600"], "Northeastern": ["#CC0000", "#000"],
  "Delaware": ["#00539F", "#FFD200"], "William & Mary": ["#006400", "#B5A268"],
  "Elon": ["#6E0028", "#CFAB7A"], "Stony Brook": ["#990000", "#00274C"],
  "Monmouth": ["#041A3B", "#fff"], "Hampton": ["#003DA5", "#fff"], "Campbell": ["#F47920", "#000"],
  "Toledo": ["#003E7E", "#FFCC00"], "Kent State": ["#002664", "#EAAB00"],
  "Akron": ["#003B71", "#A89968"], "Ohio": ["#00694E", "#fff"],
  "Buffalo": ["#005BBB", "#fff"], "Miami (OH)": ["#C3142D", "#fff"],
  "Bowling Green": ["#4F2C1D", "#FF7300"], "Ball State": ["#BA0C2F", "#fff"],
  "Eastern Michigan": ["#006747", "#fff"], "Western Michigan": ["#6C4023", "#B5A167"],
  "Central Michigan": ["#6A0032", "#FFC82E"], "Northern Illinois": ["#BA0C2F", "#000"],
  "Oakland": ["#000", "#B89B5E"], "Cleveland State": ["#006747", "#fff"],
  "Youngstown State": ["#CC0000", "#fff"], "Milwaukee": ["#000", "#FFD100"],
  "Wright State": ["#007A33", "#CEDC00"], "Northern Kentucky": ["#000", "#F6B000"],
  "IUPUI": ["#9D2235", "#000"], "Robert Morris": ["#002147", "#C8102E"],
  "Green Bay": ["#006747", "#fff"], "Purdue Fort Wayne": ["#000", "#CFB53B"], "Detroit Mercy": ["#C8102E", "#002D72"],
  "Grand Canyon": ["#522D80", "#fff"], "Stephen F. Austin": ["#3F2A56", "#fff"],
  "Abilene Christian": ["#461D7C", "#fff"], "Utah Valley": ["#275D38", "#fff"],
  "Seattle": ["#AA0000", "#fff"], "Tarleton State": ["#4F2D7F", "#fff"],
  "Southern Utah": ["#CC0000", "#002244"], "UT Arlington": ["#0064B1", "#F47C20"],
  "Utah Tech": ["#BA0C2F", "#002244"], "Cal Baptist": ["#002855", "#8B6914"],
  "High Point": ["#330072", "#fff"], "UNC Asheville": ["#005DAA", "#fff"],
  "Radford": ["#CC0000", "#006747"], "Winthrop": ["#872434", "#003366"],
  "Charleston Southern": ["#003DA5", "#B8860B"], "Gardner-Webb": ["#BF0D3E", "#000"],
  "Longwood": ["#003DA5", "#fff"], "Presbyterian": ["#00529B", "#C51230"],
  "South Dakota State": ["#0033A0", "#FFD100"], "Oral Roberts": ["#002855", "#C8A44E"],
  "South Dakota": ["#C21B2F", "#fff"], "Kansas City": ["#004B8D", "#FFB81C"],
  "North Dakota State": ["#006633", "#FFD100"], "North Dakota": ["#009A44", "#fff"],
  "Denver": ["#8B2332", "#B8A47E"], "Omaha": ["#000", "#C41230"],
  "Western Illinois": ["#663399", "#FFCC00"], "St. Thomas": ["#5E0D73", "#fff"],
  "Iona": ["#6E0028", "#B8860B"], "Fairfield": ["#CC0000", "#fff"],
  "Rider": ["#8B1A1A", "#fff"], "Marist": ["#C8102E", "#fff"],
  "Manhattan": ["#006747", "#fff"], "Niagara": ["#542E91", "#FFCE00"],
  "Saint Peter's": ["#003DA5", "#fff"], "Quinnipiac": ["#002B5C", "#FFB81C"],
  "Siena": ["#006747", "#FFCC00"], "Canisius": ["#002B5C", "#FFD100"], "Sacred Heart": ["#CE1141", "#5C6670"],
  "Colgate": ["#821019", "#fff"], "Bucknell": ["#003865", "#E87722"],
  "Lehigh": ["#653819", "#fff"], "Holy Cross": ["#602D89", "#fff"],
  "Lafayette": ["#6E0028", "#fff"], "Army": ["#000", "#D3BC8D"],
  "American": ["#ED174F", "#002B5C"], "Boston University": ["#CC0000", "#fff"], "Loyola Maryland": ["#00694E", "#8E8B76"],
  "Morehead State": ["#003B6F", "#FFD100"], "Tennessee Tech": ["#4F2D7F", "#FFD100"],
  "Little Rock": ["#8B0000", "#5C6670"], "SIU Edwardsville": ["#CC0000", "#fff"],
  "Southeast Missouri": ["#CC0000", "#000"], "Eastern Illinois": ["#004B98", "#7C8083"],
  "Tennessee State": ["#00539F", "#fff"], "UT Martin": ["#002D62", "#FF6600"], "Lindenwood": ["#000", "#A48841"],
  "Princeton": ["#E77500", "#000"], "Yale": ["#00356B", "#fff"],
  "Cornell": ["#B31B1B", "#fff"], "Penn": ["#011F5B", "#990000"],
  "Harvard": ["#A51C30", "#fff"], "Brown": ["#4E3629", "#C00404"],
  "Dartmouth": ["#00693E", "#fff"], "Columbia": ["#9BCBEB", "#002B7F"],
  "Merrimack": ["#002F6C", "#FFD100"], "FDU": ["#003DA5", "#6E0028"],
  "Wagner": ["#003A26", "#fff"], "Central Connecticut": ["#003DA5", "#fff"],
  "LIU": ["#003DA5", "#FFD100"], "St. Francis (PA)": ["#CC0000", "#fff"],
  "Stonehill": ["#592C82", "#fff"], "Le Moyne": ["#006633", "#fff"],
  "Florida Gulf Coast": ["#006747", "#002D72"], "Stetson": ["#006747", "#fff"],
  "Lipscomb": ["#1B0A3C", "#E8B630"], "Eastern Kentucky": ["#6E0028", "#fff"],
  "North Alabama": ["#46166B", "#FFD100"], "Central Arkansas": ["#4F2D7F", "#808080"],
  "Austin Peay": ["#C41230", "#fff"], "Queens": ["#002F6C", "#CFB87C"], "West Georgia": ["#C41230", "#002D62"],
  "Nicholls": ["#CC0000", "#808080"], "McNeese": ["#003DA5", "#FFD100"],
  "SE Louisiana": ["#006747", "#FFD100"], "Northwestern State": ["#492F91", "#F47920"],
  "Incarnate Word": ["#CC0000", "#000"], "Lamar": ["#C41230", "#fff"],
  "Texas A&M-CC": ["#003DA5", "#FFD100"], "HBU": ["#002469", "#F47920"], "New Orleans": ["#002B5C", "#C8C8C8"],
  "Montana State": ["#002F6C", "#FFD100"], "Montana": ["#6E0028", "#C0C0C0"],
  "Eastern Washington": ["#A10022", "#000"], "Northern Colorado": ["#003B71", "#FFB81C"],
  "Weber State": ["#4B2682", "#fff"], "Sacramento State": ["#00573F", "#C4B581"],
  "Portland State": ["#154734", "#fff"], "Idaho State": ["#F47920", "#000"],
  "Idaho": ["#B5A268", "#000"], "Northern Arizona": ["#003466", "#FFD100"], "Cal Poly": ["#1F4F28", "#C69214"],
  "UC Irvine": ["#0064A4", "#FFD200"], "UC Santa Barbara": ["#003660", "#FEBC11"],
  "UC Davis": ["#002855", "#DAAA00"], "Long Beach State": ["#000", "#F3C736"],
  "Hawaii": ["#024731", "#fff"], "Cal State Fullerton": ["#003366", "#F47920"],
  "UC Riverside": ["#003DA5", "#FFD100"], "Cal State Northridge": ["#C41230", "#000"],
  "UC San Diego": ["#182B49", "#C69214"], "Cal State Bakersfield": ["#003DA5", "#FFD100"],
  "Howard": ["#002B5C", "#C41230"], "Norfolk State": ["#007A53", "#B8860B"],
  "Coppin State": ["#002469", "#B8860B"], "Delaware State": ["#C41230", "#7BA0C7"],
  "Morgan State": ["#002B5C", "#F47920"], "Maryland Eastern Shore": ["#6E0028", "#808080"],
  "South Carolina State": ["#6E0028", "#00529B"], "NC Central": ["#862633", "#C5960C"],
  "Texas Southern": ["#6E0028", "#B8B8B8"], "Grambling": ["#000", "#F4C430"],
  "Southern": ["#00BFFF", "#FFD100"], "Jackson State": ["#003DA5", "#fff"],
  "Prairie View A&M": ["#492F91", "#FFD100"], "Alcorn State": ["#4B0082", "#FFD100"],
  "Alabama State": ["#000", "#FFD100"], "Alabama A&M": ["#6E0028", "#fff"],
  "MVSU": ["#006747", "#fff"], "Bethune-Cookman": ["#6E0028", "#FFD100"],
  "Florida A&M": ["#006747", "#F47920"], "Arkansas-Pine Bluff": ["#000", "#FFD100"],
  "Vermont": ["#003300", "#FFD100"], "UMBC": ["#000", "#FFB81C"],
  "Albany": ["#461D7C", "#EAAA00"], "Binghamton": ["#005A43", "#fff"],
  "UMass Lowell": ["#003DA5", "#CC0000"], "Hartford": ["#C8102E", "#fff"],
  "Maine": ["#003263", "#fff"], "Bryant": ["#000", "#B8860B"], "New Hampshire": ["#003DA5", "#fff"],
  "Chattanooga": ["#00386B", "#E0AA0F"], "Furman": ["#582C83", "#fff"],
  "ETSU": ["#041E42", "#FFB81C"], "Samford": ["#002B5C", "#C41230"],
  "UNC Greensboro": ["#003366", "#FFD100"], "Wofford": ["#000", "#886B3D"],
  "Mercer": ["#F47920", "#000"], "Western Carolina": ["#592C82", "#C5960C"],
  "The Citadel": ["#003DA5", "#fff"], "VMI": ["#C41230", "#FFD100"],
};

const CONF_COLORS = {
  "ACC": ["#013CA6", "#fff"], "Big Ten": ["#0B1460", "#fff"], "SEC": ["#004A8F", "#FFD100"],
  "Big 12": ["#C41230", "#fff"], "Big East": ["#005EB8", "#fff"],
  "Power Conferences": ["#7C3AED", "#fff"],
  "American": ["#004B8D", "#fff"], "Mountain West": ["#003DA5", "#C0C0C0"],
  "WCC": ["#002967", "#fff"], "A-10": ["#002B5C", "#fff"],
  "MVC": ["#002B5C", "#CF102D"], "C-USA": ["#002B5C", "#fff"],
  "Sun Belt": ["#003DA5", "#FFB81C"], "CAA": ["#002B5C", "#FFD100"],
  "MAC": ["#003366", "#fff"], "Horizon": ["#003B71", "#fff"],
  "WAC": ["#002855", "#fff"], "Big South": ["#002B5C", "#fff"],
  "Summit": ["#003DA5", "#fff"], "MAAC": ["#003DA5", "#fff"],
  "Patriot": ["#002B5C", "#fff"], "OVC": ["#002B5C", "#FFD100"],
  "Ivy League": ["#003300", "#C9A96E"], "NEC": ["#003DA5", "#fff"],
  "Atlantic Sun": ["#002B5C", "#FFD100"], "Southland": ["#003DA5", "#FFD100"],
  "Big Sky": ["#003466", "#FFD100"], "Big West": ["#003DA5", "#FFD100"],
  "MEAC": ["#003DA5", "#fff"], "SWAC": ["#000", "#FFD100"],
  "Northeast": ["#003DA5", "#fff"], "Southern": ["#003DA5", "#fff"],
};

function getInitials(n) { const s = { "Duke": "DU", "North Carolina": "NC", "Virginia": "VA", "Wake Forest": "WF", "Clemson": "CL", "NC State": "NCS", "Pittsburgh": "PIT", "Syracuse": "SYR", "Louisville": "LOU", "Miami (FL)": "MIA", "Virginia Tech": "VT", "Georgia Tech": "GT", "Notre Dame": "ND", "Boston College": "BC", "Florida State": "FSU", "SMU": "SMU", "Stanford": "STN", "California": "CAL", "Purdue": "PUR", "Michigan State": "MSU", "Illinois": "ILL", "Wisconsin": "WIS", "Iowa": "IOW", "Michigan": "MIC", "Indiana": "IND", "Ohio State": "OSU", "Maryland": "MD", "Penn State": "PSU", "Rutgers": "RUT", "Minnesota": "MIN", "Nebraska": "NEB", "Northwestern": "NW", "Oregon": "ORE", "UCLA": "UCLA", "USC": "USC", "Washington": "UW", "Houston": "HOU", "Auburn": "AUB", "Tennessee": "TEN", "Kentucky": "UK", "Alabama": "ALA", "Texas A&M": "TAM", "Arkansas": "ARK", "Florida": "FLA", "Missouri": "MIZ", "Ole Miss": "OM", "LSU": "LSU", "Georgia": "UGA", "Mississippi State": "MST", "South Carolina": "SC", "Vanderbilt": "VAN", "Texas": "TEX", "Oklahoma": "OU", "Kansas": "KU", "Iowa State": "ISU", "Baylor": "BAY", "BYU": "BYU", "Texas Tech": "TT", "TCU": "TCU", "Kansas State": "KSU", "West Virginia": "WVU", "Oklahoma State": "OKS", "Cincinnati": "CIN", "UCF": "UCF", "Colorado": "CU", "Arizona": "AZ", "Arizona State": "ASU", "Utah": "UTA", "Houston Christian": "HCU", "UConn": "UCN", "Marquette": "MAR", "Creighton": "CRE", "Villanova": "VIL", "St. John's": "STJ", "Xavier": "XAV", "Providence": "PRV", "Seton Hall": "SH", "Georgetown": "GEO", "Butler": "BUT", "DePaul": "DEP", "Memphis": "MEM", "Wichita State": "WSU", "Tulane": "TUL", "Temple": "TEM", "South Florida": "USF", "Tulsa": "TLS", "East Carolina": "ECU", "UAB": "UAB", "Charlotte": "CLT", "FAU": "FAU", "UTSA": "UTSA", "North Texas": "UNT", "Rice": "RIC", "Navy": "NAV", "San Diego State": "SDS", "Nevada": "NEV", "New Mexico": "UNM", "Utah State": "USU", "Boise State": "BOI", "Colorado State": "CSU", "UNLV": "UNLV", "Fresno State": "FRS", "Wyoming": "WYO", "Air Force": "AF", "San Jose State": "SJS", "Gonzaga": "GON", "Saint Mary's": "SMC", "San Francisco": "USF", "Santa Clara": "SCU", "Loyola Marymount": "LMU", "Pacific": "PAC", "Pepperdine": "PEP", "Portland": "POR", "San Diego": "SD", "Oregon State": "ORS", "Washington State": "WST", "Dayton": "DAY", "VCU": "VCU", "Saint Louis": "SLU", "Richmond": "RCH", "George Mason": "GMU", "Rhode Island": "URI", "Fordham": "FOR", "La Salle": "LAS", "Duquesne": "DUQ", "George Washington": "GWU", "St. Bonaventure": "SBU", "UMass": "UMA", "Davidson": "DAV", "Loyola Chicago": "LUC", "Drake": "DRK", "Bradley": "BRA", "Indiana State": "INS", "Belmont": "BEL", "Murray State": "MUR", "Southern Illinois": "SIU", "UNI": "UNI", "Illinois State": "ILS", "Missouri State": "MOS", "Valparaiso": "VAL", "Evansville": "EVN", "Liberty": "LIB", "Western Kentucky": "WKU", "Louisiana Tech": "LT", "Middle Tennessee": "MT", "FIU": "FIU", "Jacksonville State": "JSU", "New Mexico State": "NMS", "Sam Houston": "SHU", "Kennesaw State": "KSU", "James Madison": "JMU", "App State": "APP", "Marshall": "MAR", "Georgia State": "GSU", "Louisiana": "ULL", "Texas State": "TXS", "Old Dominion": "ODU", "Southern Miss": "USM", "Troy": "TRO", "Coastal Carolina": "CCU", "Arkansas State": "ARS", "South Alabama": "USA", "ULM": "ULM", "Charleston": "CHS", "Hofstra": "HOF", "UNC Wilmington": "UNW", "Towson": "TOW", "Drexel": "DRX", "Northeastern": "NEU", "Delaware": "DEL", "William & Mary": "WM", "Elon": "ELN", "Stony Brook": "SBK", "Monmouth": "MON", "Hampton": "HAM", "Campbell": "CAM", "Toledo": "TOL", "Kent State": "KNT", "Akron": "AKR", "Ohio": "OHU", "Buffalo": "BUF", "Miami (OH)": "MOH", "Bowling Green": "BG", "Ball State": "BSU", "Eastern Michigan": "EMU", "Western Michigan": "WMU", "Central Michigan": "CMU", "Northern Illinois": "NIU", "Oakland": "OAK", "Cleveland State": "CST", "Youngstown State": "YSU", "Milwaukee": "MIL", "Wright State": "WRS", "Northern Kentucky": "NKU", "IUPUI": "IUP", "Robert Morris": "RMU", "Green Bay": "GB", "Purdue Fort Wayne": "PFW", "Detroit Mercy": "DET", "Grand Canyon": "GCU", "Stephen F. Austin": "SFA", "Abilene Christian": "ACU", "Utah Valley": "UVU", "Seattle": "SEA", "Tarleton State": "TAR", "Southern Utah": "SUU", "UT Arlington": "UTA", "Utah Tech": "UTT", "Cal Baptist": "CBU", "High Point": "HPU", "UNC Asheville": "UNA", "Radford": "RAD", "Winthrop": "WIN", "Charleston Southern": "CSN", "Gardner-Webb": "GW", "Longwood": "LW", "Presbyterian": "PC", "South Dakota State": "SDS", "Oral Roberts": "ORU", "South Dakota": "USD", "Kansas City": "KC", "North Dakota State": "NDS", "North Dakota": "UND", "Denver": "DEN", "Omaha": "OMA", "Western Illinois": "WIU", "St. Thomas": "STT", "Iona": "ION", "Fairfield": "FAI", "Rider": "RID", "Marist": "MRT", "Manhattan": "MAN", "Niagara": "NIA", "Saint Peter's": "SPU", "Quinnipiac": "QU", "Siena": "SIE", "Canisius": "CAN", "Sacred Heart": "SHR", "Colgate": "COL", "Bucknell": "BUK", "Lehigh": "LEH", "Holy Cross": "HC", "Lafayette": "LAF", "Army": "ARM", "American": "AME", "Boston University": "BU", "Loyola Maryland": "LMD", "Morehead State": "MOR", "Tennessee Tech": "TTU", "Little Rock": "LR", "SIU Edwardsville": "SIE", "Southeast Missouri": "SEM", "Eastern Illinois": "EIU", "Tennessee State": "TSU", "UT Martin": "UTM", "Lindenwood": "LIN", "Princeton": "PRI", "Yale": "YAL", "Cornell": "COR", "Penn": "PEN", "Harvard": "HAR", "Brown": "BRO", "Dartmouth": "DAR", "Columbia": "COL", "Merrimack": "MER", "FDU": "FDU", "Wagner": "WAG", "Central Connecticut": "CCS", "LIU": "LIU", "St. Francis (PA)": "SFP", "Stonehill": "STH", "Le Moyne": "LEM", "Florida Gulf Coast": "FGC", "Stetson": "STS", "Lipscomb": "LIP", "Eastern Kentucky": "EKU", "North Alabama": "UNA", "Central Arkansas": "UCA", "Austin Peay": "APU", "Queens": "QU", "West Georgia": "WGA", "Nicholls": "NIC", "McNeese": "MCN", "SE Louisiana": "SEL", "Northwestern State": "NSU", "Incarnate Word": "IW", "Lamar": "LAM", "Texas A&M-CC": "AMC", "HBU": "HBU", "New Orleans": "UNO", "Montana State": "MSU", "Montana": "MON", "Eastern Washington": "EWU", "Northern Colorado": "UNC", "Weber State": "WEB", "Sacramento State": "SAC", "Portland State": "PSU", "Idaho State": "ISU", "Idaho": "IDA", "Northern Arizona": "NAU", "Cal Poly": "CP", "UC Irvine": "UCI", "UC Santa Barbara": "SB", "UC Davis": "UCD", "Long Beach State": "LBS", "Hawaii": "HAW", "Cal State Fullerton": "CSF", "UC Riverside": "UCR", "Cal State Northridge": "CSN", "UC San Diego": "UCS", "Cal State Bakersfield": "CSB", "Howard": "HOW", "Norfolk State": "NSU", "Coppin State": "COP", "Delaware State": "DSU", "Morgan State": "MGS", "Maryland Eastern Shore": "UME", "South Carolina State": "SCS", "NC Central": "NCC", "Texas Southern": "TSU", "Grambling": "GRM", "Southern": "SOU", "Jackson State": "JSU", "Prairie View A&M": "PVA", "Alcorn State": "ALC", "Alabama State": "ASU", "Alabama A&M": "AAM", "MVSU": "MVS", "Bethune-Cookman": "BCU", "Florida A&M": "FAM", "Arkansas-Pine Bluff": "APB", "Vermont": "UVM", "UMBC": "UMB", "Albany": "ALB", "Binghamton": "BIN", "UMass Lowell": "UML", "Hartford": "HAR", "Maine": "ME", "Bryant": "BRY", "New Hampshire": "UNH", "Chattanooga": "UTC", "Furman": "FUR", "ETSU": "ETS", "Samford": "SAM", "UNC Greensboro": "UNG", "Wofford": "WOF", "Mercer": "MER", "Western Carolina": "WCU", "The Citadel": "CIT", "VMI": "VMI" }; return s[n] || n.substring(0, 3).toUpperCase(); }

function TeamBadge({ name, size = 22 }) {
  const c = SCHOOL_COLORS[name] || ["#333", "#fff"];
  return <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: size, height: size, minWidth: size, borderRadius: size * 0.22, background: c[0], color: c[1], fontSize: size * 0.38, fontWeight: 900, letterSpacing: -0.3, lineHeight: 1, border: `1.5px solid ${c[1]}30`, fontFamily: "'Segoe UI',system-ui,sans-serif" }}>{getInitials(name)}</span>;
}

function ConfBadge({ name, size = 16 }) {
  const c = CONF_COLORS[name] || ["#333", "#fff"];
  const lbl = name.length > 5 ? name.substring(0, 4) : name;
  return <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: size, minWidth: size, padding: "0 3px", borderRadius: 3, background: c[0], color: c[1], fontSize: Math.max(7, size * 0.5), fontWeight: 800, letterSpacing: 0.2, lineHeight: 1, fontFamily: "'Segoe UI',system-ui,sans-serif", whiteSpace: "nowrap" }}>{lbl}</span>;
}

// ============================================================
// CONFERENCES DATA
// ============================================================
const CONFERENCES_DATA = { "ACC": { teams: [{ name: "Duke", elo: 1820 }, { name: "North Carolina", elo: 1790 }, { name: "Virginia", elo: 1680 }, { name: "Wake Forest", elo: 1620 }, { name: "Clemson", elo: 1610 }, { name: "NC State", elo: 1600 }, { name: "Pittsburgh", elo: 1590 }, { name: "Syracuse", elo: 1560 }, { name: "Louisville", elo: 1540 }, { name: "Miami (FL)", elo: 1530 }, { name: "Virginia Tech", elo: 1520 }, { name: "Georgia Tech", elo: 1480 }, { name: "Notre Dame", elo: 1500 }, { name: "Boston College", elo: 1430 }, { name: "Florida State", elo: 1470 }, { name: "SMU", elo: 1580 }, { name: "Stanford", elo: 1490 }, { name: "California", elo: 1440 }] }, "Big Ten": { teams: [{ name: "Purdue", elo: 1810 }, { name: "Michigan State", elo: 1720 }, { name: "Illinois", elo: 1740 }, { name: "Wisconsin", elo: 1680 }, { name: "Iowa", elo: 1650 }, { name: "Michigan", elo: 1600 }, { name: "Indiana", elo: 1590 }, { name: "Ohio State", elo: 1570 }, { name: "Maryland", elo: 1560 }, { name: "Penn State", elo: 1530 }, { name: "Rutgers", elo: 1500 }, { name: "Minnesota", elo: 1490 }, { name: "Nebraska", elo: 1480 }, { name: "Northwestern", elo: 1460 }, { name: "Oregon", elo: 1700 }, { name: "UCLA", elo: 1680 }, { name: "USC", elo: 1560 }, { name: "Washington", elo: 1490 }] }, "SEC": { teams: [{ name: "Houston", elo: 1830 }, { name: "Auburn", elo: 1800 }, { name: "Tennessee", elo: 1780 }, { name: "Kentucky", elo: 1750 }, { name: "Alabama", elo: 1730 }, { name: "Texas A&M", elo: 1680 }, { name: "Arkansas", elo: 1620 }, { name: "Florida", elo: 1640 }, { name: "Missouri", elo: 1600 }, { name: "Ole Miss", elo: 1560 }, { name: "LSU", elo: 1550 }, { name: "Georgia", elo: 1500 }, { name: "Mississippi State", elo: 1520 }, { name: "South Carolina", elo: 1490 }, { name: "Vanderbilt", elo: 1470 }, { name: "Texas", elo: 1700 }, { name: "Oklahoma", elo: 1580 }] }, "Big 12": { teams: [{ name: "Kansas", elo: 1810 }, { name: "Iowa State", elo: 1750 }, { name: "Baylor", elo: 1680 }, { name: "BYU", elo: 1660 }, { name: "Texas Tech", elo: 1660 }, { name: "TCU", elo: 1610 }, { name: "Kansas State", elo: 1600 }, { name: "West Virginia", elo: 1540 }, { name: "Oklahoma State", elo: 1530 }, { name: "Cincinnati", elo: 1570 }, { name: "UCF", elo: 1540 }, { name: "Colorado", elo: 1560 }, { name: "Arizona", elo: 1720 }, { name: "Arizona State", elo: 1580 }, { name: "Utah", elo: 1520 }, { name: "Houston Christian", elo: 1200 }] }, "Big East": { teams: [{ name: "UConn", elo: 1830 }, { name: "Marquette", elo: 1760 }, { name: "Creighton", elo: 1720 }, { name: "Villanova", elo: 1640 }, { name: "St. John's", elo: 1680 }, { name: "Xavier", elo: 1600 }, { name: "Providence", elo: 1560 }, { name: "Seton Hall", elo: 1500 }, { name: "Georgetown", elo: 1420 }, { name: "Butler", elo: 1520 }, { name: "DePaul", elo: 1430 }] }, "American": { teams: [{ name: "Memphis", elo: 1620 }, { name: "Wichita State", elo: 1540 }, { name: "Tulane", elo: 1500 }, { name: "Temple", elo: 1490 }, { name: "South Florida", elo: 1440 }, { name: "Tulsa", elo: 1430 }, { name: "East Carolina", elo: 1390 }, { name: "UAB", elo: 1480 }, { name: "Charlotte", elo: 1420 }, { name: "FAU", elo: 1560 }, { name: "UTSA", elo: 1380 }, { name: "North Texas", elo: 1470 }, { name: "Rice", elo: 1400 }, { name: "Navy", elo: 1350 }] }, "Mountain West": { teams: [{ name: "San Diego State", elo: 1660 }, { name: "Nevada", elo: 1560 }, { name: "New Mexico", elo: 1600 }, { name: "Utah State", elo: 1540 }, { name: "Boise State", elo: 1520 }, { name: "Colorado State", elo: 1510 }, { name: "UNLV", elo: 1530 }, { name: "Fresno State", elo: 1480 }, { name: "Wyoming", elo: 1440 }, { name: "Air Force", elo: 1400 }, { name: "San Jose State", elo: 1360 }] }, "WCC": { teams: [{ name: "Gonzaga", elo: 1780 }, { name: "Saint Mary's", elo: 1680 }, { name: "San Francisco", elo: 1540 }, { name: "Santa Clara", elo: 1500 }, { name: "Loyola Marymount", elo: 1460 }, { name: "Pacific", elo: 1400 }, { name: "Pepperdine", elo: 1390 }, { name: "Portland", elo: 1340 }, { name: "San Diego", elo: 1420 }, { name: "Oregon State", elo: 1480 }, { name: "Washington State", elo: 1490 }] }, "A-10": { teams: [{ name: "Dayton", elo: 1620 }, { name: "VCU", elo: 1580 }, { name: "Saint Louis", elo: 1530 }, { name: "Richmond", elo: 1510 }, { name: "George Mason", elo: 1480 }, { name: "Rhode Island", elo: 1460 }, { name: "Fordham", elo: 1440 }, { name: "La Salle", elo: 1380 }, { name: "Duquesne", elo: 1490 }, { name: "George Washington", elo: 1430 }, { name: "St. Bonaventure", elo: 1470 }, { name: "UMass", elo: 1420 }, { name: "Davidson", elo: 1450 }, { name: "Loyola Chicago", elo: 1510 }] }, "MVC": { teams: [{ name: "Drake", elo: 1560 }, { name: "Bradley", elo: 1470 }, { name: "Indiana State", elo: 1500 }, { name: "Belmont", elo: 1480 }, { name: "Murray State", elo: 1490 }, { name: "Southern Illinois", elo: 1440 }, { name: "UNI", elo: 1450 }, { name: "Illinois State", elo: 1420 }, { name: "Missouri State", elo: 1400 }, { name: "Valparaiso", elo: 1380 }, { name: "Evansville", elo: 1340 }] }, "C-USA": { teams: [{ name: "Liberty", elo: 1520 }, { name: "Western Kentucky", elo: 1490 }, { name: "Louisiana Tech", elo: 1470 }, { name: "Middle Tennessee", elo: 1450 }, { name: "FIU", elo: 1400 }, { name: "Jacksonville State", elo: 1410 }, { name: "New Mexico State", elo: 1430 }, { name: "Sam Houston", elo: 1440 }, { name: "Kennesaw State", elo: 1350 }] }, "Sun Belt": { teams: [{ name: "James Madison", elo: 1540 }, { name: "App State", elo: 1480 }, { name: "Marshall", elo: 1470 }, { name: "Georgia State", elo: 1450 }, { name: "Louisiana", elo: 1460 }, { name: "Texas State", elo: 1440 }, { name: "Old Dominion", elo: 1420 }, { name: "Southern Miss", elo: 1400 }, { name: "Troy", elo: 1410 }, { name: "Coastal Carolina", elo: 1430 }, { name: "Arkansas State", elo: 1380 }, { name: "South Alabama", elo: 1390 }, { name: "ULM", elo: 1340 }] }, "CAA": { teams: [{ name: "Charleston", elo: 1560 }, { name: "Hofstra", elo: 1500 }, { name: "UNC Wilmington", elo: 1470 }, { name: "Towson", elo: 1480 }, { name: "Drexel", elo: 1440 }, { name: "Northeastern", elo: 1430 }, { name: "Delaware", elo: 1410 }, { name: "William & Mary", elo: 1420 }, { name: "Elon", elo: 1400 }, { name: "Stony Brook", elo: 1380 }, { name: "Monmouth", elo: 1390 }, { name: "Hampton", elo: 1350 }, { name: "Campbell", elo: 1370 }] }, "MAC": { teams: [{ name: "Toledo", elo: 1520 }, { name: "Kent State", elo: 1470 }, { name: "Akron", elo: 1480 }, { name: "Ohio", elo: 1460 }, { name: "Buffalo", elo: 1440 }, { name: "Miami (OH)", elo: 1430 }, { name: "Bowling Green", elo: 1420 }, { name: "Ball State", elo: 1400 }, { name: "Eastern Michigan", elo: 1380 }, { name: "Western Michigan", elo: 1390 }, { name: "Central Michigan", elo: 1370 }, { name: "Northern Illinois", elo: 1410 }] }, "Horizon": { teams: [{ name: "Oakland", elo: 1520 }, { name: "Cleveland State", elo: 1460 }, { name: "Youngstown State", elo: 1430 }, { name: "Milwaukee", elo: 1440 }, { name: "Wright State", elo: 1420 }, { name: "Northern Kentucky", elo: 1450 }, { name: "IUPUI", elo: 1360 }, { name: "Robert Morris", elo: 1390 }, { name: "Green Bay", elo: 1370 }, { name: "Purdue Fort Wayne", elo: 1350 }, { name: "Detroit Mercy", elo: 1340 }] }, "WAC": { teams: [{ name: "Grand Canyon", elo: 1530 }, { name: "Stephen F. Austin", elo: 1470 }, { name: "Abilene Christian", elo: 1460 }, { name: "Utah Valley", elo: 1440 }, { name: "Seattle", elo: 1430 }, { name: "Tarleton State", elo: 1400 }, { name: "Southern Utah", elo: 1380 }, { name: "UT Arlington", elo: 1420 }, { name: "Utah Tech", elo: 1340 }, { name: "Cal Baptist", elo: 1410 }] }, "Big South": { teams: [{ name: "High Point", elo: 1470 }, { name: "UNC Asheville", elo: 1440 }, { name: "Radford", elo: 1420 }, { name: "Winthrop", elo: 1430 }, { name: "Charleston Southern", elo: 1380 }, { name: "Gardner-Webb", elo: 1390 }, { name: "Longwood", elo: 1400 }, { name: "Presbyterian", elo: 1350 }] }, "Summit": { teams: [{ name: "South Dakota State", elo: 1520 }, { name: "Oral Roberts", elo: 1490 }, { name: "South Dakota", elo: 1460 }, { name: "Kansas City", elo: 1430 }, { name: "North Dakota State", elo: 1450 }, { name: "North Dakota", elo: 1420 }, { name: "Denver", elo: 1400 }, { name: "Omaha", elo: 1380 }, { name: "Western Illinois", elo: 1340 }, { name: "St. Thomas", elo: 1370 }] }, "MAAC": { teams: [{ name: "Iona", elo: 1490 }, { name: "Fairfield", elo: 1460 }, { name: "Rider", elo: 1420 }, { name: "Marist", elo: 1410 }, { name: "Manhattan", elo: 1400 }, { name: "Niagara", elo: 1380 }, { name: "Saint Peter's", elo: 1430 }, { name: "Quinnipiac", elo: 1390 }, { name: "Siena", elo: 1440 }, { name: "Canisius", elo: 1360 }, { name: "Sacred Heart", elo: 1370 }] }, "Patriot": { teams: [{ name: "Colgate", elo: 1490 }, { name: "Bucknell", elo: 1460 }, { name: "Lehigh", elo: 1430 }, { name: "Holy Cross", elo: 1410 }, { name: "Lafayette", elo: 1390 }, { name: "Army", elo: 1420 }, { name: "American", elo: 1400 }, { name: "Boston University", elo: 1440 }, { name: "Loyola Maryland", elo: 1380 }] }, "OVC": { teams: [{ name: "Morehead State", elo: 1470 }, { name: "Tennessee Tech", elo: 1420 }, { name: "Little Rock", elo: 1440 }, { name: "SIU Edwardsville", elo: 1400 }, { name: "Southeast Missouri", elo: 1390 }, { name: "Eastern Illinois", elo: 1360 }, { name: "Tennessee State", elo: 1370 }, { name: "UT Martin", elo: 1380 }, { name: "Lindenwood", elo: 1350 }] }, "Ivy League": { teams: [{ name: "Princeton", elo: 1540 }, { name: "Yale", elo: 1520 }, { name: "Cornell", elo: 1470 }, { name: "Penn", elo: 1450 }, { name: "Harvard", elo: 1460 }, { name: "Brown", elo: 1410 }, { name: "Dartmouth", elo: 1390 }, { name: "Columbia", elo: 1400 }] }, "NEC": { teams: [{ name: "Merrimack", elo: 1450 }, { name: "FDU", elo: 1420 }, { name: "Wagner", elo: 1430 }, { name: "Central Connecticut", elo: 1380 }, { name: "LIU", elo: 1370 }, { name: "St. Francis (PA)", elo: 1360 }, { name: "Stonehill", elo: 1350 }, { name: "Le Moyne", elo: 1340 }] }, "Atlantic Sun": { teams: [{ name: "Florida Gulf Coast", elo: 1470 }, { name: "Stetson", elo: 1440 }, { name: "Lipscomb", elo: 1450 }, { name: "Eastern Kentucky", elo: 1460 }, { name: "North Alabama", elo: 1410 }, { name: "Central Arkansas", elo: 1400 }, { name: "Austin Peay", elo: 1430 }, { name: "Queens", elo: 1380 }, { name: "West Georgia", elo: 1350 }] }, "Southland": { teams: [{ name: "Nicholls", elo: 1450 }, { name: "McNeese", elo: 1460 }, { name: "SE Louisiana", elo: 1420 }, { name: "Northwestern State", elo: 1400 }, { name: "Incarnate Word", elo: 1380 }, { name: "Lamar", elo: 1390 }, { name: "Texas A&M-CC", elo: 1410 }, { name: "HBU", elo: 1370 }, { name: "New Orleans", elo: 1350 }] }, "Big Sky": { teams: [{ name: "Montana State", elo: 1500 }, { name: "Montana", elo: 1480 }, { name: "Eastern Washington", elo: 1460 }, { name: "Northern Colorado", elo: 1440 }, { name: "Weber State", elo: 1430 }, { name: "Sacramento State", elo: 1450 }, { name: "Portland State", elo: 1400 }, { name: "Idaho State", elo: 1380 }, { name: "Idaho", elo: 1420 }, { name: "Northern Arizona", elo: 1390 }, { name: "Cal Poly", elo: 1360 }] }, "Big West": { teams: [{ name: "UC Irvine", elo: 1500 }, { name: "UC Santa Barbara", elo: 1490 }, { name: "UC Davis", elo: 1460 }, { name: "Long Beach State", elo: 1470 }, { name: "Hawaii", elo: 1430 }, { name: "Cal State Fullerton", elo: 1440 }, { name: "UC Riverside", elo: 1410 }, { name: "Cal State Northridge", elo: 1390 }, { name: "UC San Diego", elo: 1420 }, { name: "Cal State Bakersfield", elo: 1380 }] }, "MEAC": { teams: [{ name: "Howard", elo: 1400 }, { name: "Norfolk State", elo: 1420 }, { name: "Coppin State", elo: 1350 }, { name: "Delaware State", elo: 1340 }, { name: "Morgan State", elo: 1380 }, { name: "Maryland Eastern Shore", elo: 1310 }, { name: "South Carolina State", elo: 1360 }, { name: "NC Central", elo: 1390 }] }, "SWAC": { teams: [{ name: "Texas Southern", elo: 1410 }, { name: "Grambling", elo: 1400 }, { name: "Southern", elo: 1390 }, { name: "Jackson State", elo: 1380 }, { name: "Prairie View A&M", elo: 1370 }, { name: "Alcorn State", elo: 1360 }, { name: "Alabama State", elo: 1350 }, { name: "Alabama A&M", elo: 1340 }, { name: "MVSU", elo: 1320 }, { name: "Bethune-Cookman", elo: 1330 }, { name: "Florida A&M", elo: 1370 }, { name: "Arkansas-Pine Bluff", elo: 1310 }] }, "Northeast": { teams: [{ name: "Vermont", elo: 1520 }, { name: "UMBC", elo: 1470 }, { name: "Albany", elo: 1440 }, { name: "Binghamton", elo: 1420 }, { name: "UMass Lowell", elo: 1410 }, { name: "Hartford", elo: 1380 }, { name: "Maine", elo: 1370 }, { name: "Bryant", elo: 1400 }, { name: "New Hampshire", elo: 1390 }] }, "Southern": { teams: [{ name: "Chattanooga", elo: 1510 }, { name: "Furman", elo: 1500 }, { name: "ETSU", elo: 1470 }, { name: "Samford", elo: 1460 }, { name: "UNC Greensboro", elo: 1440 }, { name: "Wofford", elo: 1430 }, { name: "Mercer", elo: 1420 }, { name: "Western Carolina", elo: 1390 }, { name: "The Citadel", elo: 1370 }, { name: "VMI", elo: 1380 }] } };

// ============================================================
// SIMULATION ENGINE
// ============================================================
const K_FACTOR = 32, HOME_ADVANTAGE = 60;
function seededRandom(seed) { let s = seed; return function () { s = (s * 1664525 + 1013904223) & 0xFFFFFFFF; return (s >>> 0) / 0xFFFFFFFF; }; }
function getConferenceStrength(teams, conferences) {
  const confStrength = {};
  Object.entries(conferences).forEach(([conf, teamNames]) => {
    confStrength[conf] = teamNames.reduce((sum, name) => sum + teams[name].elo, 0) / teamNames.length;
  });
  return confStrength;
}
function buildTop25RankMap(topTeams) {
  return Object.fromEntries(topTeams.map((team, index) => [team.name, index + 1]));
}
function buildFinalFourSnapshot(finalFourRound, teams) {
  const games = finalFourRound?.results?.["Final Four"]?.games || [];

  return games.flatMap(g => ([
    { team: g.home, seed: g.seeds?.[0] ?? null, conference: teams[g.home]?.conference || "" },
    { team: g.away, seed: g.seeds?.[1] ?? null, conference: teams[g.away]?.conference || "" },
  ]));
}
function buildFinalFourPlacements(finalFourRound, championEntry, runnerUpEntry, teams) {
  const finalFour = buildFinalFourSnapshot(finalFourRound, teams);
  if (!championEntry || !runnerUpEntry) return finalFour;

  const remaining = finalFour.filter(entry => entry.team !== championEntry.team && entry.team !== runnerUpEntry.team);
  return [championEntry, runnerUpEntry, ...remaining];
}
function initializeTeams(previousTeams = null) { const teams = {}, conferences = {}; Object.entries(CONFERENCES_DATA).forEach(([cn, conf]) => { conferences[cn] = []; conf.teams.forEach(t => { const priorElo = previousTeams?.[t.name]?.elo; const startingElo = priorElo ?? t.elo; teams[t.name] = { name: t.name, conference: cn, elo: startingElo, startingElo, wins: 0, losses: 0, confWins: 0, confLosses: 0, streak: 0, streakType: null }; conferences[cn].push(t.name); }); }); return { teams, conferences }; }

function generateSchedule(teams, conferences, rng) { const schedule = [], teamNames = Object.keys(teams); for (let week = 1; week <= 7; week++) { const weekGames = [], scheduled = new Set(), shuffled = [...teamNames].sort(() => rng() - 0.5); for (let i = 0; i < shuffled.length - 1; i++) { if (scheduled.has(shuffled[i])) continue; for (let j = i + 1; j < shuffled.length; j++) { if (scheduled.has(shuffled[j])) continue; if (teams[shuffled[i]].conference === teams[shuffled[j]].conference) continue; const d = Math.abs(teams[shuffled[i]].elo - teams[shuffled[j]].elo); if (week <= 3 && d > 350 && rng() > 0.3) continue; weekGames.push({ home: rng() > 0.5 ? shuffled[i] : shuffled[j], away: rng() > 0.5 ? shuffled[j] : shuffled[i], isConference: false, week }); scheduled.add(shuffled[i]); scheduled.add(shuffled[j]); break; } } if (week <= 4) { const top = teamNames.filter(t => teams[t].elo > 1700 && !scheduled.has(t)).sort(() => rng() - 0.5); for (let i = 0; i < top.length - 1; i += 2) { if (teams[top[i]].conference !== teams[top[i + 1]].conference) weekGames.push({ home: top[i], away: top[i + 1], isConference: false, week }); } } schedule.push({ week, games: weekGames, phase: "Non-Conference" }); } for (let week = 8; week <= 18; week++) { const weekGames = []; Object.entries(conferences).forEach(([cn, ct]) => { const sh = [...ct].sort(() => rng() - 0.5); for (let i = 0; i < sh.length - 1; i += 2)weekGames.push({ home: rng() > 0.5 ? sh[i] : sh[i + 1], away: rng() > 0.5 ? sh[i + 1] : sh[i], isConference: true, week }); }); schedule.push({ week, games: weekGames, phase: "Conference Play" }); } schedule.push({ week: 19, games: [], phase: "Conference Tournaments" }); schedule.push({ week: 20, games: [], phase: "NCAA Tournament - Round of 64" }); schedule.push({ week: 21, games: [], phase: "NCAA Tournament - Round of 32" }); schedule.push({ week: 22, games: [], phase: "NCAA Tournament - Sweet 16" }); schedule.push({ week: 23, games: [], phase: "NCAA Tournament - Elite 8" }); schedule.push({ week: 24, games: [], phase: "NCAA Tournament - Final Four" }); schedule.push({ week: 25, games: [], phase: "NCAA Tournament - Championship" }); return schedule; }

function simulateGame(home, away, teams, rng, confStrength = {}, isNeutral = false) {
  const confDiff = ((confStrength[teams[home].conference] || 0) - (confStrength[teams[away].conference] || 0)) * 0.15;
  const hE = teams[home].elo + (isNeutral ? 0 : HOME_ADVANTAGE) + confDiff, aE = teams[away].elo,
    exp = 1 / (1 + Math.pow(10, (aE - hE) / 400)), r = rng() < exp ? 1 : 0, w = r === 1 ? home : away, l = r === 1 ? away : home;
  const bs = 68 + Math.floor(rng() * 15), mg = Math.floor(Math.abs(rng() * 20 + rng() * 10)), ws = bs + Math.floor(mg / 2), ls = bs - Math.ceil(mg / 2);
  const ec = Math.round(K_FACTOR * (r - exp)); teams[home].elo += ec; teams[away].elo -= ec; teams[w].wins++; teams[l].losses++;
  if (teams[w].streakType === "W") teams[w].streak++; else { teams[w].streak = 1; teams[w].streakType = "W"; }
  if (teams[l].streakType === "L") teams[l].streak++; else { teams[l].streak = 1; teams[l].streakType = "L"; }
  const isUpset = (w === away && exp > 0.7) || (w === home && exp < 0.3);
  return { home, away, winner: w, loser: l, homeScore: w === home ? ws : ls, awayScore: w === away ? ws : ls, isUpset, upsetMagnitude: w === away ? exp : 1 - exp, eloChange: Math.abs(ec) };
}
function runConferenceTournaments(teams, conferences, rng) {
  const confStrength = getConferenceStrength(teams, conferences);
  const results = {}, autobids = {}, allGames = [];

  Object.entries(conferences).forEach(([cn, ct]) => {
    const sorted = [...ct].sort((a, b) => {
      const d = (teams[b].confWins - teams[b].confLosses) - (teams[a].confWins - teams[a].confLosses);
      return d !== 0 ? d : teams[b].elo - teams[a].elo;
    });

    const tournSize = CONF_TOURNAMENT_SIZE[cn] || ct.length;
    let bracket = sorted.slice(0, Math.min(ct.length, tournSize));
    let size = 1;
    while (size < bracket.length) size *= 2;
    while (bracket.length < size) bracket.push(null);

    let current = [...seedBracket(bracket)];
    const rounds = [];

    while (current.length > 1) {
      const next = [];
      const rg = [];

      for (let i = 0; i < current.length; i += 2) {
        if (!current[i + 1]) { next.push(current[i]); continue; }
        if (!current[i]) { next.push(current[i + 1]); continue; }

        const g = simulateGame(current[i], current[i + 1], teams, rng, confStrength, true);
        g.isConference = true;
        rg.push(g);
        allGames.push(g);
        next.push(g.winner);
      }

      rounds.push(rg);
      current = next;
    }

    autobids[cn] = current[0];
    results[cn] = { champion: current[0], rounds };
  });

  return { results, autobids, games: allGames };
}

function buildNCAATournament(teams, conferences, autobids) { const tl = Object.values(teams), abs = new Set(Object.values(autobids)); const al = tl.filter(t => !abs.has(t.name)).sort((a, b) => b.elo - a.elo).slice(0, 68 - Object.keys(autobids).length).map(t => t.name); const field = [...abs, ...al]; field.sort((a, b) => teams[b].elo - teams[a].elo); const regions = ["South", "East", "West", "Midwest"], bracket = {}; regions.forEach((r, ri) => { bracket[r] = []; for (let s = 1; s <= 16; s++) { const idx = (s - 1) * 4 + ri; if (idx < field.length) bracket[r].push({ seed: s, team: field[idx] }); } }); return { bracket, field }; }

function seedBracket(teams) {
  const n = teams.length;
  if (n <= 1) return teams;

  const result = new Array(n);
  for (let i = 0; i < n; i++) {
    if (i % 2 === 0) result[i] = teams[i / 2];
    else result[i] = teams[n - 1 - Math.floor(i / 2)];
  }
  return result;
}

function bracketOrder(entries) { if (entries.length <= 2) return entries; const sorted = [...entries].sort((a, b) => a.seed - b.seed); if (sorted.length === 16) { const order = [[1, 16], [8, 9], [5, 12], [4, 13], [6, 11], [3, 14], [7, 10], [2, 15]]; const result = []; order.forEach(([a, b]) => { const tA = sorted.find(e => e.seed === a), tB = sorted.find(e => e.seed === b); if (tA) result.push(tA); if (tB) result.push(tB); }); return result; } return entries; }

function runNCAARound(bracket, teams, rng, conferences) { const confStrength = conferences ? getConferenceStrength(teams, conferences) : {}; const results = {}, allGames = []; Object.entries(bracket).forEach(([region, entries]) => { const games = [], winners = [], ordered = bracketOrder(entries); for (let i = 0; i < ordered.length; i += 2) { if (!ordered[i + 1]) { winners.push(ordered[i]); continue; } const hi = ordered[i].seed <= ordered[i + 1].seed ? ordered[i] : ordered[i + 1], lo = ordered[i].seed <= ordered[i + 1].seed ? ordered[i + 1] : ordered[i]; const g = simulateGame(hi.team, lo.team, teams, rng, confStrength, true); g.matchup = `(${hi.seed}) ${hi.team} vs (${lo.seed}) ${lo.team}`; g.seeds = [hi.seed, lo.seed]; g.region = region; games.push(g); allGames.push(g); winners.push({ seed: g.winner === hi.team ? hi.seed : lo.seed, team: g.winner }); } results[region] = { games, winners }; }); return { results, allGames }; }

function buildNCAABracketForPhase(phase, ncaaBracket, ncaaRoundResults) {
  if (phase.includes("Round of 64")) return ncaaBracket.bracket;

  const previousRound = ncaaRoundResults[ncaaRoundResults.length - 1];
  if (!previousRound) return null;

  if (phase.includes("Final Four")) {
    return { "Final Four": Object.values(previousRound.results).map(r => r.winners[0]) };
  }

  if (phase.includes("Championship")) {
    return { "Championship": Object.values(previousRound.results).flatMap(r => r.winners) };
  }

  const bracket = {};
  Object.entries(previousRound.results).forEach(([region, data]) => {
    bracket[region] = data.winners;
  });
  return bracket;
}

const CONF_TOURNAMENT_SIZE = {
  "ACC": 15, "Big Ten": 14, "SEC": 16, "Big 12": 14, "Big East": 11,
  "American": 12, "Mountain West": 11, "WCC": 10, "A-10": 14, "MVC": 10,
  "C-USA": 8, "Sun Belt": 12, "CAA": 12, "MAC": 12, "Horizon": 10,
  "WAC": 8, "Big South": 8, "Summit": 8, "MAAC": 11, "Patriot": 8,
  "OVC": 8, "Ivy League": 8, "NEC": 8, "Atlantic Sun": 8, "Southland": 8,
  "Big Sky": 8, "Big West": 10, "MEAC": 8, "SWAC": 10, "Northeast": 8, "Southern": 8,
};

const POWER_CONFERENCES = ["ACC", "Big Ten", "Big 12", "SEC", "Big East"];

function getConferenceStandings(gameState, conferenceName) {
  if (!gameState || !conferenceName) return [];

  return (gameState.conferences[conferenceName] || []).map(n => gameState.teams[n]).sort((a, b) => {
    const d = (b.confWins - b.confLosses) - (a.confWins - a.confLosses);
    return d !== 0 ? d : b.elo - a.elo;
  });
}

// ============================================================
// MAIN COMPONENT
// ============================================================
const PHASE_COLORS = { "Non-Conference": "#e67e22", "Conference Play": "#3498db", "Conference Tournaments": "#9b59b6", "NCAA Tournament - Round of 64": "#e74c3c", "NCAA Tournament - Round of 32": "#e74c3c", "NCAA Tournament - Sweet 16": "#e74c3c", "NCAA Tournament - Elite 8": "#e74c3c", "NCAA Tournament - Final Four": "#e74c3c", "NCAA Tournament - Championship": "#e74c3c" };

export default function NCAASimulator() {
  const [gameState, setGameState] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [weekResults, setWeekResults] = useState([]);
  const [view, setView] = useState("dashboard");
  const [selectedConf, setSelectedConf] = useState("SEC");
  const [confTournResults, setConfTournResults] = useState(null);
  const [ncaaBracket, setNcaaBracket] = useState(null);
  const [ncaaRoundResults, setNcaaRoundResults] = useState([]);
  const [champion, setChampion] = useState(null);
  const [seasonHistory, setSeasonHistory] = useState([]);
  const rngRef = useRef(null);
  const previousTop25RanksRef = useRef(null);
  const simulateWeekRef = useRef(null);
  const gameStateRef = useRef(null);
  const currentWeekRef = useRef(0);

  const startSeason = useCallback(() => { rngRef.current = seededRandom(Date.now()); const { teams, conferences } = initializeTeams(gameState?.teams ?? null); const schedule = generateSchedule(teams, conferences, rngRef.current); previousTop25RanksRef.current = buildTop25RankMap(Object.values(teams).sort((a, b) => b.elo - a.elo).slice(0, 25)); setGameState({ teams, conferences, schedule }); setCurrentWeek(0); setWeekResults([]); setConfTournResults(null); setNcaaBracket(null); setNcaaRoundResults([]); setChampion(null); }, [gameState]);

  const simulateWeek = useCallback(() => {
    if (!gameState) return;

    const { teams, conferences, schedule } = gameState;
    const rng = rngRef.current;
    const nw = currentWeek;
    if (nw >= schedule.length) return;

    const wd = schedule[nw];

    if (wd.phase === "Conference Tournaments") {
      const ct = runConferenceTournaments(teams, conferences, rng);
      setConfTournResults(ct);
      setNcaaBracket(buildNCAATournament(teams, conferences, ct.autobids));
      setWeekResults(p => [...p, { week: wd.week, phase: wd.phase, results: ct.games, upsets: ct.games.filter(g => g.isUpset) }]);
      setCurrentWeek(nw + 1);
      setGameState({ ...gameState, teams: { ...teams } });
      return;
    }

    if (wd.phase.includes("NCAA Tournament")) {
      if (!ncaaBracket) return;

      const cb = buildNCAABracketForPhase(wd.phase, ncaaBracket, ncaaRoundResults);
      if (!cb) return;

      const rr = runNCAARound(cb, teams, rng, conferences);
      setNcaaRoundResults(p => [...p, rr]);

      if (wd.phase.includes("Championship")) {
        const aw = Object.values(rr.results).flatMap(r => r.winners);
        const championshipGame = rr.allGames[0];
        if (aw.length === 1) {
          const championEntry = aw[0];
          setChampion(championEntry);
          const finalFourRound = ncaaRoundResults[ncaaRoundResults.length - 1];
          if (finalFourRound && championshipGame) {
            const runnerUpEntry = {
              team: championshipGame.loser,
              seed: championshipGame.seeds?.[championshipGame.winner === championshipGame.home ? 1 : 0] ?? null,
              conference: teams[championshipGame.loser]?.conference || "",
            };
            setSeasonHistory(p => [...p, { season: p.length + 1, placements: buildFinalFourPlacements(finalFourRound, championEntry, runnerUpEntry, teams) }]);
          }
        }
      }

      setWeekResults(p => [...p, { week: wd.week, phase: wd.phase, results: rr.allGames, upsets: rr.allGames.filter(g => g.isUpset) }]);
      setCurrentWeek(nw + 1);
      setGameState({ ...gameState, teams: { ...teams } });
      return;
    }

    const results = [];
    const confStrength = getConferenceStrength(teams, conferences);
    wd.games.forEach(g => {
      const r = simulateGame(g.home, g.away, teams, rng, confStrength);
      r.isConference = g.isConference;
      if (g.isConference) {
        teams[r.winner].confWins++;
        teams[r.loser].confLosses++;
      }
      results.push(r);
    });
    setWeekResults(p => [...p, { week: wd.week, phase: wd.phase, results, upsets: results.filter(r => r.isUpset).sort((a, b) => b.upsetMagnitude - a.upsetMagnitude) }]);
    setCurrentWeek(nw + 1);
    setGameState({ ...gameState, teams: { ...teams } });
  }, [gameState, currentWeek, ncaaBracket, ncaaRoundResults]);

  useEffect(() => { simulateWeekRef.current = simulateWeek; }, [simulateWeek]);
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);
  useEffect(() => { currentWeekRef.current = currentWeek; }, [currentWeek]);

  const autoSimulateUntil = useCallback((targetWeek) => {
    const step = () => {
      const gs = gameStateRef.current;
      const sim = simulateWeekRef.current;
      if (!gs || !sim) return;
      if (currentWeekRef.current >= targetWeek || currentWeekRef.current >= gs.schedule.length) return;

      sim();
      setTimeout(step, 40);
    };

    step();
  }, []);

  const simulateToBracketStart = useCallback(() => {
    const gs = gameStateRef.current;
    if (!gs) return;

    const bracketStart = gs.schedule.findIndex(w => w.phase.includes("NCAA Tournament"));
    if (bracketStart === -1) return;

    autoSimulateUntil(bracketStart);
  }, [autoSimulateUntil]);

  const simulateToEndOfSeason = useCallback(() => {
    const gs = gameStateRef.current;
    if (!gs) return;

    autoSimulateUntil(gs.schedule.length);
  }, [autoSimulateUntil]);

  const top25 = useMemo(() => gameState ? Object.values(gameState.teams).sort((a, b) => b.elo - a.elo).slice(0, 25) : [], [gameState, currentWeek]);
  const confStandings = useMemo(() => getConferenceStandings(gameState, selectedConf), [gameState, selectedConf, currentWeek]);
  const powerConferenceStandings = useMemo(() => POWER_CONFERENCES.map(conf => ({ conference: conf, standings: getConferenceStandings(gameState, conf) })), [gameState, currentWeek]);
  useEffect(() => {
    if (top25.length > 0) previousTop25RanksRef.current = buildTop25RankMap(top25);
  }, [top25]);

  const getTop25RankChange = (teamName, currentRank) => {
    const previousRank = previousTop25RanksRef.current?.[teamName];
    if (previousRank == null) return "new";

    const delta = previousRank - currentRank;
    if (delta > 0) return `+${delta}`;
    if (delta < 0) return `${delta}`;
    return "0";
  };

  const renderConferencePanel = (conferenceName, isPowerView = false) => {
    const standings = getConferenceStandings(gameState, conferenceName);

    return (
      <div
        key={conferenceName}
        style={{
          ...S.card,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        <h3 style={S.cardTitle}>
          <ConfBadge name={conferenceName} size={20} />
          <span style={{ marginLeft: 6 }}>{conferenceName} STANDINGS</span>
        </h3>
        {confTournResults && confTournResults.autobids[conferenceName] && (
          <div style={S.confChampBanner}>
            🏆 Champion: <TeamBadge name={confTournResults.autobids[conferenceName]} size={18} />
            <strong style={{ marginLeft: 4 }}>{confTournResults.autobids[conferenceName]}</strong>
          </div>
        )}
        <div style={S.rankHeader}>
          <span style={{ width: 22 }}>#</span>
          <span style={{ width: 24 }}></span>
          <span style={{ flex: 1 }}>Team</span>
          <span style={{ width: 50, textAlign: "center" }}>All</span>
          <span style={{ width: 50, textAlign: "center" }}>Conf</span>
          <span style={{ width: 42, textAlign: "right" }}>Elo</span>
          <span style={{ width: 46, textAlign: "center" }}>Strk</span>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          {standings.map((t, i) => (
            <div key={t.name} style={{ ...S.rankRowFull, background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
              <span style={{ width: 22, color: "#555", fontSize: 11 }}>{i + 1}</span>
              <TeamBadge name={t.name} size={22} />
              <span style={{ flex: 1, fontWeight: 600, color: "#eee", marginLeft: 5 }}>{t.name}</span>
              <span style={{ width: 50, textAlign: "center", color: "#ccc", fontSize: 12 }}>{t.wins}-{t.losses}</span>
              <span style={{ width: 50, textAlign: "center", fontWeight: 700, color: "#4ecdc4", fontSize: 12 }}>{t.confWins}-{t.confLosses}</span>
              <span style={{ width: 42, textAlign: "right", fontFamily: "monospace", color: "#aaa", fontSize: 11 }}>{Math.round(t.elo)}</span>
              <span style={{ width: 46, textAlign: "center" }}>{t.streak > 0 && <span style={{ ...S.streakBadge, background: t.streakType === "W" ? "#27ae60" : "#c0392b" }}>{t.streakType}{t.streak}</span>}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  const latestWeek = weekResults.length > 0 ? weekResults[weekResults.length - 1] : null;

  if (!gameState) return (
    <div style={S.startScreen}><div style={S.startContent}>
      <div style={S.logo}>🏀</div>
      <h1 style={S.startTitle}>NCAA BASKETBALL</h1>
      <h2 style={S.startSubtitle}>SEASON SIMULATOR</h2>
      <div style={S.startInfo}>
        <p style={S.startStat}>{Object.values(CONFERENCES_DATA).reduce((a, c) => a + c.teams.length, 0)} teams</p>
        <p style={S.startStat}>{Object.keys(CONFERENCES_DATA).length} conferences</p>
        <p style={S.startStat}>25 weeks</p>
      </div>
      <button style={S.startButton} onClick={startSeason}>TIP OFF SEASON →</button>
    </div></div>
  );

  const schedule = gameState.schedule; const nextPhase = currentWeek < schedule.length ? schedule[currentWeek].phase : "Season Complete"; const progress = (currentWeek / schedule.length) * 100;

  return (
    <div style={S.container}>
      <div style={S.header}>
        <div style={S.headerLeft}><span style={S.headerLogo}>🏀</span><div><h1 style={S.headerTitle}>NCAA SIM</h1><p style={S.headerPhase}>{nextPhase}</p></div></div>
        <div style={S.headerRight}><div style={S.weekBadge}>{currentWeek < schedule.length ? `Week ${currentWeek + 1} / ${schedule.length}` : "SEASON COMPLETE"}</div><div style={S.progressBar}><div style={{ ...S.progressFill, width: `${progress}%` }} /></div></div>
      </div>

      {champion && <div style={S.championBanner}><div style={S.trophyIcon}>🏆</div><div><div style={S.championLabel}>NATIONAL CHAMPION</div><div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}><TeamBadge name={champion.team} size={36} /><div style={S.championName}>{champion.team}</div></div><div style={S.championRecord}>({gameState.teams[champion.team].wins}-{gameState.teams[champion.team].losses}) · #{champion.seed} seed · {gameState.teams[champion.team].conference}</div><div style={{ marginTop: 10, display: "flex", justifyContent: "center" }}><button style={S.championButton} onClick={startSeason}>🔄 New Season</button></div></div></div>}

      {currentWeek < schedule.length && <div style={S.simBar}><button style={S.simButton} onClick={simulateWeek}>▶ SIMULATE WEEK {currentWeek + 1}: {schedule[currentWeek].phase}</button><button style={S.simButtonSmall} onClick={() => { for (let i = 0; i < 5; i++)setTimeout(() => simulateWeek(), i * 50) }}>⏩ x5</button><button style={S.simButtonSmall} onClick={simulateToBracketStart}>🏀 To Bracket</button><button style={S.simButtonSmall} onClick={simulateToEndOfSeason}>🏁 End Season</button></div>}

      <div style={S.tabs}>{["dashboard", "top25", "conference", "results", "bracket", "history"].map(t => <button key={t} style={{ ...S.tab, ...(view === t ? S.tabActive : {}) }} onClick={() => setView(t)}>{t === "dashboard" ? "📊 Dashboard" : t === "top25" ? "🏆 Top 25" : t === "conference" ? "📋 Conf" : t === "results" ? "✓ Results" : t === "bracket" ? "🎯 Bracket" : "📚 History"}</button>)}</div>

      <div style={S.content}>

        {view === "dashboard" && <div style={S.dashGrid}>
          <div style={S.card}><h3 style={S.cardTitle}>🔥 TOP 10</h3>{top25.slice(0, 10).map((t, i) => <div key={t.name} style={S.rankRow}><span style={S.rankNum}>{i + 1}</span><TeamBadge name={t.name} size={22} /><span style={S.rankName}>{t.name}</span><ConfBadge name={t.conference} size={14} /><span style={S.rankRecord}>{t.wins}-{t.losses}</span><span style={S.rankElo}>{Math.round(t.elo)}</span></div>)}</div>
          <div style={S.card}><h3 style={S.cardTitle}>🚨 LATEST UPSETS</h3>{latestWeek && latestWeek.upsets.length > 0 ? latestWeek.upsets.slice(0, 8).map((g, i) => <div key={i} style={S.upsetRow}><TeamBadge name={g.winner} size={18} /><span style={{ color: "#2ecc71", fontWeight: 600, flex: 1, fontSize: 12 }}>✓ {g.winner}</span><span style={S.score}>{g.homeScore}-{g.awayScore}</span><span style={{ color: "#e74c3c", flex: 1, textAlign: "right", fontSize: 12 }}>✗ {g.loser}</span><TeamBadge name={g.loser} size={18} /></div>) : <p style={S.emptyText}>{currentWeek === 0 ? "Simulate the first week!" : "No upsets this week"}</p>}</div>
          <div style={S.card}><h3 style={S.cardTitle}>📊 SEASON STATS</h3><div style={S.statGrid}><div style={S.statItem}><div style={S.statNumber}>{weekResults.reduce((a, w) => a + w.results.length, 0)}</div><div style={S.statLabel}>Games</div></div><div style={S.statItem}><div style={S.statNumber}>{weekResults.reduce((a, w) => a + w.upsets.length, 0)}</div><div style={S.statLabel}>Upsets</div></div><div style={S.statItem}><div style={S.statNumber}>{top25.length > 0 ? Math.round(top25[0].elo) : "--"}</div><div style={S.statLabel}>#1 Elo</div></div><div style={S.statItem}><div style={S.statNumber}>{Object.values(gameState.teams).reduce((b, t) => t.streak > b.streak && t.streakType === "W" ? t : b, { streak: 0 }).streak || 0}</div><div style={S.statLabel}>Win Streak</div></div></div>
            <div style={{ marginTop: 12 }}><div style={S.miniLabel}>🔥 Hottest Teams</div>{Object.values(gameState.teams).filter(t => t.streakType === "W" && t.streak >= 3).sort((a, b) => b.streak - a.streak).slice(0, 5).map(t => <div key={t.name} style={S.streakRow}><TeamBadge name={t.name} size={16} /><span style={{ flex: 1, marginLeft: 4 }}>{t.name}</span><span style={S.streakBadge}>W{t.streak}</span></div>)}</div></div>
        </div>}

        {view === "top25" && <div style={S.card}><h3 style={S.cardTitle}>🏆 TOP 25 RANKINGS</h3><div style={S.rankHeader}><span style={{ width: 28 }}>#</span><span style={{ width: 26 }}></span><span style={{ flex: 1 }}>Team</span><span style={{ width: 45 }}>Conf</span><span style={{ width: 46, textAlign: "center" }}>Rec</span><span style={{ width: 40, textAlign: "center" }}>C</span><span style={{ width: 42, textAlign: "right" }}>Elo</span><span style={{ width: 40, textAlign: "right" }}>Rk</span></div>
          {top25.map((t, i) => {
            const rankChange = getTop25RankChange(t.name, i + 1);
            const rankChangeColor = rankChange === "new" ? "#f39c12" : rankChange.startsWith("+") ? "#2ecc71" : rankChange === "0" ? "#666" : "#e74c3c";

            return <div key={t.name} style={{ ...S.rankRowFull, background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}><span style={{ width: 28, fontWeight: 800, color: i < 4 ? "#f1c40f" : "#666", fontSize: i < 4 ? 15 : 12 }}>{i + 1}</span><TeamBadge name={t.name} size={24} /><span style={{ flex: 1, fontWeight: 600, color: "#eee", marginLeft: 5 }}>{t.name}</span><span style={{ width: 45 }}><ConfBadge name={t.conference} size={15} /></span><span style={{ width: 46, textAlign: "center", fontWeight: 700, color: "#eee", fontSize: 12 }}>{t.wins}-{t.losses}</span><span style={{ width: 40, textAlign: "center", fontSize: 10, color: "#999" }}>{t.confWins}-{t.confLosses}</span><span style={{ width: 42, textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#4ecdc4", fontSize: 12 }}>{Math.round(t.elo)}</span><span style={{ width: 40, textAlign: "right", fontSize: 11, color: rankChangeColor, fontWeight: 700 }}>{rankChange}</span></div>;
          })}
        </div>}

        {view === "conference" && <div style={S.conferenceContent}>
          <div style={S.confSelector}>
            <button
              key="Power Conferences"
              style={{ ...S.confChipPower, ...(selectedConf === "Power Conferences" ? S.confChipPowerActive : {}) }}
              onClick={() => setSelectedConf("Power Conferences")}
            >
              <ConfBadge name="Power Conferences" size={13} />
              <span style={{ marginLeft: 3 }}>Power Conferences</span>
            </button>
            {Object.keys(gameState.conferences).sort().map(c => (
              <button key={c} style={{ ...S.confChip, ...(selectedConf === c ? S.confChipActive : {}) }} onClick={() => setSelectedConf(c)}>
                <ConfBadge name={c} size={13} /><span style={{ marginLeft: 3 }}>{c}</span>
              </button>
            ))}
          </div>

          {selectedConf === "Power Conferences" ? (
            <div style={S.powerConfGrid}>{powerConferenceStandings.map(({ conference }) => renderConferencePanel(conference, true))}</div>
          ) : (
            renderConferencePanel(selectedConf)
          )}
        </div>}

        {view === "history" && <div style={S.card}><h3 style={S.cardTitle}>📚 FINAL FOUR HISTORY</h3>{seasonHistory.length === 0 ? <p style={S.emptyText}>No completed seasons yet. Simulate a season to add the first Final Four.</p> : <div style={S.historyTable}><div style={S.historyHeader}><span>Season</span><span>🥇 1st</span><span>🥈 2nd</span><span>3rd</span><span>4th</span></div>{seasonHistory.map(season => <div key={season.season} style={S.historyRow}><span style={S.historySeason}>{season.season}</span>{season.placements.map((entry, idx) => <div key={`${season.season}-${entry.team}-${idx}`} style={S.historyCell}>{idx === 0 && <span style={S.historyMedal}>🥇</span>}{idx === 1 && <span style={S.historyMedal}>🥈</span>}<TeamBadge name={entry.team} size={20} /><div style={S.historyCellBody}><span style={S.historyTeam}>{entry.team}</span><span style={S.historyMeta}>{entry.conference}</span></div><span style={S.historySeed}>#{entry.seed}</span></div>)}</div>)}</div>}</div>}

        {view === "results" && <div>{weekResults.length === 0 ? <div style={S.card}><p style={S.emptyText}>No games yet. Simulate the first week!</p></div> :
          [...weekResults].reverse().map((wk, i) => <div key={i} style={S.card}><h3 style={S.cardTitle}><span style={{ ...S.phaseBadge, background: PHASE_COLORS[wk.phase] || "#e74c3c" }}>{wk.phase}</span>Wk {wk.week} — {wk.results.length} games{wk.upsets.length > 0 && <span style={S.upsetBadge}>🚨 {wk.upsets.length}</span>}</h3>
            {wk.upsets.length > 0 && <div style={S.upsetSection}>{wk.upsets.slice(0, 6).map((g, j) => <div key={j} style={S.gameResult}><TeamBadge name={g.winner} size={18} /><span style={{ color: "#2ecc71", fontWeight: 700, flex: 1 }}>{g.winner}</span><span style={S.score}>{g.homeScore}-{g.awayScore}</span><span style={{ color: "#e74c3c", flex: 1, textAlign: "right" }}>{g.loser}</span><TeamBadge name={g.loser} size={18} /></div>)}</div>}
            <details style={{ marginTop: 8 }}><summary style={S.detailsSummary}>All {wk.results.length} games</summary><div style={S.allGames}>{wk.results.map((g, j) => <div key={j} style={S.gameRow}><TeamBadge name={g.home} size={15} /><span style={{ fontWeight: g.winner === g.home ? 700 : 400, color: g.winner === g.home ? "#eee" : "#555", flex: 1 }}>{g.home}</span><span style={S.gameScore}>{g.homeScore}-{g.awayScore}</span><span style={{ fontWeight: g.winner === g.away ? 700 : 400, color: g.winner === g.away ? "#eee" : "#555", flex: 1, textAlign: "right" }}>{g.away}</span><TeamBadge name={g.away} size={15} />{g.isUpset && <span style={S.upsetTag}>UPSET</span>}</div>)}</div></details>
          </div>)}</div>}

        {view === "bracket" && <div>{!ncaaBracket ? <div style={S.card}><p style={S.emptyText}>Bracket set after Conference Tournaments (Week 19)</p></div> :
          <div><h3 style={{ ...S.cardTitle, marginBottom: 16 }}>🎯 NCAA TOURNAMENT</h3>
            {Object.entries(ncaaBracket.bracket).map(([region, entries]) => <div key={region} style={S.card}><h4 style={S.regionTitle}>{region} Region</h4><div style={S.bracketGrid}>{entries.map((e, i) => { let elim = false, rElim = null; ncaaRoundResults.forEach((rd, ri) => { rd.allGames.forEach(g => { if (g.loser === e.team) { elim = true; rElim = ri; } }); }); return <div key={i} style={{ ...S.bracketEntry, opacity: elim ? 0.35 : 1 }}><span style={S.seedNum}>{e.seed}</span><TeamBadge name={e.team} size={20} /><span style={S.bracketTeam}>{e.team}</span><span style={S.bracketRecord}>{gameState.teams[e.team].wins}-{gameState.teams[e.team].losses}</span>{elim && <span style={S.elimTag}>R{rElim + 1}</span>}</div>; })}</div></div>)}
            {ncaaRoundResults.length > 0 && <div style={S.card}><h4 style={S.regionTitle}>Results</h4>{ncaaRoundResults.map((rd, ri) => <div key={ri} style={{ marginBottom: 16 }}><div style={S.roundLabel}>Round {ri + 1}</div>{rd.allGames.map((g, gi) => <div key={gi} style={S.tourneyGame}>{g.region && <span style={S.regionTag}>{g.region}</span>}<TeamBadge name={g.winner} size={18} /><span style={{ fontWeight: 700, color: "#2ecc71", flex: 1 }}>{g.winner}</span><span style={S.gameScore}>{g.homeScore}-{g.awayScore}</span><span style={{ color: "#e74c3c", flex: 1, textAlign: "right" }}>{g.loser}</span><TeamBadge name={g.loser} size={18} />{g.isUpset && <span style={S.upsetTag}>UPSET!</span>}</div>)}</div>)}</div>}
          </div>}</div>}

      </div>
      <div style={S.footer}><button style={S.resetButton} onClick={startSeason}>🔄 New Season</button></div>
    </div>
  );
}

// ============================================================
// STYLES
// ============================================================
const S = {
  startScreen: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(145deg,#0a0a1a 0%,#1a1a3e 50%,#0a0a1a 100%)", fontFamily: "'Segoe UI',system-ui,sans-serif" },
  startContent: { textAlign: "center", padding: 40 },
  logo: { fontSize: 80, marginBottom: 16, filter: "drop-shadow(0 0 30px rgba(255,165,0,0.5))" },
  startTitle: { fontSize: 44, fontWeight: 900, color: "#fff", letterSpacing: 6, margin: 0, textShadow: "0 0 40px rgba(255,165,0,0.3)" },
  startSubtitle: { fontSize: 16, color: "#f39c12", letterSpacing: 8, marginTop: 8, fontWeight: 300 },
  startInfo: { marginTop: 28, display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" },
  startStat: { color: "#888", fontSize: 13, margin: 0, padding: "6px 14px", border: "1px solid #333", borderRadius: 8 },
  startButton: { marginTop: 36, padding: "14px 44px", fontSize: 16, fontWeight: 700, background: "linear-gradient(135deg,#f39c12,#e67e22)", border: "none", borderRadius: 12, color: "#000", cursor: "pointer", letterSpacing: 2 },
  container: { minHeight: "100vh", background: "#0d0d1a", fontFamily: "'Segoe UI',system-ui,sans-serif", color: "#eee" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", background: "linear-gradient(90deg,#0d0d2b,#1a1a3e)", borderBottom: "1px solid #2a2a4a", flexWrap: "wrap", gap: 10 },
  headerLeft: { display: "flex", alignItems: "center", gap: 10 }, headerLogo: { fontSize: 28 },
  headerTitle: { margin: 0, fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: 2 },
  headerPhase: { margin: 0, fontSize: 11, color: "#f39c12", letterSpacing: 1, marginTop: 2 },
  headerRight: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 },
  weekBadge: { fontSize: 11, color: "#aaa", fontWeight: 600, letterSpacing: 1 },
  progressBar: { width: 180, height: 4, background: "#222", borderRadius: 2, overflow: "hidden" },
  progressFill: { height: "100%", background: "linear-gradient(90deg,#f39c12,#e74c3c)", borderRadius: 2, transition: "width 0.3s ease" },
  championBanner: { display: "flex", alignItems: "center", justifyContent: "center", gap: 14, padding: "18px", background: "linear-gradient(135deg,#f39c12 0%,#e67e22 50%,#d35400 100%)", color: "#000", textAlign: "center", flexWrap: "wrap" },
  trophyIcon: { fontSize: 44 }, championLabel: { fontSize: 11, letterSpacing: 4, fontWeight: 700, opacity: 0.8 },
  championName: { fontSize: 26, fontWeight: 900, letterSpacing: 1 }, championRecord: { fontSize: 12, opacity: 0.8, marginTop: 2 },
  championButton: { padding: "9px 16px", fontSize: 12, fontWeight: 800, background: "rgba(13, 13, 26, 0.9)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 8, color: "#fff", cursor: "pointer" },
  simBar: { display: "flex", gap: 8, padding: "10px 18px", background: "#111122", borderBottom: "1px solid #222" },
  simButton: { flex: 1, padding: "11px 20px", fontSize: 13, fontWeight: 700, background: "linear-gradient(135deg,#27ae60,#2ecc71)", border: "none", borderRadius: 8, color: "#000", cursor: "pointer", letterSpacing: 1 },
  simButtonSmall: { padding: "11px 14px", fontSize: 13, fontWeight: 700, background: "#2a2a4a", border: "1px solid #444", borderRadius: 8, color: "#eee", cursor: "pointer" },
  tabs: { display: "flex", background: "#111122", borderBottom: "1px solid #2a2a4a", overflowX: "auto" },
  tab: { flex: 1, padding: "9px 10px", fontSize: 11, fontWeight: 600, background: "transparent", border: "none", borderBottom: "2px solid transparent", color: "#777", cursor: "pointer", whiteSpace: "nowrap" },
  tabActive: { color: "#f39c12", borderBottomColor: "#f39c12" },
  content: { padding: 14, maxWidth: 880, margin: "0 auto" },
  conferenceContent: { padding: 14, maxWidth: "none", width: "100%", boxSizing: "border-box" },
  dashGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))", gap: 14 },
  card: { background: "#14142a", border: "1px solid #2a2a4a", borderRadius: 12, padding: 14, marginBottom: 10 },
  cardTitle: { margin: "0 0 10px 0", fontSize: 13, fontWeight: 800, color: "#f39c12", letterSpacing: 1, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" },
  rankRow: { display: "flex", alignItems: "center", gap: 5, padding: "4px 0", borderBottom: "1px solid #1a1a3a", fontSize: 12 },
  rankNum: { width: 20, fontWeight: 800, color: "#f39c12", fontSize: 12, textAlign: "center" },
  rankName: { flex: 1, fontWeight: 600, color: "#eee" },
  rankRecord: { width: 34, textAlign: "center", fontWeight: 700, fontSize: 10, color: "#ccc" },
  rankElo: { width: 34, textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#4ecdc4", fontSize: 10 },
  rankHeader: { display: "flex", alignItems: "center", gap: 5, padding: "5px 0", borderBottom: "1px solid #2a2a4a", fontSize: 9, color: "#555", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 },
  rankRowFull: { display: "flex", alignItems: "center", gap: 5, padding: "5px 0", borderBottom: "1px solid #1a1a2e", fontSize: 12 },
  upsetRow: { display: "flex", alignItems: "center", gap: 5, padding: "3px 0", borderBottom: "1px solid #1a1a2e" },
  score: { fontFamily: "monospace", color: "#888", fontSize: 10, minWidth: 42, textAlign: "center" },
  emptyText: { color: "#555", fontSize: 13, textAlign: "center", padding: 18 },
  statGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 },
  statItem: { textAlign: "center", padding: 8, background: "#0d0d1a", borderRadius: 8, border: "1px solid #222" },
  statNumber: { fontSize: 20, fontWeight: 900, color: "#f39c12" },
  statLabel: { fontSize: 8, color: "#666", marginTop: 3, letterSpacing: 1, textTransform: "uppercase" },
  miniLabel: { fontSize: 10, color: "#888", fontWeight: 700, marginBottom: 5, letterSpacing: 1 },
  streakRow: { display: "flex", alignItems: "center", gap: 3, padding: "2px 0", fontSize: 11, color: "#ccc" },
  streakBadge: { background: "#27ae60", color: "#fff", padding: "1px 5px", borderRadius: 4, fontSize: 9, fontWeight: 700 },
  confSelector: { display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 14 },
  confChip: { display: "flex", alignItems: "center", padding: "3px 7px", fontSize: 10, fontWeight: 600, background: "#1a1a3e", border: "1px solid #2a2a4a", borderRadius: 5, color: "#888", cursor: "pointer" },
  confChipActive: { background: "#f39c12", borderColor: "#f39c12", color: "#000" },
  confChipPower: { display: "flex", alignItems: "center", padding: "3px 7px", fontSize: 10, fontWeight: 700, background: "#22144a", border: "1px solid #5b21b6", borderRadius: 5, color: "#c4b5fd", cursor: "pointer" },
  confChipPowerActive: { background: "#7c3aed", borderColor: "#a78bfa", color: "#fff" },
  powerConfGrid: { display: "grid", gridTemplateColumns: "repeat(5, minmax(320px, 360px))", gap: 12, width: "100%", justifyContent: "center", alignItems: "start" },
  historyTable: { display: "flex", flexDirection: "column", gap: 8 },
  historyHeader: { display: "grid", gridTemplateColumns: "70px repeat(4, minmax(0, 1fr))", gap: 8, padding: "0 2px 4px", color: "#888", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1 },
  historyRow: { display: "grid", gridTemplateColumns: "70px repeat(4, minmax(0, 1fr))", gap: 8, alignItems: "stretch" },
  historySeason: { display: "flex", alignItems: "center", justifyContent: "center", background: "#111122", border: "1px solid #2a2a4a", borderRadius: 8, color: "#f39c12", fontWeight: 900, fontSize: 14 },
  historyCell: { display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: "#0d0d1a", border: "1px solid #222", borderRadius: 8 },
  historyMedal: { fontSize: 14, lineHeight: 1 },
  historyCellBody: { display: "flex", flexDirection: "column", minWidth: 0, flex: 1, textAlign: "left" },
  historyTeam: { fontSize: 12, fontWeight: 700, color: "#eee", lineHeight: 1.1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  historyMeta: { fontSize: 9, color: "#777", lineHeight: 1.1, textTransform: "uppercase", letterSpacing: 0.6 },
  historySeed: { fontFamily: "monospace", color: "#f39c12", fontSize: 11, fontWeight: 800, whiteSpace: "nowrap" },
  confChampBanner: { display: "flex", alignItems: "center", gap: 5, padding: "7px 10px", background: "rgba(243,156,18,0.1)", border: "1px solid rgba(243,156,18,0.3)", borderRadius: 8, marginBottom: 10, fontSize: 12, color: "#f39c12" },
  phaseBadge: { display: "inline-block", padding: "2px 7px", borderRadius: 4, fontSize: 9, fontWeight: 700, color: "#fff", letterSpacing: 0.5 },
  upsetBadge: { fontSize: 10, color: "#e74c3c", fontWeight: 700 },
  upsetSection: { padding: "6px 0", borderBottom: "1px solid #222" },
  gameResult: { display: "flex", alignItems: "center", gap: 5, padding: "2px 0", fontSize: 11 },
  detailsSummary: { cursor: "pointer", color: "#666", fontSize: 11, fontWeight: 600 },
  allGames: { maxHeight: 380, overflowY: "auto", marginTop: 6 },
  gameRow: { display: "flex", alignItems: "center", gap: 4, padding: "2px 0", fontSize: 10, borderBottom: "1px solid #111" },
  gameScore: { fontFamily: "monospace", color: "#666", fontSize: 10, minWidth: 42, textAlign: "center" },
  upsetTag: { background: "#e74c3c", color: "#fff", padding: "1px 4px", borderRadius: 3, fontSize: 8, fontWeight: 700, marginLeft: 2 },
  regionTitle: { margin: "0 0 10px 0", fontSize: 15, fontWeight: 800, color: "#fff", letterSpacing: 1 },
  bracketGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: 3 },
  bracketEntry: { display: "flex", alignItems: "center", gap: 5, padding: "3px 5px", background: "#0d0d1a", borderRadius: 4, fontSize: 11, transition: "opacity 0.3s" },
  seedNum: { width: 19, height: 19, display: "flex", alignItems: "center", justifyContent: "center", background: "#f39c12", color: "#000", borderRadius: 4, fontWeight: 900, fontSize: 9 },
  bracketTeam: { flex: 1, fontWeight: 600, color: "#eee", fontSize: 11 },
  bracketRecord: { fontSize: 9, color: "#888" },
  elimTag: { fontSize: 8, color: "#e74c3c", fontWeight: 700, padding: "1px 3px", border: "1px solid #e74c3c", borderRadius: 3 },
  roundLabel: { fontSize: 12, fontWeight: 800, color: "#f39c12", letterSpacing: 1, marginBottom: 5, padding: "3px 0", borderBottom: "1px solid #2a2a4a" },
  tourneyGame: { display: "flex", alignItems: "center", gap: 5, padding: "3px 0", fontSize: 11, borderBottom: "1px solid #111" },
  regionTag: { fontSize: 8, color: "#888", background: "#1a1a3e", padding: "1px 4px", borderRadius: 3, fontWeight: 600, minWidth: 44, textAlign: "center" },
  footer: { padding: "18px", textAlign: "center", borderTop: "1px solid #222" },
  resetButton: { padding: "7px 18px", fontSize: 12, fontWeight: 600, background: "transparent", border: "1px solid #444", borderRadius: 8, color: "#888", cursor: "pointer" },
};
