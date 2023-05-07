DROP TABLE IF EXISTS newMovie;


CREATE TABLE IF NOT EXISTS newMovie(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
   release_date VARCHAR(255),
    poster_path VARCHAR(255),
    overview VARCHAR(255)
  
);