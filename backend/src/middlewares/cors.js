/**
 * Proyecto Software
 * 2025
 * @author Diego Vallespin & Hatim Bajji
 */
import cors from 'cors'

const ACCEPTED_ORIGINS = [
    'http://155.210.71.196:3000',
    'http://localhost:3000',
    'http://localhost:1234'
  ]

  export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
    origin: (origin, callback) => {
      if (acceptedOrigins.includes(origin) || !origin) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true, 
    allowedHeaders: ['Content-Type', 'Authorization'],
    })