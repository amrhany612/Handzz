const toggle = document.querySelector('.toggle');
const main = document.querySelector('.main');
const navigation = document.querySelector('.navigation');
const productContainer = document.querySelector('.productContainer')
const footer= document.getElementsByTagName("footer")[0];


toggle.onclick = function () {
    main.classList.toggle('active');
    navigation.classList.toggle('active');
    footer.classList.toggle('active');
  };


const addNewMarketBtn=document.querySelector(".addMarket")
const addNewMarketFrame=document.querySelector(".addFrame2")

addNewMarketBtn.onclick = function () {
    addNewMarketFrame.classList.toggle('active');
    addNewMarketBtn.textContent = addNewMarketBtn.textContent=='Close'? 'Create Market':"Close";
    }


const image= document.querySelector("#img");
const newImg=document.querySelector(".newImg")

image.onchange=function () {
let fReader = new FileReader();
console.log(fReader);
fReader.readAsDataURL(image.files[0]);
fReader.onloadend = function(event){
    newImg.src = event.target.result;
}}
