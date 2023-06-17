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


const addNewProductBtn=document.querySelector(".addProd")
const addNewProductFrame=document.querySelector(".addFrame")

addNewProductBtn.onclick = function () {
    addNewProductFrame.classList.toggle('active');
    addNewProductBtn.textContent = addNewProductBtn.textContent=='Close'? 'Add New Product':"Close";
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
