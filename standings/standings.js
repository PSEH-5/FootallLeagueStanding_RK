const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const request = require('request');

const port = process.argv.slice(2)[0];
const app = express();
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

var standingJSON = [];

app.get('/countries', (req, res) => {
    var url = "https://apiv2.apifootball.com/?action=get_countries&APIkey=9bb66184e0c8145384fd2cc0f7b914ada57b4e8fd2e4d6d586adcc27c257a978";
    request(url, function(err, resp, body) {
        res.send(JSON.parse(body));
    });
});

app.get('/leagues/**', (req, res) => {
    const countryId = parseInt(req.params[0])
    var url = `https://apiv2.apifootball.com/?action=get_leagues&country_id=${countryId}&APIkey=9bb66184e0c8145384fd2cc0f7b914ada57b4e8fd2e4d6d586adcc27c257a978`;
    request(url, function(err, resp, body) {
        res.status(202).header({Location: `http://localhost:${port}/leagues/${countryId}`}).send(JSON.parse(body));
    });
});

app.get('/teams/**', (req, res) => {
    const leagueId = parseInt(req.params[0])
    var url = `https://apiv2.apifootball.com/?action=get_teams&league_id=${leagueId}&APIkey=9bb66184e0c8145384fd2cc0f7b914ada57b4e8fd2e4d6d586adcc27c257a978`;
    request(url, function(err, resp, body) {
        res.status(202).header({Location: `http://localhost:${port}/teams/${leagueId}`}).send(JSON.parse(body));
    });
});

app.get('/standing/**', (req, res) => {
    const leagueId = parseInt(req.params[0]);
    var url = `https://apiv2.apifootball.com/?action=get_standings&league_id=${leagueId}&APIkey=9bb66184e0c8145384fd2cc0f7b914ada57b4e8fd2e4d6d586adcc27c257a978`;
    request(url, function(err, resp, body) {
        standingJSON = JSON.parse(body);
        var teamIds = standingJSON.map(function(ele) { return ele.team_id;});
        const teamId = parseInt(req.query.teamId);
        const foundTeam = standingJSON.find(ele => ele.team_id == teamId);
    
        if (foundTeam) {
            for (let attribute in foundTeam) {
                if (req.body[attribute]) {
                    foundTeam[attribute] = req.body[attribute];
                }
            }
            res.status(202).header({Location: `http://localhost:${port}/standing/${leagueId}`}).send(foundTeam);
        } else {
            console.log(`Team not found.`);
            res.status(404).send();
        }
    });
});

  
app.listen(port);
