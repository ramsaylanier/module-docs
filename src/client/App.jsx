import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { makeStyles } from "@material-ui/styles"
import styled from "@emotion/styled"
import { withRouter } from "react-router-dom"
import { getModules, getPackage, addToFavorites } from "./util.js"
import qs from "query-string"

import Autosuggest from "react-autosuggest"
import Sidebar from "./components/sidebar"
import Main from "./Main"

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
    color: "var(--accent-color)",
    padding: ".5rem"
  },
  suggestionsContainer: {
    maxHeight: 300,
    width: "100%",
    overflow: "auto",
    background: "var(--dark-color)"
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
      borderBottom: "1px solid var(--accent-color)"
    }
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none"
  },
  suggestionHighlighted: {
    color: "white"
  },
  wrapper: {
    maxWidth: 800,
    marginLeft: "auto",
    marginRight: "auto"
  }
})

const Header = styled("header")({
  alignItems: "center",
  background: "var(--dark-color)",
  color: "var(--accent-color)",
  display: "flex",
  justifyContent: "center",
  padding: "1rem",
  position: "fixed",
  left: 0,
  top: 0,
  width: "100%",
  height: "4rem"
})

const Wrapper = styled("div")({
  alignItems: "center",
  display: "flex",
  position: "relative",
  maxWidth: 500,
  marginLeft: "auto",
  marginRight: "auto",
  width: "100%"
})

const FavoriteButton = styled("button")({
  appearance: "none",
  background: "transparent",
  border: "1px solid var(--accent-color)",
  borderRadius: 3,
  color: "white",
  cursor: "pointer",
  marginLeft: "1rem",
  padding: ".5rem 1rem",
  "&:hover": {
    background: "var(--accent-color)",
    color: "var(--dark-color)"
  }
})

const Body = styled("div")({
  display: "flex",
  height: "100vh"
})

const App = props => {
  const [val, setVal] = useState("")
  const [config, setConfig] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [modules, setModules] = useState([])
  const [module, setModule] = useState(null)
  const [pkg, setPkg] = useState("")
  const classes = useStyles()

  useEffect(() => {
    loadApp()
  }, [])

  useEffect(
    () => {
      const result = modules.find(m => m === val)
      if (result) {
        setModule(result)
      }
    },
    [modules, val]
  )

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
      module && loadReadme()
    },
    [module]
  )

  const loadApp = async () => {
    const { files: modules, config } = await getModules()

    setModules(modules)
    setConfig(config)
    loadModule()
  }

  const loadModule = () => {
    if (modules.length === 0) return
    const result = modules.find(m => m === val)
    if (result) {
      setModule(result)
    }
  }

  const loadReadme = async () => {
    try {
      const pkg = await getPackage(module)
      setPkg(pkg)
    } catch (err) {
      console.log(err)
    }
  }

  const handleChange = (e, { newValue }) => {
    props.history.push({ pathname: "/", search: `search=${newValue}` })
    setVal(newValue)
  }

  const handleClick = async e => {
    addToFavorites(module)
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
          />
          <FavoriteButton onClick={handleClick}>Favorite</FavoriteButton>
        </Wrapper>
      </Header>
      <Body>
        <Sidebar config={config} />
        {pkg && <Main pkg={pkg} />}
      </Body>
    </div>
  )
}

App.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
}

export default withRouter(App)
