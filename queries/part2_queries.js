use("spotify");

print("===Частина 2. Завдання 1. Треки для вечірки ===");

const partyTracks = db.tracks.find(
  {
    "audio_features.danceability": { $gt: 0.7 },
    "audio_features.energy": { $gt: 0.7 },
    duration_ms: { $gte: 180000, $lte: 300000 }
  },
  {
    _id: 0,
    track_name: 1,
    artists: 1,
    album_name: 1,
    duration_ms: 1,
    "audio_features.danceability": 1,
    "audio_features.energy": 1
  }
).limit(10);

partyTracks.forEach(printjson);

print("\n===Частина 2. Завдання 2. Виконавці, у яких усі треки популярні ===");

const popularArtists = db.tracks.aggregate([
  {
    $unwind: "$artists"
  },
  {
    $group: {
      _id: "$artists",
      track_count: { $sum: 1 },
      min_popularity: { $min: "$popularity" },
      avg_popularity: { $avg: "$popularity" }
    }
  },
  {
    $match: {
      track_count: { $gte: 3 },
      min_popularity: { $gte: 60 }
    }
  },
  {
    $project: {
      _id: 0,
      artist: "$_id",
      track_count: 1,
      min_popularity: { $round: ["$min_popularity", 1] },
      avg_popularity: { $round: ["$avg_popularity", 1] }
    }
  },
  {
    $sort: {
      avg_popularity: -1,
      min_popularity: -1,
      track_count: -1
    }
  },
  {
    $limit: 20
  }
]);

popularArtists.forEach(printjson);

print("\n=== Частина 2. Завдання 3. Нетипові треки ===");

const tempoOutliers = db.tracks.aggregate([
  {
    $group: {
      _id: "$track_genre",
      avg_tempo_raw: { $avg: "$audio_features.tempo" },
      std_tempo: { $stdDevPop: "$audio_features.tempo" },
      tracks: {
        $push: {
          _id: "$_id",
          track_name: "$track_name",
          popularity: "$popularity",
          artists: "$artists",
          audio_features: {
            tempo: "$audio_features.tempo"
          }
        }
      }
    }
  },
  {
    $addFields: {
      outlier_threshold_raw: {
        $add: [
          "$avg_tempo_raw",
          { $multiply: [2, "$std_tempo"] }
        ]
      }
    }
  },
  {
    $project: {
      _id: 0,
      genre: "$_id",
      avg_tempo: { $round: ["$avg_tempo_raw", 1] },
      outlier_threshold: { $round: ["$outlier_threshold_raw", 1] },
      outlier_tracks: {
        $filter: {
          input: "$tracks",
          as: "track",
          cond: {
            $gt: [
              "$$track.audio_features.tempo",
              "$outlier_threshold_raw"
            ]
          }
        }
      }
    }
  },
  {
    $match: {
      "outlier_tracks.0": { $exists: true }
    }
  },
  {
    $sort: {
      genre: 1
    }
  }
]);

tempoOutliers.forEach(printjson);

print("\n=== Частина 2. Завдання 4. Треки для фонової роботи ===");

const backgroundWorkTracks = db.tracks.find(
  {
    "audio_features.loudness": { $lt: -10 },
    "audio_features.speechiness": { $lt: 0.1 },
    "audio_features.instrumentalness": { $gt: 0.5 },
    explicit: false
  },
  {
    _id: 0,
    track_name: 1,
    artists: 1,
    album_name: 1,
    track_genre: 1,
    explicit: 1,
    "audio_features.loudness": 1,
    "audio_features.speechiness": 1,
    "audio_features.instrumentalness": 1
  }
).limit(10);

backgroundWorkTracks.forEach(printjson);