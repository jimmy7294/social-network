import { encode } from "next-auth/jwt";
import { useRouter } from "next/navigation";

function encodeImageFile(element) {
    const router = useRouter();
    //console.log("got to encode", element)
    if (element === undefined) return;
    //console.log("passed the first check")
    let file = element.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file)
    reader.onloadend = function() {
      //console.log(reader.result)
      //console.log(typeof reader.result)
      fetch("http://localhost:8080/api/addImage", {
        method: "POST",
        credentials: "include",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify(reader.result)
      })
    }
    router.push("/optional")
  }


  export default encodeImageFile;