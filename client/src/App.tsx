import { useQuery } from "@tanstack/react-query";
import List from "./components/list";
import type { ListType } from "./types/types";

function App() {
  const getLists = async () => {
    try {
      const res = await fetch("/api");
      return res.json();
    } catch (error) {
      console.log(error);
    }
  };

  const { data } = useQuery({
    queryKey: ["getLists"],
    queryFn: getLists,
  });

  return (
    <main className="bg-gray-200 min-h-[calc(100vh-10vh)] pb-4">
      <div className="flex h-full px-4 items-center justify-between max-w-4xl mx-auto">
        {data && data.length > 0 ? (
          <div className="flex flex-col gap-4 mt-4 w-full">
            {data?.map((list: ListType) => (
              <List key={list._id} list={list} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <h1 className="text-center my-4">No lists available</h1>
          </div>
        )}
      </div>
    </main>
  );
}

export default App;
