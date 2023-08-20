import express, { Express } from "express";
import { API } from "../core/api";

export default function init(app: Express, api: API)
{
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.set('view engine', 'pug');
    
    app.get('/', (req, res) => {
        res.render('index', { ledgers: [] });
    });
    
    app.get('/ledger/:ledger', (req, res) => {
        const ledgerName = req.params.ledger;
        res.render('ledger', { ledger: ledgerName });
    });

    app.post('/ledgers/', (req, res) => {
        const { ledgerName } = req.body;
        console.log(ledgerName);
        res.render('ledger_header', { ledger: ledgerName });
    });
}