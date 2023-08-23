import express, { Express } from "express";
import { API } from "../core/api";
import { ServerLedger } from "../core/server_ledger";
import { CommitDiffT, CommitProposalT } from "../../schema/bimrepo";

function RenderLedger(ledger: ServerLedger)
{
    return { name: ledger.GetName(), head: ledger.GetHead() };
}

function DiffToString(diff: CommitDiffT)
{
    return `${diff.updatedComponents.length} / ${diff.updatedSchemas.length}`; 
}

function RenderCommit(commit: CommitProposalT)
{
    return { message: commit.message, author: commit.author, diffString: DiffToString(commit.diff!) };
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
    
    app.get('/ledger/:ledger/head', (req, res) => {
        const ledgerName = req.params.ledger;
        let ledger = api.GetLedger(ledgerName);

        if (!ledger) 
        {
            res.status(404);
            res.end();
        }
        else
        {
            res.send(`${ledger.GetHead()}`);
        }
    });

    app.get('/ledger/:ledger/commit/latest', (req, res) => {
        const ledgerName = req.params.ledger;
        let ledger = api.GetLedger(ledgerName);

        if (!ledger) 
        {
            res.status(404);
            res.end();
        }
        else
        {
            let commits = ledger.GetCommits(10).map(RenderCommit);
            res.render('commit_list', { commits });
        }
    });

    app.post('/ledgers/', (req, res) => {
        const { ledgerName } = req.body;
        let ledger = RenderLedger(api.AddLedger(ledgerName));
        res.render('ledger_header', { ledger });
    });
}