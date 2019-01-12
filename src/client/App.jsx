import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { makeStyles } from "@material-ui/styles"
import { css } from "@emotion/core"
import styled from "@emotion/styled"
import { withRouter, Link } from "react-router-dom"
import { getModules, getReadme } from "./util.js"
import qs from "query-string"
import Prism from "prismjs"

import Autosuggest from "react-autosuggest"
import Markdown from "react-markdown"

const dark = "#380436"
const accent = "#a4f87f"

const wrapper = css`
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`

const useStyles = makeStyles({
  container: {
    position: "relative",
    width: "100%"
  },
  input: {
    width: "100%",
    background: "transparent",
    borderWidth: "0 0 1px 0",
    borderColor: "currentColor",
    borderStyle: "solid",
    color: accent,
    padding: ".5rem"
  },
  suggestionsContainer: {
    maxHeight: 300,
    width: "100%",
    overflow: "auto",
    background: dark
  },
  suggestionsContainerOpen: {
    position: "absolute",
    padding: "1rem",
    zIndex: 100000
  },
  suggestion: {
    display: "block",
    padding: ".5rem 0",
    cursor: "pointer",
    "&:not(:last-of-type)": {
      borderBottom: `1px solid ${accent}`
    }
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none"
  },
  suggestionHighlighted: {
    color: "white"
  }
})

const Header = styled("header")({
  alignItems: "center",
  background: dark,
  color: accent,
  display: "flex",
  justifyContent: "center",
  padding: "1rem",
  position: "fixed",
  left: 0,
  top: 0,
  width: "100%"
})

const Wrapper = styled("div")({
  position: "relative",
  maxWidth: 300,
  marginLeft: "auto",
  marginRight: "auto",
  width: "100%"
})

const Body = styled("div")({
  display: "flex",
  height: "100vh"
})

const Sidebar = styled("div")({
  padding: "6rem 1rem 1rem 1rem",
  background: dark,
  color: accent,
  "& p, & a": {
    color: accent,
    margin: 0
  }
})

const Main = styled("div")({
  flex: 1,
  height: "100%",
  paddingTop: "5rem",
  overflow: "auto"
})

const App = props => {
  const [val, setVal] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [modules, setModules] = useState([])
  const [module, setModule] = useState(null)
  const [readme, setReadme] = useState("")
  const [favorites, setFavorites] = useState([])
  const classes = useStyles()

  const loadModules = async () => {
    const { files: modules, config } = await getModules()
    setFavorites(config.favorites)
    setModules(modules)
    loadReadme()
  }

  const loadReadme = () => {
    if (modules.length === 0) return
    const result = modules.find(m => m === val)

    if (result) {
      setModule(result)
    }
  }

  useEffect(() => {
    loadModules()
  }, [])

  useEffect(
    () => {
      loadReadme()
    },
    [modules, val]
  )

  useEffect(() => {
    Prism.highlightAll()
  })

  // set input val on mount if there is search query param
  useEffect(
    () => {
      const { search } = qs.parse(props.location.search)
      search && setVal(search)
    },
    [props.location.search]
  )

  useEffect(
    () => {
      if (module) {
        try {
          getReadme(module).then(({ readme }) => {
            setReadme(readme)
          })
        } catch (err) {
          console.log(err)
        }
      }
    },
    [module]
  )

  const handleChange = (e, { newValue }) => {
    props.history.push({ pathname: "/", search: `search=${newValue}` })
    setVal(newValue)
  }

  const getSuggestions = value => {
    const inputValue = value.trim().toLowerCase()
    const inputLength = inputValue.length
    return inputLength === 0
      ? []
      : modules.filter(m => m.indexOf(inputValue) !== -1)
  }

  const getSuggestionValue = suggestion => suggestion
  const renderSuggestion = suggestion => {
    return <div>{suggestion}</div>
  }
  const inputProps = {
    placeholder: "Search by package name",
    value: val,
    onChange: handleChange
  }

  const theme = {
    container: classes.container,
    input: classes.input,
    suggestionsContainer: classes.suggestionsContainer,
    suggestionsContainerOpen: classes.suggestionsContainerOpen,
    suggestionsList: classes.suggestionsList,
    suggestion: classes.suggestion,
    suggestionHighlighted: classes.suggestionHighlighted
  }

  return (
    <div>
      <Header>
        <Wrapper>
          <Autosuggest
            theme={theme}
            suggestions={suggestions}
            onSuggestionsFetchRequested={({ value }) =>
              setSuggestions(getSuggestions(value))
            }
            onSuggestionsClearRequested={() => setSuggestions([])}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
            // highlightFirstSuggestion={true}
          />
        </Wrapper>
      </Header>
      <Body>
        <Sidebar>
          {favorites && (
            <nav>
              <p>Favorites:</p>
              <ul>
                {favorites.map(f => (
                  <li key={f}>
                    <Link
                      key={f}
                      to={{ pathname: "/", search: `?search=${f}` }}
                    >
                      {f}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </Sidebar>
        <Main>
          {module && (
            <div css={wrapper}>
              <Markdown source={readme} />
            </div>
          )}
        </Main>
      </Body>
    </div>
  )
}

App.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
}

export default withRouter(App)
