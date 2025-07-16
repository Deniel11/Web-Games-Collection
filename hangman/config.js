const alphabet = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 
    'H', 'I', 'J', 'K', 'L', 'M', 'N', 
    'O', 'P', 'Q', 'R', 'S', 'T', 'U', 
    'V', 'W', 'X', 'Y', 'Z'
];

const alphabetRegex = /^[A-Za-z\s]+$/;

const maxMistakes = 11;

const categories = {
    "Culture and Society": [
        "tradition", "custom", "holiday", "religion", "language",
        "culture", "myth", "heritage", "theatre", "literature",
        "dance", "music", "art", "film", "story",
        "hero", "community", "civilization", "socialism", "capitalism",
        "modernism", "postmodernism", "multiculturalism", "ethics", "aesthetics",
        "psychology", "sociology", "anthropology", "philosophy", "politics"
    ],
    "Animals": [
        "lion", "tiger", "elephant", "zebra", "giraffe",
        "crocodile", "frog", "lake", "bird", "fish",
        "panda", "bison", "fox", "wolf", "bear",
        "owl", "cat", "dog", "horse", "pig",
        "cow", "goat", "sheep", "rabbit",
        "ant", "bee", "spider", "snail", "cricket"
    ],
    "Plants": [
        "tree", "bush", "flower", "grass", "spring",
        "autumn", "winter", "summer", "fruit", "vegetable",
        "leaf", "root", "shoot", "seed", "cactus",
        "bamboo", "cedar", "oak", "pine", "eucalyptus",
        "rose", "lily", "tulip", "sunflower", "hibiscus",
        "ivy", "willow", "rosehip", "cherry", "apple tree"
    ],
    "Art": [
        "painting", "sculpture", "drawing", "graphic", "photo",
        "museum", "exhibition", "gallery", "performance", "theatre",
        "dance", "music", "text", "choreography", "plastic art",
        "installation", "cinema", "animation", "filmmaker", "fine arts",
        "literature", "design", "architecture", "creativity", "composition",
        "style", "tradition", "modernism", "abstract"
    ],
    "Science": [
        "biology", "physics", "chemistry", "mathematics", "astrophysics",
        "genetics", "ecology", "neurology", "psychology", "history",
        "geology", "meteorology", "sociology", "anthropology", "geography",
        "biochemistry", "molecular", "biotechnology", "electricity", "programming",
        "technology", "informatics", "robotics", "statistics",
        "experiment", "hypothesis", "theory", "objective"
    ],
    "Geography and Astronomy": [
        "continent", "country", "city", "lake", "river",
        "mountain", "desert", "forest", "island", "map",
        "climate", "weather", "wind", "temperature", "star",
        "planet", "galaxy", "universe", "sun", "moon",
        "earth", "atmosphere", "satellite", "cartography", "sea", "ocean"
    ],
    "Literature and Grammar": [
        "novel", "short story", "poem", "drama", "writer",
        "poet", "fairy tale", "text", "character", "plot",
        "style", "language", "grammar", "vocabulary", "sentence",
        "word", "expression", "rhyme", "subject", "predicate",
        "image", "metaphor", "meaning", "expression", "topic",
        "content", "chapter", "translation", "interpretation", "criticism"
    ],
    "History": [
        "age", "war", "peace", "civilization", "division",
        "society", "power", "monarchy", "republic", "revolution",
        "discovery", "historical", "ruler", "culture", "custom",
        "religion", "language", "civilians", "general", "knight",
        "representative", "government", "alliance", "freedom", "law",
        "interest", "morality", "tradition", "law", "politics"
    ],
    "Cinema and Film": [
        "film", "actor", "actress", "director", "screenplay",
        "scene", "cut", "music", "cinema", "comic",
        "animation", "documentary", "drama", "comedy", "action",
        "fantasy", "science", "horror", "thriller", "sci-fi",
        "fine arts", "film festival", "award", "review", "rating",
        "studio", "camera movement", "cast", "production"
    ],
    "TV": [
        "series", "show", "reality", "comedy", "drama",
        "news", "scientific", "quiz", "film", "sports",
        "society", "culture", "cartoon", "animation", "historical",
        "romantic", "horror", "thriller", "cable", "streaming",
        "television", "channel", "entertainment", "advertisement", "film industry",
        "actors", "director", "script", "topics"
    ],
    "Music": [
        "song", "musician", "music", "lyrics", "score",
        "genre", "concert", "instruments", "tone", "rhythm",
        "melody", "harmony", "band", "performance", "composer",
        "album", "studio", "producer", "recording", "sound",
        "hit", "clip", "gig", "songwriting", "creativity"
    ],
    "Sports": [
        "football", "basketball", "tennis", "swimming", "cycling",
        "rugby", "hockey", "athletics", "wrestling", "discipline",
        "team", "competition", "tactic", "training", "fan",
        "championship", "result", "final", "success", "match",
        "athlete", "coach", "event", "rule", "player",
        "technique", "sportsmanship", "fight", "victory", "defeat"
    ],
    "Transport and Vehicles": [
        "car", "bus", "train", "plane", "ship",
        "motorcycle", "bicycle", "trolleybus", "steering", "vehicle",
        "traffic", "driver", "passenger", "stop", "transport",
        "map", "route", "timetable", "queue", "parking",
        "rental", "ticket", "bus station", "railway station", "air traffic",
        "highway", "intersection", "speed", "direction"
    ],
    "Home and Shopping": [
        "home", "flat", "house", "furniture", "bed",
        "table", "chair", "wardrobe", "kitchen", "bathroom",
        "shopping", "store", "goods", "delicacy", "market",
        "hypermarket", "supermarket", "rental", "stock", "price",
        "discount", "coupon", "product", "gift", "appliance",
        "household", "kitchen", "cleaner", "furniture store", "interior"
    ],
    "Food and Drinks": [
        "bread", "cheese", "milk", "egg", "meat",
        "fish", "fruit", "vegetable", "dessert", "ice cream",
        "cake", "soup", "salad", "drink", "coffee",
        "tea", "beer", "wine", "soda", "snack",
        "breakfast", "lunch", "dinner", "spice", "sauce",
        "cooking", "baking", "grilling", "yeast", "organic"
    ],
    "Other": [
        "mobile phone", "computer", "internet", "app", "technology",
        "programming", "code", "algorithm", "security", "network",
        "entertainment", "game", "creativity", "method", "training",
        "work", "vocational", "practice", "development", "intelligence",
        "skill", "goal", "knowledge", "profession", "future",
        "regulation", "evaluation", "problem", "solution", "impact"
    ]
};