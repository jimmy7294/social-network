
import axios from "axios";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const LoginPage = async () => {
  await wait(3000);
  const { data } = await axios.get("http://jsonplaceholder.typicode.com/posts/10");

  return (
    <div>
      <h1>Login</h1>
      <form>
        <input type="text" />
        <input type="password" />
        <button type="submit">Login</button>
      </form>

      {JSON.stringify(data)}
    </div>
  );
};

export default LoginPage;
