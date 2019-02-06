import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { makeStyles } from "@material-ui/styles"
import { Link, withRouter } from "react-router-dom"
import Prism from "prismjs"
import qs from "query-string"

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
    maxWidth: 250,
    "& ul": {
      padding: 0,
      margin: 0
    },
    "& li": {
      padding: ".5rem 1rem",
      listStyle: "none"
    },
    "& a": {
      color: "white"
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

const Main = ({ pkg, location }) => {
  const [source, setSource] = useState(pkg.content)
  const [info, setInfo] = useState(JSON.parse(pkg.info))
  const classes = useStyles()

  useEffect(() => {
    Prism.highlightAll()
  })

  useEffect(
    () => {
      const { sub } = qs.parse(location.search)
      if (sub) {
        const child = pkg.children.find(child => child.name === sub)
        if (child) {
          setSource(child.content)
        }
      } else {
        setSource(pkg.content)
      }
      setInfo(JSON.parse(pkg.info))
    },
    [pkg, location]
  )

  const generateSearchParams = child => {
    const search = qs.parse(location.search)
    search.sub = child.name
    return qs.stringify(search)
  }

  return (
    <div className={classes.root}>
      {pkg.children && (
        <div className={classes.sidebar}>
          <ul>
            {pkg.children.map(
              child =>
                child.name && (
                  <li key={child.name} className={classes.child}>
                    <Link
                      to={{
                        pathname: "/",
                        search: generateSearchParams(child)
                      }}
                    >
                      {child.name}
                    </Link>
                  </li>
                )
            )}
          </ul>
        </div>
      )}
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
          {source && <Markdown source={source} escapeHtml={false} />}
        </div>
      </div>
    </div>
  )
}

Main.propTypes = {
  pkg: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
}

export default withRouter(Main)
