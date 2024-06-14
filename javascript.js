"use strict";

document.addEventListener("DOMContentLoaded", function() {
  var calculateButton = document.getElementById("calculateButton");

  if (calculateButton) {
    calculateButton.addEventListener("click", function(event) {
      event.preventDefault();

      var isValid = validateForm();

      if (isValid) {
        calculateSolar();
      } else {
        var modal = document.getElementById("myModal");
        modal.style.display = "block";

        var closeButton = document.getElementsByClassName("close")[0];
        closeButton.onclick = function() {
          modal.style.display = "none";
        };

        window.onclick = function(event) {
          if (event.target == modal) {
            modal.style.display = "none";
          }
        };
      }
    });
  }
});

function validateForm() {
    var form = document.forms["solarForm"];
    var inputs = form.querySelectorAll("input[required], select[required]");
    var isValid = true;
  
    inputs.forEach(function(input) {
      if (!input.value.trim()) {
        isValid = false;
        input.classList.add("error");
        input.placeholder = "Required";
    
      } else {
        input.classList.remove("error");
        input.placeholder = "";
      }
    });
  
    return isValid;
  }
  

function calculateSolar() {
  var dailyUseKw = addMonths('mpc');
  var sunHoursPerDay = sunHours();
  var minKwNeeds = dailyUseKw / sunHoursPerDay;
  var realKwNeeds = minKwNeeds * 1.25;
  var realWattNeeds = realKwNeeds * 1000;
  var panelInfo = calculatePanel();
  var panelOutput = panelInfo[0];
  var panelName = panelInfo[1];
  var panelsNeeded = Math.ceil(realWattNeeds / panelOutput);

  var feedback = "";
  feedback += "<p>Based on your average daily use of " + Math.round(dailyUseKw) + " kWh you will need to purchase " + panelsNeeded + " " + panelName + " solar panels to offset 100% of your electricity bill</p>";
  feedback += "<h2>Additional Details</h2>";
  feedback += "<p>Your average daily electricity consumption: " + Math.round(dailyUseKw) + " Kwh per day.</p>";
  feedback += "<p>Average sunshine hours per day: " + sunHoursPerDay + " hours</p>";
  feedback += "<p>Realistic watts needed per hour: " + Math.round(realWattNeeds) + " watts/hour.</p>";
  feedback += "<p>The " + panelName + " panel you selected generates about " + panelOutput + " watts per day.</p>";

  document.getElementById('feedback').innerHTML = feedback;
}

function addMonths(elem) {
  var annualUseKw = 0,
      i = 0,
      x = 0;
  var months = document.getElementById(elem).getElementsByTagName('input');
  for (i = 0; i < months.length; i++) {
    x = Number(months[i].value);
    annualUseKw += x;
  }
  var dailyUseKw = annualUseKw / 365;
  return dailyUseKw;
}

function sunHours() {
  var hrs;
  var theZone = document.forms.solarForm.zone.selectedIndex;
  theZone += 1;
  switch (theZone) {
    case 1:
      hrs = 6;
      break;
    case 2:
      hrs = 5.5;
      break;
    case 3:
      hrs = 5;
      break;
    case 4:
      hrs = 4.5;
      break;
    case 5:
      hrs = 4.2;
      break;
    case 6:
      hrs = 3.5;
      break;
    default:
      hrs = 0;
  }
  return hrs;
}

function calculatePanel() {
  var userChoice = document.forms.solarForm.panel.selectedIndex;
  var panelOptions = document.forms.solarForm.panel.options;
  var power = panelOptions[userChoice].value;
  var name = panelOptions[userChoice].text;
  var x = [power, name];
  return x;
}
