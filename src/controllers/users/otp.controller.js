import express from 'express';
import { sendOtpCode } from '../../services/users/otp.service.js';

import { sendOtpValidator } from '../../validator/otp.validator.js';

const otp = express.Router();

otp.post('/send', [
    sendOtpValidator
], (req, res, next) => {
    return sendOtpCode(req.body).then(result => {
      res.status(200).json(result);
    }).catch(next);
  });

export function initOtpController(app) {
  app.use('/api/otp', otp );
}