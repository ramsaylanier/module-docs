import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { makeStyles } from "@material-ui/styles"
import Prism from "prismjs"

import Markdown from "react-markdown"

const useStyles = makeStyles({
  root: {
    flex: 1,
    height: "100%",
    paddingTop: "4rem",
    overflow: "auto",
    display: "flex"
  },
  wrapper: {
    flex: 1
  },
  source: {
    maxWidth: 800,
    padding: "1rem",
    margin: "0 auto"
  },
  sidebar: {
    backgroundColor: "#14a1b8",
    color: "white",
    height: "100%",
    overflow: "auto",
    padding: "1rem"
  },
  child: {
    padding: ".5rem 0",
    cursor: "pointer",
    "&:not(:last-of-type)": {
      borderBottom: "1px solid white"
    }
  }
})

const Main = ({ readme }) => {
  const [source, setSource] = useState(readme.root.readme.content)
  const classes = useStyles()

  useEffect(() => {
    Prism.highlightAll()
  })

  const handleClick = readme => {
    setSource(readme.content)
  }

  return (
    <div className={classes.root}>
      <div className={classes.sidebar}>
        <ul>
          {readme.root.children.map(child =>
            child.readme ? (
              <li
                className={classes.child}
                onClick={() => handleClick(child.readme)}
              >
                {child.readme.name}
              </li>
            ) : null
          )}
        </ul>
      </div>
      <div className={classes.wrapper}>
        <div className={classes.source}>
          <Markdown source={source} />
        </div>
      </div>
    </div>
  )
}

Main.propTypes = {
  readme: PropTypes.object.isRequired
}

export default Main
