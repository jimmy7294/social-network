function ImageSelector(props) {
    const images = props.images
    const updateSelectedImage = props.func

    return (
        <>
        <div>
            <button onClick={() => updateSelectedImage("")}>No Image</button>
        </div>
        <div>
            {images.stock_images ? (
                    images.stock_images.map((image,index) => (
                        <div key={index}>
                            <img src={image} alt="image" className="pfp" onClick={() => updateSelectedImage(image)} />
                        </div>))
            ) : (
            <h1>no stock images</h1>
            )}

            {images.user_images ? (
                    images.user_images.map((image,index) => (
                        <div key={index}>
                            <img src={image} alt="image" className="pfp" onClick={() => updateSelectedImage(image)} />
                        </div>))
            ) : (
            <h1>no user images</h1>
            )}
        </div>
        </>
    )
}

export default ImageSelector