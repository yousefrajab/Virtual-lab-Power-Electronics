let popup = document.getElementById("popup");
var contai = document.getElementById("parent_contain");
var img = document.getElementById("sign_image");
var property_h2 = document.getElementById("property_h2");

function openPopup(given_image, property,width_given) {
  contai.style.height ='887px';
  img.src = given_image;
  property_h2.style.fontSize=width_given;
  property_h2.innerHTML = property;
  popup.classList.add("open-popup");
}

function closePopup() {
  contai.style.height = "0%";
  popup.classList.remove("open-popup");
}
