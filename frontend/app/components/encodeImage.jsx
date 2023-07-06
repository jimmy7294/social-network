"use client"

function encodeImageFile(element) {



  if (element === undefined) return;
console.log(element, "encodeImageFile")
  let file = element.files[0];
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = function () {
    fetch("http://localhost:8080/api/addImage", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reader.result),
    });
  };

}

export default encodeImageFile;