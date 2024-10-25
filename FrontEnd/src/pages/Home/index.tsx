import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <main className="">
      <div>Home</div>

      <div>{user?.name}</div>
    </main>
  );
};

export default Home;
