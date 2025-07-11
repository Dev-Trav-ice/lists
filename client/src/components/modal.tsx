import { useState } from "react";
import { Button } from "./ui/button";
import { CircleX, Plus } from "lucide-react";
import { Input } from "./ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function Modal() {
  const [showModal, setShowModal] = useState<boolean | false>(false);
  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean | false>(false);
  const queryClient = useQueryClient();

  const createList = async (newTitle: string) => {
    const res = await fetch("/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    });

    if (!res.ok) {
      throw new Error("Failed to create list");
    }

    return res.json();
  };

  const mutation = useMutation({
    mutationFn: createList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getLists"] });
      setTitle("");
      setShowModal(false);
    },
    onSettled: () => setLoading(false),
    onError: (err) => console.error("Mutation error:", err),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    mutation.mutate(title);
  };

  return (
    <div>
      <Button
        onClick={() => setShowModal(!showModal)}
        className="text-xs cursor-pointer"
        variant={"outline"}
      >
        <Plus /> Create New
      </Button>

      {showModal && (
        <div
          onClick={() => setShowModal(!showModal)}
          className="fixed z-50 overflow-hidden flex items-center justify-center backdrop-blur-[2px] top-0 right-0 left-0 bottom-0 bg-black/50 w-full h-screen"
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
            className="bg-white w-[500px] relative h-[200px] rounded-xl px-6"
          >
            <h1 className="text-center font-bold my-4  text-xl text-black">
              Create a New List
            </h1>
            <Button
              className="absolute top-3 right-4 cursor-pointer"
              variant={"ghost"}
              onClick={() => setShowModal(!showModal)}
            >
              <CircleX size={18} />
            </Button>

            <Input
              name="title"
              onChange={(e) => setTitle(e.target.value)}
              className="bg-gray-100"
              placeholder="Type anything..."
            />
            <Button
              disabled={loading}
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 transition-all duration-300 w-full mt-4"
            >
              {loading ? "Loading..." : "Save"}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
