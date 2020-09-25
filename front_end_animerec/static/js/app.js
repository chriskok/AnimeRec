const sendButton = document.querySelector('#submit');
const animeName = document.querySelector('#selected-title');
const selectedAnime = document.querySelector('#select-anime-from-list')

//You need to put the url to the server here in order, everything else can stay the same
const SERVER_URI = "http://127.0.0.1:5000/";
var names_request_xhttp;
var recommendations_xhttp;

eventListeners();
function eventListeners() {
  document.addEventListener('DOMContentLoaded', appInit);
}

//This function gets the anime names from the server
function getAnimeNames(){
  const URL = SERVER_URI + "get-names";
  names_request_xhttp = new XMLHttpRequest();
  names_request_xhttp.open("GET", URL, true);
  names_request_xhttp.send();
  return names_request_xhttp;
}

// ####### Functions ############
function appInit() {
  sendButton.disabled = true;
  sendButton.classList.add('cursor-not-allowed', 'opacity-50');

  var names = getAnimeNames();
  names.onreadystatechange=(e)=>{
    // populate dropdown
    var select = document.getElementById("anime_names"); 
    var name_list = JSON.parse(names_request_xhttp.responseText)['names'];
    for(var i = 0; i < name_list.length; i++) {
        var opt = name_list[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el);
    }
  }
}

// Validate fields 
animeName.addEventListener('change', validateSubmission);

function validateSubmission(e) {
  var animeList = names_request_xhttp.responseText;
  // console.log(animeList);
  if (e.target.value.length > 0) {
    var isItIn = animeList.includes(e.target.value);

    if (isItIn === true) {
      const error = document.querySelector('p.error');
      if (error) { error.remove() }
      e.target.classList.remove('border', 'border-red-500');
      e.target.classList.add('border', 'border-green-500');
      sendButton.disabled = false;
      sendButton.classList.remove('cursor-not-allowed', 'opacity-50');

      console.log('Coool , Recommend all!');
    } else {
      e.target.classList.remove('border-green-500');
      e.target.classList.add('border-red-500');
      displayError()
    }

  } else {
    displayError()
  }
}

function displayError() {
  const errorMessage = document.createElement('p');
  errorMessage.textContent = 'Please select a name from the list'
  errorMessage.classList.add('border', 'border-red-500',
    'background-color-100', 'text-red-500', 'p-3',
    'mt-5', 'text-center', 'error'
  );
  const errors = document.querySelectorAll('.error');
  if (errors.length === 0) { selectedAnime.appendChild(errorMessage); }


}


//### Send Request

selectedAnime.addEventListener('submit', sendQuery)

function sendQuery(e) {
  e.preventDefault();
  //show spinner
  const spinner = document.querySelector('#spinner');
  spinner.style.display = 'flex';
  console.log('Query Sent');

  setTimeout(() => {
    spinner.style.display = 'none';

    const recommendation = document.createElement('p');
    recommendation.textContent = 'Recommended Item Placeholder'
    recommendation.classList.add('text-center', 'my-10', 'p-2', 'bg-orange-500', 'text-white', 'font-bold');

    selectedAnime.appendChild(recommendation);
  }, 3000);

}

function filterFunction() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("selected-title");
  filter = input.value.toUpperCase();
  div = document.getElementById("spinner"); 
  a = div.getElementsByTagName("a");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}

function getRecommendations(name)
{
  recommendations_xhttp = new XMLHttpRequest();   // new HttpRequest instance   
  const RECOMMENDATIONS_URL = SERVER_URI + "get-recommendations/" + name;
  recommendations_xhttp.open("POST", RECOMMENDATIONS_URL);
  recommendations_xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  recommendations_xhttp.send();  
  return recommendations_xhttp
}

//--------------Here is an example of how to use the function----------------
var n = "one piece";
var recom = getRecommendations(n);

recom.onreadystatechange=(e)=>{
  json_recom = JSON.parse(recom.responseText);
  console.log(json_recom);
}
