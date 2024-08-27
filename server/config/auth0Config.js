import {auth} from 'express-oauth2-jwt-bearer'

const jwtCheck = auth({
    audience: "https://gest-impact.vercel.app",
    issuerBaseURL: "https://dev-cqql7al3sgqoz008.us.auth0.com",
    tokenSigningAlg: "RS256"
})

export default jwtCheck