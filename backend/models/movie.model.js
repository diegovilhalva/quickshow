import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  tmdbId: {
    type: Number,
    required: true,
    unique: true, 
  },
  title: {
    type: String,
    required: true,
  },
  poster: {
    type: String, 
    required: true,
  },
  backdrop: {
    type: String,
  },
  overview: {
    type: String,
  },
  releaseDate: {
    type: String,
  },
  genres: {
    type: [String],
  },
  rating: {
    type: Number,
  },
  runtime: {
    type: Number, 
  },
  language: {
    type: String,
  },
  trailer: {
    type: String,
  },
  isNowShowing: {
    type: Boolean,
    default: false,  
  },
}, {
  timestamps: true,
});

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
