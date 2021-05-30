let apiURL = 'https://api.imgflip.com/get_memes'


let memeHeader = document.querySelector('h2')
let memeImage = document.querySelector('img')
let body = document.querySelector('body')
let makeAMemeButton = document.querySelector('.makeAMeme')
let memeNameList = document.querySelector('.listOfMemes')
let collapsibleList = document.getElementsByClassName("collapsible");
let memeCanvas = document.querySelector('#memeCanvas') //The first line in the script retrieves the node in the DOM representing the <canvas> element
let memeCTX = memeCanvas.getContext('2d') //access the drawing context using its getContext() method.
let getInput = document.querySelector('#inp')

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
        console.log('you clicked on a meme in the list?')       
        memeHeader.textContent = meme.name
        memeImage.src = meme.url

            })
        })
    )
}


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
  });
}
}

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
    memeCTX.drawImage($('img').get(0), 0,100);
    //refill text
    memeCTX.fillStyle = "White";
    memeCTX.fillText(getInput.value,40,80)
    //memeCTX.fillText($(this).val(),20,40);
})


//add content to your meme click event listener 
makeAMemeButton.addEventListener('submit', (e) => {
    e.preventDefault()
    console.log(memeCTX.getImageData(50, 50, 100, 100));
})


//DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
  loadApiImage();
  loadMemeNames();
  makeCollapsibleList();
})