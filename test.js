// import jwtDecode from 'jwt-decode';
// import { XeroClient } from 'xero-node'
require('dotenv').config()
const jwtDecode = require('jwt-decode')
const { XeroClient } = require('xero-node')


const xero = new XeroClient({
  clientId: process.env.XERO_CLIENT_ID,
  clientSecret: process.env.XERO_CLIENT_SECRET,
  grantType: 'client_credentials',
})


async function run(){
  const tokenSet = await xero.getClientCredentialsToken()
  const decodedAccessToken = jwtDecode(tokenSet.access_token)
  debugger
}

run()
