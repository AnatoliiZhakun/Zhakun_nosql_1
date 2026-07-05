use("spotify");

print("=== Частина 4. Завдання 1. Аналіз запиту та індексація ===");

const query = {
  track_genre: "pop",
  "audio_features.danceability": { $gte: 0.7 }
};

const sort = {
  popularity: -1
};

print("\n--- 1. Explain ДО створення індексу ---");

printjson(
  db.tracks.find(query)
    .sort(sort)
    .explain("executionStats")
);

print("\n--- 2. Створення індексу ---");

db.tracks.createIndex({
  track_genre: 1,
  "audio_features.danceability": 1,
  popularity: -1
});

printjson(db.tracks.getIndexes());

print("\n--- 3. Explain ПІСЛЯ створення індексу ---");

printjson(
  db.tracks.find(query)
    .sort(sort)
    .explain("executionStats")
);


print("\n=== Частина 4. Завдання 2. Індекс для музики для роботи ===");

const workMusicQuery = {
  "audio_features.instrumentalness": { $gt: 0.5 },
  "audio_features.speechiness": { $lt: 0.1 },
  explicit: false
};

print("\n--- 1. Explain ДО створення індексу ---");

printjson(
  db.tracks.find(workMusicQuery)
    .explain("executionStats")
);

print("\n--- 2. Створення складеного індексу ---");

db.tracks.createIndex({
  explicit: 1,
  "audio_features.instrumentalness": 1,
  "audio_features.speechiness": 1
});

printjson(db.tracks.getIndexes());

print("\n--- 3. Explain ПІСЛЯ створення індексу ---");

printjson(
  db.tracks.find(workMusicQuery)
    .explain("executionStats")
);