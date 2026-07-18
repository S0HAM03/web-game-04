// Quiz Mania — Question Bank
// 40 questions across 4 categories, 10 each

const QUESTIONS = [
  // ══════════════════════════════════
  // 🎮 VIDEO GAMES (10)
  // ══════════════════════════════════
  {
    category: "Video Games",
    categoryColor: "#00FF66",
    question: "Which game features a battle royale mode called 'Warzone' and is part of the Call of Duty franchise?",
    options: ["Fortnite", "PUBG", "Call of Duty: Warzone", "Apex Legends"],
    correctIndex: 2,
    explanation: "Call of Duty: Warzone is the free-to-play battle royale mode in the CoD franchise, launched in 2020.",
    points: 100
  },
  {
    category: "Video Games",
    categoryColor: "#00FF66",
    question: "In Minecraft, what material is needed to craft a Nether Portal?",
    options: ["Diamond", "Obsidian", "Netherite", "Iron"],
    correctIndex: 1,
    explanation: "Obsidian blocks are required to build a Nether Portal — you need at least 10 to create the frame.",
    points: 100
  },
  {
    category: "Video Games",
    categoryColor: "#00FF66",
    question: "Which company developed the game 'The Legend of Zelda: Breath of the Wild'?",
    options: ["Sony", "Nintendo", "Capcom", "Square Enix"],
    correctIndex: 1,
    explanation: "Nintendo developed Breath of the Wild, released in 2017 alongside the Nintendo Switch launch.",
    points: 100
  },
  {
    category: "Video Games",
    categoryColor: "#00FF66",
    question: "What is the name of the currency used in Fortnite to purchase cosmetics?",
    options: ["Gold Bars", "V-Bucks", "Minecoins", "CoD Points"],
    correctIndex: 1,
    explanation: "V-Bucks (Vindertech Bucks) are Fortnite's premium currency used to buy skins, emotes, and more.",
    points: 100
  },
  {
    category: "Video Games",
    categoryColor: "#00FF66",
    question: "In 'Among Us', what do Impostors do?",
    options: ["Complete tasks to win", "Sabotage and eliminate Crewmates", "Fix the ship", "Vote out other players"],
    correctIndex: 1,
    explanation: "Impostors win by eliminating Crewmates and sabotaging the ship without being voted out.",
    points: 100
  },
  {
    category: "Video Games",
    categoryColor: "#00FF66",
    question: "Which game is known for the phrase 'Do a barrel roll!'?",
    options: ["F-Zero", "Star Fox 64", "Ace Combat", "Sky Force"],
    correctIndex: 1,
    explanation: "Peppy Hare's famous line 'Do a barrel roll!' comes from Star Fox 64, released in 1997.",
    points: 100
  },
  {
    category: "Video Games",
    categoryColor: "#00FF66",
    question: "What is the highest rank achievable in Valorant's competitive mode?",
    options: ["Immortal", "Grandmaster", "Radiant", "Diamond"],
    correctIndex: 2,
    explanation: "Radiant is the highest competitive rank in Valorant, awarded to the top 500 players per region.",
    points: 150
  },
  {
    category: "Video Games",
    categoryColor: "#00FF66",
    question: "Which game franchise features characters like Master Chief and the Covenant?",
    options: ["Destiny", "Halo", "Mass Effect", "Gears of War"],
    correctIndex: 1,
    explanation: "Halo is the iconic franchise featuring Master Chief (Spartan-117) battling the alien alliance known as the Covenant.",
    points: 100
  },
  {
    category: "Video Games",
    categoryColor: "#00FF66",
    question: "In 'God of War' (2018), what is the name of Kratos's son?",
    options: ["Baldur", "Atreus", "Mimir", "Freya"],
    correctIndex: 1,
    explanation: "Atreus, also known by his giant name Loki, is Kratos's son and companion throughout the 2018 God of War game.",
    points: 150
  },
  {
    category: "Video Games",
    categoryColor: "#00FF66",
    question: "Which game has players building settlements and surviving zombie-like creatures called 'Husks' in 'Save the World' mode?",
    options: ["7 Days to Die", "Fortnite", "Dying Light", "Left 4 Dead"],
    correctIndex: 1,
    explanation: "Fortnite: Save the World is the PvE mode where players build forts and defend against Husks.",
    points: 150
  },

  // ══════════════════════════════════
  // 📺 YOUTUBE & CREATORS (10)
  // ══════════════════════════════════
  {
    category: "YouTube & Creators",
    categoryColor: "#FF2A5F",
    question: "Who holds the record for the most YouTube subscribers as an individual creator (as of 2024)?",
    options: ["PewDiePie", "MrBeast", "T-Series", "Cocomelon"],
    correctIndex: 1,
    explanation: "MrBeast (Jimmy Donaldson) surpassed PewDiePie to become the most-subscribed individual creator on YouTube.",
    points: 100
  },
  {
    category: "YouTube & Creators",
    categoryColor: "#FF2A5F",
    question: "What is the real name of the YouTuber known as 'PewDiePie'?",
    options: ["Felix Kjellberg", "Mark Fischbach", "Sean McLoughlin", "Toby Turner"],
    correctIndex: 0,
    explanation: "Felix Arvid Ulf Kjellberg is the Swedish YouTuber known worldwide as PewDiePie.",
    points: 100
  },
  {
    category: "YouTube & Creators",
    categoryColor: "#FF2A5F",
    question: "Which YouTube channel is famous for the 'Rewind' series, ranking the biggest YouTube moments of the year?",
    options: ["YouTube Spotlight", "YouTube Originals", "YouTube Official", "YouTube HQ"],
    correctIndex: 0,
    explanation: "YouTube Rewind was an annual video series by YouTube Spotlight that highlighted top creators and trends — discontinued after 2019.",
    points: 100
  },
  {
    category: "YouTube & Creators",
    categoryColor: "#FF2A5F",
    question: "What challenge did MrBeast complete that involved him counting to 100,000?",
    options: ["100,000 Subscribers Challenge", "Counting to 100k", "He actually counted to 100,000 on video", "100k Giveaway"],
    correctIndex: 2,
    explanation: "MrBeast famously counted from 1 to 100,000 in a 40+ hour video to hit his early milestone.",
    points: 150
  },
  {
    category: "YouTube & Creators",
    categoryColor: "#FF2A5F",
    question: "Which YouTuber is known for the phrase 'Smash that like button' and hosts 5-Minute Crafts-style content?",
    options: ["Dude Perfect", "5-Minute Crafts", "Crafty Panda", "Troom Troom"],
    correctIndex: 1,
    explanation: "5-Minute Crafts is famous for life hacks, DIY projects, and widely mocked 'crafts' with the classic 'Like if you...' call-to-action.",
    points: 100
  },
  {
    category: "YouTube & Creators",
    categoryColor: "#FF2A5F",
    question: "What is the name of Markiplier's real-life charity fundraising events?",
    options: ["Mark's Marathon", "Charity Stream Extravaganza", "A Charity Livestream", "Games for Good"],
    correctIndex: 2,
    explanation: "Markiplier (Mark Fischbach) has hosted multiple 'A Charity Livestream' events raising millions for various causes.",
    points: 150
  },
  {
    category: "YouTube & Creators",
    categoryColor: "#FF2A5F",
    question: "Which YouTube series features youtuber Linus Sebastian reviewing tech products?",
    options: ["Tech Quickie", "Linus Tech Tips", "TechLinked", "Techquickie"],
    correctIndex: 1,
    explanation: "Linus Tech Tips (LTT) is Linus Sebastian's main channel covering PC hardware, reviews, and builds.",
    points: 100
  },
  {
    category: "YouTube & Creators",
    categoryColor: "#FF2A5F",
    question: "What was the most disliked YouTube video of all time before YouTube removed public dislike counts?",
    options: ["Baby Shark", "YouTube Rewind 2018", "Despacito", "Friday by Rebecca Black"],
    correctIndex: 1,
    explanation: "YouTube Rewind 2018 became the most disliked video in YouTube history with over 20 million dislikes before the count was hidden.",
    points: 100
  },
  {
    category: "YouTube & Creators",
    categoryColor: "#FF2A5F",
    question: "CarryMinati is one of India's biggest YouTubers. What is his real name?",
    options: ["Ajey Nagar", "Ashish Chanchlani", "Amit Bhadana", "BB Ki Vines"],
    correctIndex: 0,
    explanation: "Ajey Nagar, known as CarryMinati, is famous for his roast videos and gaming content.",
    points: 100
  },
  {
    category: "YouTube & Creators",
    categoryColor: "#FF2A5F",
    question: "What is the name of Dude Perfect's most famous recurring segment on their channel?",
    options: ["Trick Shot Olympics", "Stereotypes", "Battle Royale", "Overtime"],
    correctIndex: 1,
    explanation: "Dude Perfect's 'Stereotypes' series humorously portrays relatable character types in various sports and situations.",
    points: 150
  },

  // ══════════════════════════════════
  // 🎬 MOVIES (10)
  // ══════════════════════════════════
  {
    category: "Movies",
    categoryColor: "#FFD700",
    question: "Which movie features the famous line: 'Why so serious?'",
    options: ["Batman Begins", "The Dark Knight", "Joker (2019)", "Batman v Superman"],
    correctIndex: 1,
    explanation: "Heath Ledger's iconic portrayal of the Joker in The Dark Knight (2008) gave us this unforgettable line.",
    points: 100
  },
  {
    category: "Movies",
    categoryColor: "#FFD700",
    question: "In 'Avengers: Endgame', who uses the gauntlet to bring back everyone snapped away by Thanos?",
    options: ["Tony Stark", "Bruce Banner / Hulk", "Thor", "Captain America"],
    correctIndex: 1,
    explanation: "Bruce Banner (Smart Hulk) used the Infinity Gauntlet first to reverse Thanos's snap, bringing back everyone.",
    points: 150
  },
  {
    category: "Movies",
    categoryColor: "#FFD700",
    question: "Which animated Pixar movie is set almost entirely in the Land of the Dead?",
    options: ["Soul", "Onward", "Coco", "The Book of Life"],
    correctIndex: 2,
    explanation: "Coco (2017) follows Miguel in the Land of the Dead during Día de los Muertos. It won the Oscar for Best Animated Feature.",
    points: 100
  },
  {
    category: "Movies",
    categoryColor: "#FFD700",
    question: "What is the name of the ship in 'Titanic' (1997)?",
    options: ["Olympic", "Titanic", "Britannic", "Lusitania"],
    correctIndex: 1,
    explanation: "The RMS Titanic is the doomed luxury ocean liner central to James Cameron's 1997 epic romance-disaster film.",
    points: 100
  },
  {
    category: "Movies",
    categoryColor: "#FFD700",
    question: "Which director made the movie 'Inception' (2010)?",
    options: ["Steven Spielberg", "James Cameron", "Christopher Nolan", "Denis Villeneuve"],
    correctIndex: 2,
    explanation: "Christopher Nolan wrote and directed Inception, the mind-bending thriller about dream heists.",
    points: 100
  },
  {
    category: "Movies",
    categoryColor: "#FFD700",
    question: "In 'Spider-Man: No Way Home', how many Spider-Men appear in the film?",
    options: ["1", "2", "3", "4"],
    correctIndex: 2,
    explanation: "Three Spider-Men appear: Tom Holland, Tobey Maguire, and Andrew Garfield — a fan-favorite multiverse team-up.",
    points: 150
  },
  {
    category: "Movies",
    categoryColor: "#FFD700",
    question: "What is the highest-grossing movie of all time (as of 2024)?",
    options: ["Titanic", "Avengers: Endgame", "Avatar", "The Lion King (2019)"],
    correctIndex: 2,
    explanation: "Avatar (2009, re-released 2022) holds the record with over $2.9 billion in global box office revenue.",
    points: 150
  },
  {
    category: "Movies",
    categoryColor: "#FFD700",
    question: "In 'The Lion King', what is Simba's father's name?",
    options: ["Scar", "Mufasa", "Rafiki", "Zazu"],
    correctIndex: 1,
    explanation: "Mufasa is Simba's wise and beloved father, whose death at the hands of Scar drives the story.",
    points: 100
  },
  {
    category: "Movies",
    categoryColor: "#FFD700",
    question: "Which movie features a blue ogre and a talking donkey on an adventure?",
    options: ["Monsters, Inc.", "Shrek", "Bee Movie", "The Boss Baby"],
    correctIndex: 1,
    explanation: "Shrek (2001) features the lovable green ogre Shrek and his companion Donkey, voiced by Eddie Murphy.",
    points: 100
  },
  {
    category: "Movies",
    categoryColor: "#FFD700",
    question: "In 'Interstellar', what does TARS stand for?",
    options: ["Tactical Autonomous Robot System", "Terrestrial Automated Response Station", "It's just a name with no acronym meaning", "Trans-Atmospheric Relay System"],
    correctIndex: 2,
    explanation: "TARS is simply a name — it doesn't officially stand for an acronym in the movie Interstellar (2014).",
    points: 150
  },

  // ══════════════════════════════════
  // 📱 TOP WEB SERIES (10)
  // ══════════════════════════════════
  {
    category: "Top Web Series",
    categoryColor: "#9D00FF",
    question: "In 'Money Heist' (La Casa de Papel), what do all the robbers wear?",
    options: ["Black suits and V masks", "Red jumpsuits and Dalí masks", "Orange jumpsuits and clown masks", "Blue jumpsuits and skull masks"],
    correctIndex: 1,
    explanation: "The iconic red jumpsuits and Salvador Dalí masks became a global symbol of the Spanish Netflix heist series.",
    points: 100
  },
  {
    category: "Top Web Series",
    categoryColor: "#9D00FF",
    question: "In 'Stranger Things', what is the nickname given to the parallel dimension?",
    options: ["The Shadow Realm", "The Upside Down", "The Void", "The Dark Side"],
    correctIndex: 1,
    explanation: "The Upside Down is the terrifying alternate dimension mirroring Hawkins, Indiana — home to the Demogorgon and other creatures.",
    points: 100
  },
  {
    category: "Top Web Series",
    categoryColor: "#9D00FF",
    question: "In 'Squid Game', what is the prize money for winning?",
    options: ["10 billion won", "45.6 billion won", "100 million won", "1 trillion won"],
    correctIndex: 1,
    explanation: "The grand prize in Squid Game is ₩45.6 billion South Korean won — 1 billion won per contestant who dies (456 players).",
    points: 150
  },
  {
    category: "Top Web Series",
    categoryColor: "#9D00FF",
    question: "Who plays Walter White in 'Breaking Bad'?",
    options: ["Bob Odenkirk", "Aaron Paul", "Bryan Cranston", "Dean Norris"],
    correctIndex: 2,
    explanation: "Bryan Cranston plays chemistry teacher-turned-drug kingpin Walter White, winning 4 Emmy Awards for the role.",
    points: 100
  },
  {
    category: "Top Web Series",
    categoryColor: "#9D00FF",
    question: "In 'Game of Thrones', which dragon is killed and resurrected by the Night King?",
    options: ["Drogon", "Rhaegal", "Viserion", "Balerion"],
    correctIndex: 2,
    explanation: "Viserion is killed by the Night King beyond the Wall and resurrected as an ice dragon to destroy the Wall.",
    points: 150
  },
  {
    category: "Top Web Series",
    categoryColor: "#9D00FF",
    question: "In 'The Office' (US), who is the regional manager of Dunder Mifflin Scranton?",
    options: ["Jim Halpert", "Dwight Schrute", "Michael Scott", "Andy Bernard"],
    correctIndex: 2,
    explanation: "Michael Scott, played by Steve Carell, is the bumbling but lovable Regional Manager of Dunder Mifflin's Scranton branch.",
    points: 100
  },
  {
    category: "Top Web Series",
    categoryColor: "#9D00FF",
    question: "What streaming platform originally aired 'The Mandalorian'?",
    options: ["Netflix", "Amazon Prime Video", "HBO Max", "Disney+"],
    correctIndex: 3,
    explanation: "The Mandalorian was a launch title for Disney+, premiering in November 2019 — one of the platform's most popular series.",
    points: 100
  },
  {
    category: "Top Web Series",
    categoryColor: "#9D00FF",
    question: "In 'Dark' (Netflix), what German town is central to the story's time travel mystery?",
    options: ["Frankfurt", "Winden", "Hamburg", "Munich"],
    correctIndex: 1,
    explanation: "Winden is the fictional German town in Netflix's Dark, where four interconnected families navigate time travel across multiple centuries.",
    points: 150
  },
  {
    category: "Top Web Series",
    categoryColor: "#9D00FF",
    question: "Which show features a team of thieves who pull elaborate heists planned by Nora and Charlie Morningstar?",
    options: ["Ocean's Eight", "Hustle", "Lupin", "Leverage: Redemption"],
    correctIndex: 3,
    explanation: "Leverage: Redemption is the reboot of Leverage, featuring grifters, hackers, and thieves working for the greater good.",
    points: 150
  },
  {
    category: "Top Web Series",
    categoryColor: "#9D00FF",
    question: "In 'Sacred Games' (Netflix India), who plays the gangster Ganesh Gaitonde?",
    options: ["Nawazuddin Siddiqui", "Saif Ali Khan", "Pankaj Tripathi", "Rajkummar Rao"],
    correctIndex: 0,
    explanation: "Nawazuddin Siddiqui delivers a powerhouse performance as Mumbai crime lord Ganesh Gaitonde in Netflix India's Sacred Games.",
    points: 150
  }
];

module.exports = { QUESTIONS };
