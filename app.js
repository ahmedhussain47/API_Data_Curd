const apiKey = `https://jsonplaceholder.typicode.com/posts`;
const tbody = document.querySelector("#todos-listing")

const createPostForm = document.getElementById("create-post-form");
const postTitle = document.querySelector("#post_title");
const postBody = document.querySelector("#post_body");
const editPostForm = document.querySelector("#edit-post-form");
const editPostId= document.querySelector("#edit_post_id");
const editPostTitle = document.querySelector("#edit_post_title");
const editPostBody = document.querySelector("#edit_post_body");

createPostForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const createPostFormBtn = document.querySelector("#create-post-form button");
    const postTitleVal = postTitle?.value;
    const postBodyVal = postBody?.value;

    if(!postTitleVal || !postBodyVal){
        alert("Enter Required Docs.")
        return
    }

    const body = {
        title: postTitleVal,
        body: postBodyVal
    }
    createPostFormBtn.setAttribute("disabled","disabled")
    fetch(apiKey, {
        method: "Post",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(body)
    })
        .then(async (data) => {
            const jsonData = await data.json()
            console.log(jsonData, "jsonData")
            postTitle.value="";
            postBody.value="";
            // $("#create-post").modal("hide");
            $("#create-post").modal("hide");
            createPostFormBtn.removeAttribute("disabled");
            

        })
        .catch((error) => {
            // console.log(error)'
            createPostFormBtn.removeAttribute("disabled");
            alert("oops something went wrong");
            createPostFormBtn.setAttribute("disabled","disabled")

        });
        postTitle = "";
        postBody = "";
})


tbody.addEventListener("click", async(e)=>{
    e.preventDefault();
    //event bubbling
    const currentElement = e.target;
    if(currentElement.classList.contains("delete-btn") && confirm("Are You Sure?"))
    {
        const postId = currentElement.getAttribute("data-post-id")
        fetch(`${apiKey}/${postId}`,
        {
            method: "DELETE"
        })
        .then(async(data)=>{const convertedData = await data.json()
        console.log(convertedData)
        getPost();
        })
        .catch((error)=>{console.log(error)})
        
    }
    if(currentElement.classList.contains("edit-btn"))
    {
        const postId = currentElement.getAttribute("data-post-id")
        //getPostById is defined below
        const singleData = await getPostById(postId);
        // alert("working") yes
        $("#edit-post").modal("show");    
        editPostId.value = singleData?.id;    
        editPostTitle.value = singleData?.title;    
        editPostBody.value = singleData?.body;    
    }
    
})

const getPostById = (postId)=>{
    return (
        fetch(`${apiKey}/${postId}`)
        .then((data)=>data.json())
        .then((data)=>{
            console.log(data)
            return data
        })
    )
}

editPostForm.addEventListener("submit",function(event){
    event.preventDefault();
    const editPostIdValue= editPostId?.value;
    const editPostTitleValue= editPostTitle?.value;
    const editPostBodyValue= editPostBody?.value;
    console.log(editPostIdValue)

    if(!editPostIdValue||!editPostBodyValue||!editPostTitleValue){
         alert("Smth went wrong")
         return;
    }
    const body={
        title: editPostTitleValue,
        body: editPostBodyValue
    };
    fetch(`${apiKey}/${editPostIdValue}`, {
        method: "PUT",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(body)
    })
        .then(async (data) => {
            myFunction();
            $("#edit-post").modal("hide");
            // console.log(data)
            await getPost();
        })
        .catch((error) => {
            // console.log(error)'
            // createPostFormBtn.removeAttribute("disabled");
            alert("oops something went wrong");
            // createPostFormBtn.setAttribute("disabled","disabled")
        });

        


})
const getPost=()=>{
    return(
        fetch(apiKey)
        .then((response) => response.json())
        .then((data) => {
            // console.log(data, "data");
            let output = "";
            data?.forEach((singleData) => {
              output += `<tr>
              <td>${singleData?.id}</td>
              <td>${singleData?.userId}</td>
              <td>${singleData?.title}</td>
              <td>
               <a class="btn btn-primary edit-btn"  href="#edit-post" data-post-id="${singleData?.id}">Edit</a>
               </td>
              <td>
              <a href="#" class="btn btn-danger delete-btn" data-post-id="${singleData?.id}">Delete</a>
              </td>
            </tr>`;
            });
        
            tbody.innerHTML = output;
        })
        .catch((error) => {
            return console.log(error)
        })
    );
};

getPost()   
    
    
function myFunction() {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");
  
    // Add the "show" class to DIV
    x.className = "show";
  
    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }