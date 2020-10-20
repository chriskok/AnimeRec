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

function rateRecs(query, rec, rating, rec_type, button_id){
  console.log(query + " -> " + rec + " = " + rating + " (1 = like, 0 = dislike)");

  // if rating is 1 = like, 0 = dislike
  gtag('event', query, {
    'event_category' : 'rec_rating',
    'event_label' : rec_type + ";" + rec,
    'value': rating
  });

  // disable buttons once one is chosen
  var likebtn = document.getElementById("likebtn-" + rec_type  + "-" + button_id);
  likebtn.disabled = true;
  likebtn.classList.remove("hover:bg-green-700");
  likebtn.classList.add("opacity-75");

  var dislikebtn = document.getElementById("dislikebtn-" + rec_type  + "-" + button_id);
  dislikebtn.disabled = true;
  dislikebtn.classList.remove("hover:bg-red-700");
  dislikebtn.classList.add("opacity-75");
}

function addTitle(rec_type){
  const title = document.createElement('h4');
  title.className = "recommendation_row_title"
  title.classList.add('font-sans', 'font-bold', "text-center");

  var html_fill = rec_type;
  switch(rec_type) {
    case "hot":
      html_fill = "Newest and Most Similar"
      break;
    case "beloved":
      html_fill = "Popular and Most Similar"
      break;
    case "similarly_described":
      html_fill = "Similar Reviews"
      break;
    case "similar_synopsis":
      html_fill = "Similar Plot"
      break;
    default:
      // do nothing
  }
  title.innerHTML = html_fill;

  selectedAnime.appendChild(title);
}

document.getElementById("submit").addEventListener('click', sendQuery);
var REC_DICT = {};  // global dictionary for current recommendations

// Function to send query and process results
function sendQuery(e) {
  e.preventDefault();

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
      REC_DICT = json_recom;
      console.log(json_recom);
      removeElement("recommendation_row"); // remove all preexisting recommendations
      removeElement("recommendation_row_title"); // remove all preexisting recommendations
          
      // Go over each type of recommendation
      for (var type in json_recom) {
        // check if the property/key is defined in the object itself, not in parent
        if (json_recom.hasOwnProperty(type)) { 

          addTitle(type);

          var recom_dict = json_recom[type];

          // Create the row for the recommendations to fall under
          const recommendation_row = document.createElement('div');
          recommendation_row.className = "recommendation_row"
          recommendation_row.classList.add('text-left', 'mb-5', 'p-2', 'bg-orange-500', 'text-white', 'font-semibold', 'flex');
          
          // Go over each anime list for the particular type of recommendation
          for (var curr_key in recom_dict) {
            if (recom_dict.hasOwnProperty(curr_key)) { 
              individual_rec_dict = recom_dict[curr_key];

              // Create the containers for each individual anime recommendation
              const recommendation = document.createElement('div');
              const animeTitle = individual_rec_dict['full_title']; 
              const animeImage = individual_rec_dict['image_url'];
              recommendation.className = "recommendation"
              recommendation.classList.add("container", "relative", "flex-initial", "recommendation-container");
              recommendation.innerHTML = 
              `
                <div class="recommendation-picture cursor-pointer mb-4">
                  <img class="max-h-full" src="` + animeImage +  `" onclick="fillModal('` + type + `', ` + curr_key + `)">
                </div>
                <div class="mx-2 text-center text-base lg:text-lg">
                  ` + animeTitle + `
                </div>
                <div class="h-10"></div>
                <div class="absolute inset-x-0 bottom-0 button-div mb-4 ">
                  <button type="button" id="likebtn-` + type + `-` + curr_key + `" class="block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center" onclick="rateRecs('` + chosen_anime + `','` + animeTitle + `',1, '` + type + `','` + curr_key + `')">
                    <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z"/></svg>
                    Like
                  </button>
                  <button type="button" id="dislikebtn-` + type + `-` + curr_key + `" class="block bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded inline-flex items-center" onclick="rateRecs('` + chosen_anime + `','` + animeTitle + `',0, '` + type + `','` + curr_key + `')">
                    <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M15.898,4.045c-0.271-0.272-0.713-0.272-0.986,0l-4.71,4.711L5.493,4.045c-0.272-0.272-0.714-0.272-0.986,0s-0.272,0.714,0,0.986l4.709,4.711l-4.71,4.711c-0.272,0.271-0.272,0.713,0,0.986c0.136,0.136,0.314,0.203,0.492,0.203c0.179,0,0.357-0.067,0.493-0.203l4.711-4.711l4.71,4.711c0.137,0.136,0.314,0.203,0.494,0.203c0.178,0,0.355-0.067,0.492-0.203c0.273-0.273,0.273-0.715,0-0.986l-4.711-4.711l4.711-4.711C16.172,4.759,16.172,4.317,15.898,4.045z"/></svg>
                    Dislike 
                  </button>
                </div>
              `

              recommendation_row.appendChild(recommendation);
            }
          }

          selectedAnime.appendChild(recommendation_row);
        }
      }
    }
  }

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

// MODAL FUNCTIONS
function fillModal(type, key){
  var current_dict = REC_DICT[type][key];
  document.getElementById("modal-title").innerHTML = current_dict['full_title'];
  document.getElementById("modal-synopsis").innerHTML = "<b>Synopsis:</b> " + current_dict['synopsis'] + "\n";
  document.getElementById("modal-score").innerHTML = "<b>Score:</b> " + current_dict['score'] + "\n";
  document.getElementById("modal-type").innerHTML = "<b>Type:</b> " + current_dict['type'] + "\n";
  document.getElementById("modal-release").innerHTML = "<b>Premiered:</b> " + current_dict['premiered'] + "\n";
  document.getElementById("modal-link").innerHTML = "<b>Read More:</b> <a class=\"text-orange-400\" href=\"https://myanimelist.net/anime/" + current_dict['code'] + "\" target=\"_blank\">MyAnimeList</a>  \n";
  toggleModal()
}

var openmodal = document.querySelectorAll('.modal-open')
for (var i = 0; i < openmodal.length; i++) {
  openmodal[i].addEventListener('click', function(event){
    event.preventDefault()
    toggleModal()
  })
}

const overlay = document.querySelector('.modal-overlay')
overlay.addEventListener('click', toggleModal)

var closemodal = document.querySelectorAll('.modal-close')
for (var i = 0; i < closemodal.length; i++) {
  closemodal[i].addEventListener('click', toggleModal)
}

document.onkeydown = function(evt) {
  evt = evt || window.event
  var isEscape = false
  if ("key" in evt) {
    sEscape = (evt.key === "Escape" || evt.key === "Esc")
  } else {
    isEscape = (evt.keyCode === 27)
  }
  if (isEscape && document.body.classList.contains('modal-active')) {
    toggleModal()
  }
};


function toggleModal () {
  const body = document.querySelector('body')
  const modal = document.querySelector('.modal')
  modal.classList.toggle('opacity-0')
  modal.classList.toggle('pointer-events-none')
  body.classList.toggle('modal-active')
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
