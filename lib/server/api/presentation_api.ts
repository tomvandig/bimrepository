import express, { Express } from "express";
import { API } from "../core/api";
import { ServerLedger } from "../core/server_ledger";

function RenderLedger(ledger: ServerLedger)
{
    return { name: ledger.GetName(), head: ledger.GetHead() };
}

export default function init(app: Express, api: API)
{
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.set('view engine', 'pug');
    
    app.get('/', (req, res) => {
        let ledgers = api.GetLedgers().map(RenderLedger) 

        res.render('index', { ledgers });
    });
    
    app.get('/ledger/:ledger', (req, res) => {
        const ledgerName = req.params.ledger;
        let ledger = api.GetLedger(ledgerName);

        if (!ledger) 
        {
            res.status(404);
            res.end();
        }
        else
        {
            res.render('ledger', { ledger: RenderLedger(ledger) });
        }
    });

    app.post('/ledgers/', (req, res) => {
        const { ledgerName } = req.body;
        let ledger = RenderLedger(api.AddLedger(ledgerName));
        res.render('ledger_header', { ledger });
    });
}