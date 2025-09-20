export interface Movies {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}

export interface Persons {
  page: number
  results: Person[]
  total_pages: number
  total_results: number
}

export interface Shows {
  page: number
  results: Show[]
  total_pages: number
  total_results: number
}

export interface Movie {
  backdrop_path: string
  id: number
  title: string
  original_title: string
  overview: string
  poster_path: string
  media_type: string
  adult: boolean
  original_language: string
  genre_ids: number[]
  popularity: number
  release_date: string
  video: boolean
  vote_average: number
  vote_count: number
}

export interface Show {
  backdrop_path: string
  id: number
  name: string
  original_name: string
  overview: string
  poster_path: string
  media_type: string
  adult: boolean
  original_language: string
  genre_ids: number[]
  popularity: number
  first_air_date: string
  vote_average: number
  vote_count: number
  origin_country: string[]
}


export interface Person {
  adult: boolean
  gender: number
  id: number
  known_for_department: string
  name: string
  original_name: string
  popularity: number
  profile_path: string
  media_type: string
  known_for: KnownFor[]
}

export interface PersonDetails extends Person {
  also_known_as: string[]
  biography: string
  birthday: string
  deathday?: string | null
  place_of_birth: string
  imdb_id: string
}

export interface KnownFor extends Movie {
  name?: string
  original_name?: string
  first_air_date?: string
  origin_country?: string[]
}

export interface MovieDetails {
  adult: boolean
  backdrop_path: string
  // belongs_to_collection: any
  budget: number
  genres: Genre[]
  homepage: string
  id: number
  imdb_id: string
  origin_country: string[]
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  release_date: string
  revenue: number
  runtime: number
  spoken_languages: SpokenLanguage[]
  status: string
  tagline: string
  title: string
  video: boolean
  vote_average: number
  vote_count: number
}

export interface Genre {
  id: number
  name: string
}

export interface ProductionCompany {
  id: number
  logo_path?: string
  name: string
  origin_country: string
}

export interface ProductionCountry {
  iso_3166_1: string
  name: string
}

export interface SpokenLanguage {
  english_name: string
  iso_639_1: string
  name: string
}

export interface Images {
  backdrops: Image[]
  id: number
  logos: Image[]
  posters: Image[]
}

export interface Image {
  aspect_ratio: number
  height: number
  iso_639_1?: string
  file_path: string
  vote_average: number
  vote_count: number
  width: number
}

export interface Videos {
  id: number
  results: Video[]
}

export interface Video {
  iso_639_1: string
  iso_3166_1: string
  name: string
  key: string
  site: string
  size: number
  type: string
  official: boolean
  published_at: string
  id: string
}

export interface Credits {
  id: number
  cast: Cast[]
  crew: Crew[]
}

export interface Cast {
  adult: boolean
  gender: number
  id: number
  known_for_department: string
  name: string
  original_name: string
  popularity: number
  profile_path?: string
  cast_id: number
  character: string
  credit_id: string
  order: number
}

export interface ShowDetails {
  adult: boolean
  backdrop_path: string
  created_by: CreatedBy[]
  episode_run_time: null
  first_air_date: string
  genres: Genre[]
  homepage: string
  id: number
  in_production: boolean
  languages: string[]
  last_air_date: string
  last_episode_to_air: LastEpisodeToAir
  name: string
  next_episode_to_air: NextEpisodeToAir
  networks: Network[]
  number_of_episodes: number
  number_of_seasons: number
  origin_country: string[]
  original_language: string
  original_name: string
  overview: string
  popularity: number
  poster_path: string
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  seasons: Season[]
  spoken_languages: SpokenLanguage[]
  status: string
  tagline: string
  type: string
  vote_average: number
  vote_count: number
}

export interface CreatedBy {
  id: number
  credit_id: string
  name: string
  original_name: string
  gender: number
  profile_path: string
}

export interface LastEpisodeToAir {
  id: number
  name: string
  overview: string
  vote_average: number
  vote_count: number
  air_date: string
  episode_number: number
  episode_type: string
  production_code: string
  runtime: number
  season_number: number
  show_id: number
  still_path: string
}

export interface NextEpisodeToAir {
  id: number
  name: string
  overview: string
  vote_average: number
  vote_count: number
  air_date: string
  episode_number: number
  episode_type: string
  production_code: string
  runtime: number
  season_number: number
  show_id: number
  still_path: string
}

export interface Network {
  id: number
  logo_path: string
  name: string
  origin_country: string
}


export interface Season {
  air_date: string
  episode_count: number
  id: number
  name: string
  overview: string
  poster_path?: string
  season_number: number
  vote_average: number
}

export type ResultTypes = {
  endpoint: string
  display: string
  mediaType: string
}[]

export type SearchResultsType<T> = {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};

// Define the type for the search data
export interface SearchContextProps {
  searchResults: SearchResultsType<Movie | Show | Person>;
  query: string;
  slug: string;
  page: string;
}

export interface Cast_Credits {
  adult: boolean
  backdrop_path?: string
  genre_ids: number[]
  id: number
  original_language: string
  original_title?: string
  overview: string
  popularity: number
  poster_path?: string
  release_date?: string
  title?: string
  video?: boolean
  vote_average: number
  vote_count: number
  character: string
  credit_id: string
  order?: number
  media_type: "movie" | "tv"
  origin_country?: string[]
  original_name?: string
  first_air_date?: string
  name?: string
  episode_count?: number
}


export interface Crew {
  adult: boolean
  backdrop_path?: string
  genre_ids: number[]
  id: number
  original_language: string
  original_title?: string
  overview: string
  popularity: number
  poster_path?: string
  release_date?: string
  title?: string
  video?: boolean
  vote_average: number
  vote_count: number
  credit_id: string
  department: string
  job: string
  media_type: string
  origin_country?: string[]
  original_name?: string
  first_air_date?: string
  name?: string
  episode_count?: number
}
export interface CombinedCredits {
  cast: Cast_Credits[]
  crew: Crew[]
  id: number
}