import React from 'react'
import FilmTile from '../components/FilmTile'

export default function generateFilmSmallTiles(array, path) {
    return array.map(el => {
      // Pass the params from the specified database as props (_id, duration, rating, premiere, thumbnail, shortDescription, longDescription, photos in FilmSmallTile case) to any component
      return (
        <FilmTile
            path={path}
          // DATA FROM DATABASE MAPPED TO PROPS
            key={el._id} _id={el._id}
            name={el.name}
            categories = {el.categories}
            rating={el.rating}
            premiere={el.premiere}
            thumbnail={el.thumbnail}
            shortDescription={el.shortDescription}
            longDescription={el.longDescription}
            photos={el.photos}>
        </FilmTile>
      )
    })
  }