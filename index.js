let apiURL = 'https://api.imgflip.com/get_memes'
let localURL = 'http://localhost:3000/memes/'


let likeButton = document.querySelector('.like')
let memeHeader = document.querySelector('h2')
let memeImage = document.querySelector('img')
let body = document.querySelector('body')
let makeAMemeButton = document.querySelector('.makeAMeme')
let memeNameList = document.querySelector('.listOfMemes')
let collapsibleList = document.getElementsByClassName("collapsible");
let memeCanvas = document.querySelector('#memeCanvas') //The first line in the script retrieves the node in the DOM representing the <canvas> element
let memeCTX = memeCanvas.getContext('2d') //access the drawing context using its getContext() method.
let getInput = document.querySelector('#inp')
let savedMemesList = document.querySelector('.listOfSavedMemes')


//gets the 10th meme in the API and loads it on the page on domcontentload
let loadApiImage = () => {
    fetch(apiURL)
    .then(res => res.json())
    .then(element => {
        let firstMeme = element.data.memes[10]
        imageInfo(firstMeme)
    })
}


let imageInfo = (meme) => {
    let memeHeader = document.querySelector('h2')
    let memeImage = document.querySelector('img')

    memeHeader.textContent = meme.name
    memeImage.src = meme.url
    meme.id = meme.id //sets the variable meme id to the api provided meme id. 
}

//gets the meme names in the API and populates them in the collapsible navigation bar
let loadMemeNames = () => {
    fetch(apiURL)
    .then(res => res.json())
    .then(element => element.data.memes.forEach((meme)=>{
        let li = document.createElement('li')
        li.textContent = meme.name
        li.id = meme.name

        memeNameList.append(li)

         //event listener that allows the user to select a meme from the navigation bar
        li.addEventListener('click', () => {    
        memeHeader.textContent = meme.name
        memeImage.src = meme.url
        })
    })
)}


//makes the navigation bar collapsible list
let makeCollapsibleList = () => {
    let i;

for (i = 0; i < collapsibleList.length; i++) {
  collapsibleList[i].addEventListener("click", function() {
    this.classList.toggle("active");
    let content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  })
}}


//sets the canvas height, width, crossOrigin and font using jquery 
memeCanvas.width = $('img').width()
memeCanvas.crossOrigin = "Anonymous"
memeCanvas.height = $('img').height()
memeCTX.drawImage($('img').get(0), 0, 0)
memeCTX.font = "26pt Verdana"


//creates the meme ON INPUT in the input form 
$(document).on('input','#inp', () => {
    //redraw image
    memeCTX.clearRect(0,0,memeCanvas.width,memeCanvas.height);
    memeCTX.drawImage(memeImage, 0, 0); //set all to 0 please 
    //refill text
    memeCTX.fillStyle = "White";
    memeCTX.fillText(getInput.value,40,80)
})


//creates a separate URL of the meme you created 
makeAMemeButton.addEventListener('submit', (e) => {
    e.preventDefault()
    let newImageURL = memeCanvas.toDataURL();
    let newImageName = memeHeader
    fetch(localURL, {
        method: 'POST',
        headers: {'Content-Type' : 'applications/json',
        Accept: 'applications/json'
    },
        body: JSON.stringify({
            "Name" : `${newImageName}`,
            "Image" : `${newImageURL}`,
            "Likes" : 0
        })
    })
    .then(res => res.json())
    .then(() => {

        //SAM YOUR LIKE BUTTON IS HERE

        //creates the like button and corresponding paragraph tag
        let likePhrase = document.createElement('p')
        let likeButton = document.createElement('button')


        likePhrase.id = 'likeParag'
        likeButton.className = 'like'
        likeButton.textContent = 'LIKE'

        savedMemesList.append(likeButton, likePhrase)


        //event listener for the like count
        let likeNumber = 0
        likeButton.addEventListener('click',(e)=>{

        likeNumber = likeNumber+1
        if (likeNumber === 1){
            likePhrase.textContent ='1 like'
        } else {
            likePhrase.textContent = `${likeNumber} likes`
        }
        })
        
        //creates a list element, appends the new image to the saved memes list, clears the submit form and canvas
        let li = document.createElement('li')
        let savedImg = document.createElement('img')
        savedImg.src = newImageURL
        savedImg.style.height = "100px"
        savedImg.style.width = "150px"

        li.append(savedImg)
        savedMemesList.append(li)
        
        makeAMemeButton.reset();
        memeCTX.clearRect(0,0,memeCanvas.width,memeCanvas.height)

    })
})

// //Like button
// fetch (apiURL , {
//   method: "PATCH", 
//   headers: { 'Content-Type': 'application/json'},
//   body: JSON.stringify({
//   likes: updatedLikes
//   })
// })
// .then(res => res.json()
// .then(() => {
//   p.textContent =`${updatedLikes} Likes`,
 
// let likes =0;
// likeButton.addEventListener('click',likeAction)
// function likeAction() {
//   let likedNumber =document.createElement('li')
//   likeCounts.append(likedNumber)
// }

memeCTX.clearRect(0,0,memeCanvas.width,memeCanvas.height);

//DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
  loadApiImage();
  loadMemeNames();
  makeCollapsibleList();
})