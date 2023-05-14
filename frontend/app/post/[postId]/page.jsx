const PostPage = (params) => {
    console.log(params);
 
    // TODO: fetch post data from API
    return (
      <div>
        <h1>{params.params.postId}</h1>
      </div>
    );
  };
  
  export default PostPage;
  