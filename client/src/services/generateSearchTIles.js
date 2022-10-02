import React from 'react'
import PremiereTile from '../components/PremiereTile'
import ActorTile from '../components/ActorTile'
import FilmTile from '../components/FilmTile'
import SeriesTile from '../components/SeriesTile'

export default function generateFilmSmallTiles(array, path) {
  let components = {
    film: FilmTile,
    serial: SeriesTile,
    premiera: PremiereTile,
    aktor: ActorTile
  }
  let Component = components[path]
  return array.map(el => {
    return (
      <Component
        path={path}
        {...el}>
      </Component>
    )
  })
}