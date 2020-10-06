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
  // const URL = SERVER_URI + "get-names";
  const URL = "get-names";
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
  names.onreadystatechange = function () {
    if (names.readyState === 4) {
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
}

function requestRecommendations(name)
{
  recommendations_xhttp = new XMLHttpRequest();   // new HttpRequest instance   
  const RECOMMENDATIONS_URL = "get-recommendations/" + name;
  // const RECOMMENDATIONS_URL = SERVER_URI + "get-recommendations/" + name;
  recommendations_xhttp.open("POST", RECOMMENDATIONS_URL);
  recommendations_xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  recommendations_xhttp.send();  
  return recommendations_xhttp
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

// Function to remove element by class name
function removeElement(class_name) {
  var elements = document.getElementsByClassName(class_name);
  while (elements[0]) {
      elements[0].parentNode.removeChild(elements[0]);
  }
}

function rateRecs(query, rec, rating, button_id){
  console.log(query + " -> " + rec + " = " + rating + " (1 = like, 0 = dislike)");

  // if rating is 1 = like, 0 = dislike
  gtag('event', query, {
    'event_category' : 'rec_rating',
    'event_label' : rec,
    'value': rating
  });

  // disable buttons once one is chosen
  var likebtn = document.getElementById("likebtn-" + button_id);
  likebtn.disabled = true;
  likebtn.classList.remove("hover:bg-green-700");
  likebtn.classList.add("opacity-75");

  var dislikebtn = document.getElementById("dislikebtn-" + button_id);
  dislikebtn.disabled = true;
  dislikebtn.classList.remove("hover:bg-red-700");
  dislikebtn.classList.add("opacity-75");
}

//### Send Request

document.getElementById("submit").addEventListener('click', sendQuery)

function sendQuery(e) {
  e.preventDefault();
  //show spinner
  // const spinner = document.querySelector('#spinner');
  // spinner.style.display = 'flex';

  var chosen_anime = document.getElementById("selected-title").value;
  console.log('Query Sent: ' + chosen_anime);
  var current_recom = requestRecommendations(chosen_anime);
  
  gtag('event', 'search', {
    'event_label' : chosen_anime
  });

  current_recom.onreadystatechange = function () {
    // ready state 'complete = 4'
    // without checking it will run multiple times for multiple ready states
    if (current_recom.readyState === 4) {
      var json_recom = JSON.parse(current_recom.responseText);
      var recom_dict = json_recom["recommendations"][chosen_anime];
      removeElement("recommendation"); // remove all preexisting recommendations

      for (var key in recom_dict) {
        // check if the property/key is defined in the object itself, not in parent
        if (recom_dict.hasOwnProperty(key)) { 
          
          individual_rec_dict = recom_dict[key];
          console.log(key, recom_dict[key]);

          const recommendation = document.createElement('div');
          const animeTitle = individual_rec_dict['full_title']; // Here goes the recommended title
          const animeDescription = individual_rec_dict['synopsis']; // Here goes the recommended title
          const animeImage = individual_rec_dict['image_url'];
          recommendation.className = "recommendation"
          recommendation.innerHTML = 
          `
          <div class="md:flex mb-4">
            <div class="recommendation-picture md:w-1/6">
              <img src=` + animeImage +  `>
            </div>
            <div class="main-topic md:w-4/6">
              <div class="recommendation-text">
                <h5><u>` + animeTitle + `</u></h5>
                <p>` + animeDescription + `</p>
              </div>
            </div>
            <div class="button-div md:w-1/6">
              <button type="button" id="likebtn-` + key + `" class="block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center" onclick="rateRecs('` + chosen_anime + `','` + animeTitle + `',1, '` + key + `')">
                <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z"/></svg>
                Like
              </button>
              <button type="button" id="dislikebtn-` + key + `" class="block bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded inline-flex items-center" onclick="rateRecs('` + chosen_anime + `','` + animeTitle + `',0, '` + key + `')">
                <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M15.898,4.045c-0.271-0.272-0.713-0.272-0.986,0l-4.71,4.711L5.493,4.045c-0.272-0.272-0.714-0.272-0.986,0s-0.272,0.714,0,0.986l4.709,4.711l-4.71,4.711c-0.272,0.271-0.272,0.713,0,0.986c0.136,0.136,0.314,0.203,0.492,0.203c0.179,0,0.357-0.067,0.493-0.203l4.711-4.711l4.71,4.711c0.137,0.136,0.314,0.203,0.494,0.203c0.178,0,0.355-0.067,0.492-0.203c0.273-0.273,0.273-0.715,0-0.986l-4.711-4.711l4.711-4.711C16.172,4.759,16.172,4.317,15.898,4.045z"/></svg>
                Dislike 
              </button>
            </div>
          </div>
          `
          // recommendation.textContent = individual_rec_dict['full_title'] + ": " + individual_rec_dict['synopsis'] 
          recommendation.classList.add('text-left', 'my-10', 'p-2', 'bg-orange-500', 'text-white', 'font-bold');

          selectedAnime.appendChild(recommendation);
        }
      }
    }
  }

  // setTimeout(() => {
  //   spinner.style.display = 'none';

  //   const recommendation = document.createElement('p');
  //   recommendation.textContent = 'Recommended Item Placeholder'
  //   recommendation.classList.add('text-center', 'my-10', 'p-2', 'bg-orange-500', 'text-white', 'font-bold');

  //   selectedAnime.appendChild(recommendation);
  // }, 3000);

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


//--------------Here is an example of how to use the function----------------
// var n = "one piece";
// var recom = requestRecommendations(n);

// recom.onreadystatechange = function () {
//   // ready state 'complete = 4'
//   // without checking it will run multiple times for multiple ready states
//   if (recom.readyState === 4) {
//     json_recom = JSON.parse(recom.responseText);
//     console.log(json_recom);
//   }
// }
