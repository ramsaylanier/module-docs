import React from "react"
import PropTypes from "prop-types"
import styled from "@emotion/styled"

import SidebarItem from "./sidebarItem"

import { removeFromFavorites } from "../util"

const Container = styled.div({
  padding: "1rem",
  background: "var(--secondary-color)",
  marginBottom: "1rem"
})

const List = styled.ul({
  padding: 0,
  margin: 0
})

const Title = styled.p({
  fontSize: "1.1em"
})

const SidebarList = ({ title, items, allowDelete, updateItems }) => {
  const handleDelete = item => {
    removeFromFavorites(item)
    updateItems(items.filter(i => i !== item))
  }
  return (
    <Container>
      <Title>{title}</Title>
      <nav>
        <List>
          {items.map(item => (
            <SidebarItem
              key={item}
              item={item}
              allowDelete={allowDelete}
              handleDelete={handleDelete}
            />
          ))}
        </List>
      </nav>
    </Container>
  )
}

SidebarList.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.array,
  allowDelete: PropTypes.bool,
  updateItems: PropTypes.func
}

export default SidebarList
