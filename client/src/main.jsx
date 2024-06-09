import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Theme } from './components/ThemeProvider.js'
import { Box, ThemeProvider } from '@mui/material'
import {persistor, store} from "./redux/store.js"
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <PersistGate loading={null} persistor={persistor}>
  <React.StrictMode>
  <ThemeProvider theme={Theme}>
  <Box bgcolor={'background.default'} color={'text.primary'}>
      <App />
      </Box>
  </ThemeProvider>
  </React.StrictMode>
  </PersistGate>
  </Provider>
)
