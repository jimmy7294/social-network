function getAllMessages(){
    const [messages, setMessages] = useState([]);

    const user = decodeURIComponent(slug.params.slug)

    fetch("http://localhost:8080/api/getAllMessages", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        })
        .then((data) => data.json())
        .then((data) => {
            if (data.status !== "success") {
                console.log("failed to get all messages");
                return;
            }
            setMessages(data.messages);
        }
    );
    return (
        <>
            <div>
                {messages.map((message, index) => {
                    <div key={index}>
                        <h1>{messages.user}</h1>
                        <h1>{message.message}</h1>
                        <h1>{messages.date}</h1>
                    </div>
                })}
            </div>
        </>
    )
}


function Messages(){
    return (
        <>
        <getAllMessages />
        </>
    )
}