import express from 'express';

export const router = express.Router();

/**
 * https://merchants.fortumo.com/integration-and-testing/web/payment-result-processing/
 */
router.get('/payment', (req, res) => {
    const service_id =  req.query.service_id;
    const cuid =        req.query.cuid;
    const operation_reference = 
                        req.query.operation_reference;
    const price =       req.query.price;
    const price_wo_vat =req.query.price_wo_vat;
    const revenue =     req.query.revenue;
    const currency =    req.query.currency;
    const amount =      req.query.amount;
    const sender =      req.query.sender;
    const country =     req.query.country;
    const operator =    req.query.operator;
    const payment_id =  req.query.payment_id;
    const status =      req.query.status;
    const user_share =  req.query.user_share;
    const sig =         req.query.sig;
    const test =        req.query.test;
    res.sendStatus(200);
});