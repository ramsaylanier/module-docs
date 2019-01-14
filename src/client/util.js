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
