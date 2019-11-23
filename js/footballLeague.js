$(document).ready(function(){
    $.ajax({url: "http://localhost:8081/countries",
    beforeSend: function(){
        $('#loader').show();
    },
    complete: function(){
        $('#loader').hide();
    },
    success: function(result){
        var select = document.getElementById("countrySelector");
        console.log(result);
        var options = result;
        for(var i = 0; i < options.length; i++) {
            var opt = options[i];
            var el = document.createElement("option");
            el.textContent = opt.country_name;
            el.value = opt.country_id;
            select.appendChild(el);
        }
    }});

    $("#countrySelector").change(function() {
        console.log("value "+ this.value);
        $.ajax({url: `http://localhost:8081/leagues/${this.value}`, 
        beforeSend: function(){
            $('#loader').show();
        },
        complete: function(){
            $('#loader').hide();
        },
        success: function(result){
            var select = document.getElementById("leagueSelector");
            $("#leagueSelector").empty().append('<option selected="true" disabled="disabled">Choose a league</option>');
            console.log(result);
            var options = result;
            for(var i = 0; i < options.length; i++) {
                var opt = options[i];
                var el = document.createElement("option");
                el.textContent = opt.league_name;
                el.value = opt.league_id;
                select.appendChild(el);
            }
        }});
    });

    $("#leagueSelector").change(function() {
        console.log("value "+ this.value);
        $.ajax({url: `http://localhost:8081/teams/${this.value}`, 
        beforeSend: function(){
            $('#loader').show();
        },
        complete: function(){
            $('#loader').hide();
        },
        success: function(result){
            var select = document.getElementById("teamSelector");
            $("#teamSelector").empty().append('<option selected="true" disabled="disabled">Choose a team</option>');
            console.log(result);
            var options = result;
            for(var i = 0; i < options.length; i++) {
                var opt = options[i];
                var el = document.createElement("option");
                el.textContent = opt.team_name;
                el.value = opt.team_key;
                select.appendChild(el);
            }
        }});
    });

    $("#teamSelector").change(function() {
        console.log("value "+ this.value);
        var leagueId = $("#leagueSelector").val();
        $.ajax({url: `http://localhost:8081/standing/${leagueId}?teamId=${this.value}`, 
        beforeSend: function(){
            $('#loader').show();
        },
        complete: function(){
            $('#loader').hide();
        },
        success: function(result){
            console.log(result);
            $("#result").html("Overall standing position of this team is " + result.overall_league_position);
        }});
    });

});