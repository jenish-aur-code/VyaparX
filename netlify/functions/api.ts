import serverless from 'serverless-http';
import { apiApp } from '../../server/app.js';

export const handler = serverless(apiApp);

