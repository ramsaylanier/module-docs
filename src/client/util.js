import { get, set } from "idb-keyval"

export const getModules = async () => {
  try {
    const response = await fetch("http://localhost:4444/modules", {
      method: "POST"
    })
    const data = await response.json()
    return data
  } catch (err) {
    console.log(err)
  }
}

export const getPackage = async module => {
  try {
    const response = await fetch(`http://localhost:4444/module/${module}`, {
      method: "POST"
    })
    const { pkg } = await response.json()
    return pkg
  } catch (err) {
    console.log(err)
  }
}

const getFavs = async () => {
  const favs = await get("favorites")
  return favs || new Set([])
}

export const addToFavorites = async module => {
  const favs = await getFavs()
  favs.add(module)
  set("favorites", favs)
  return favs
}

export const removeFromFavorites = async module => {
  const favs = await getFavs()
  favs.delete(module)
  set("favorites", favs)
  return favs
}

export const loadFavoritesIntoMemory = async favorites => {
  const favs = await getFavs()
  favorites.forEach(fav => favs.add(fav))
  set("favorites", favs)
  return favs
}
