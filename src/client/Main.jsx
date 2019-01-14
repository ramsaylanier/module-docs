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
    flex: 1,
    height: "100%",
    overflow: "auto"
  },
  info: {
    margin: "1rem 0",
    "& ul": {
      listStyle: "none",
      padding: 0,
      margin: 0,
      display: "flex",
      alignItem: "center"
    },
    "& li": {
      marginRight: "1rem",
      color: "#93158e"
    },
    "& a": {
      background: "#93158e",
      padding: ".5rem",
      color: "white",
      borderRadius: 3
    }
  },
  source: {
    maxWidth: 800,
    padding: "0rem 1rem",
    margin: "0 auto"
  },
  sidebar: {
    backgroundColor: "#14a1b8",
    color: "white",
    height: "100%",
    overflow: "auto",
    padding: "1rem",
    "& ul": {
      padding: 0,
      margin: 0
    },
    "& li": {
      listStyle: "none"
    }
  },
  child: {
    padding: ".5rem 0",
    cursor: "pointer",
    "&:not(:last-of-type)": {
      borderBottom: "1px solid white"
    }
  }
})

const Main = ({ pkg }) => {
  const [source, setSource] = useState(pkg.content)
  const [info, setInfo] = useState(JSON.parse(pkg.info))
  const classes = useStyles()

  useEffect(() => {
    Prism.highlightAll()
  })

  useEffect(
    () => {
      setSource(pkg.content)
      setInfo(JSON.parse(pkg.info))
    },
    [pkg]
  )

  const handleClick = child => {
    setSource(child.content)
    setInfo(JSON.parse(child.info))
  }

  return (
    <div className={classes.root}>
      <div className={classes.sidebar}>
        <ul>
          {pkg.children.map(
            child =>
              child.name && (
                <li
                  key={child.name}
                  className={classes.child}
                  onClick={() => handleClick(child)}
                >
                  {child.name}
                </li>
              )
          )}
        </ul>
      </div>
      <div className={classes.wrapper}>
        <div className={classes.source}>
          {info && (
            <div className={classes.info}>
              <ul>
                {info.homepage && (
                  <li>
                    <a href={info.homepage}>Homepage</a>
                  </li>
                )}

                {info.version && (
                  <li>
                    version: <strong>{info.version}</strong>
                  </li>
                )}
              </ul>
            </div>
          )}
          {source && <Markdown source={source} />}
        </div>
      </div>
    </div>
  )
}

Main.propTypes = {
  pkg: PropTypes.object.isRequired
}

export default Main
