import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import styled from "@emotion/styled"

import SidebarList from "./sidebarList"

import { getRootPackageFile, loadFavoritesIntoMemory } from "../util.js"
import sortBy from "lodash/sortBy"

const Sidebar = styled("div")({
  padding: "4rem 1rem 1rem 1rem",
  background: "var(--dark-color)",
  color: "var(--accent-color)",
  maxWidth: 250,
  overflowY: "auto"
})

const AppSidebar = ({ config }) => {
  const [favorites, setFavorites] = useState([])
  const [dependencies, setDependencies] = useState([])
  const [devDependencies, setDevDependencies] = useState([])

  const hydrate = async () => {
    const { dependencies, devDependencies } = await getRootPackageFile()
    const favorites = await loadFavoritesIntoMemory(
      (config && config.favorites) || []
    )

    favorites && setFavorites(Array.from(favorites))
    dependencies && setDependencies(Object.keys(dependencies))
    devDependencies && setDevDependencies(Object.keys(devDependencies))
  }

  useEffect(() => {
    hydrate()
  }, [])

  return (
    <Sidebar>
      {favorites && (
        <SidebarList
          items={sortBy(favorites)}
          title="Favorites"
          allowDelete={true}
          updateItems={setFavorites}
        />
      )}
      {dependencies.length > 0 && (
        <SidebarList items={dependencies} title="Dependencies" />
      )}
      {devDependencies.length > 0 && (
        <SidebarList items={devDependencies} title="DevDependencies" />
      )}
    </Sidebar>
  )
}

AppSidebar.propTypes = {
  config: PropTypes.object
}

export default AppSidebar
