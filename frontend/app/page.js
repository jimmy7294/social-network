import { AuthRequiredError } from '../app/lib/exceptions'

const session = null;
export default function HomePage() {
  if (!session) throw new AuthRequiredError();
  return (
    <div className="container">
      <main>
        <h1 className="title">
          This is the home page that only logged in users can see
        </h1>
      </main>
    </div>
  );
}
