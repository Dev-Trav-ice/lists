import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function DeleteModal({ _id }: { _id: string }) {
  const [showModal, setShowModal] = useState<boolean | false>(false);
  const [loading, setLoading] = useState<boolean | false>(false);

  const queryClient = useQueryClient();

  const deleteList = async (id: string) => {
    try {
      const res = await fetch(`/api/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        return res.json();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const mutation = useMutation({
    mutationFn: deleteList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getLists"] });
      setShowModal(false);
    },
    onSettled: () => setLoading(false),
    onError: (err) => console.error("Mutation error:", err),
  });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    mutation.mutate(_id);
  };
  return (
    <div>
      <Button
        onClick={() => setShowModal(!showModal)}
        className="cursor-pointer"
        variant={"ghost"}
      >
        <Trash2 size={16} />
      </Button>

      {showModal && (
        <div
          onClick={() => setShowModal(!showModal)}
          className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center backdrop-blur-[2px] bg-black/50 w-full h-screen overflow-hidden"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white flex flex-col gap-4 w-[400px] relative h-[150px] rounded-xl px-6"
          >
            <h1 className="text-center font-bold my-4  text-xl text-black">
              Are you sure you want to delete?
            </h1>

            <div className="flex items-center justify-center gap-6">
              <Button
                onClick={() => setShowModal(!showModal)}
                variant={"outline"}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button onClick={handleClick} variant={"destructive"}>
                {loading ? "Deleting" : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
