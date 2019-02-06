import React from "react"
import PropTypes from "prop-types"
import styled from "@emotion/styled"
import qs from "query-string"

import { Link } from "react-router-dom"

const ListItem = styled.li({
  alignItems: "center",
  display: "flex",
  justifyContent: "space-between",
  listStyle: "none",
  padding: ".25rem 0",
  "&:not(:last-of-type)": {
    borderBottom: `1px solid #9d0098`
  },
  "& a": {
    color: "var(--accent-color)"
  }
})

const DeleteButton = styled("button")({
  background: "transparent",
  border: "none",
  color: "white",
  cursor: "pointer",
  "& svg": {
    height: 16,
    width: 16,
    fill: "white"
  }
})

const generateUrlSearchParamsString = item => {
  const arr = item.split("/")
  const obj = {
    search: arr[0]
  }
  obj.sub = arr[1] || ""

  return qs.stringify(obj)
}

const SidebarItem = ({ item, allowDelete, handleDelete }) => {
  return (
    <ListItem>
      <Link to={{ pathname: "/", search: generateUrlSearchParamsString(item) }}>
        {item}
      </Link>

      {allowDelete && (
        <DeleteButton onClick={() => handleDelete(item)}>
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            <path d="M0 0h24v24H0z" fill="none" />
          </svg>
        </DeleteButton>
      )}
    </ListItem>
  )
}

SidebarItem.propTypes = {
  item: PropTypes.string.isRequired,
  allowDelete: PropTypes.bool,
  handleDelete: PropTypes.func
}

export default SidebarItem
