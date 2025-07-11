import type { ListType } from "@/types/types";
import DeleteModal from "./deleteModal";

export default function List({ list }: { list: ListType }) {
  return (
    <div className="bg-white flex items-center justify-between shadow px-4 py-5 rounded-lg">
      <h1>{list.title}</h1>

      <div className="flex items-center gap-2">
        <p className="text-xs text-gray-600">
          {list.createdAt ? new Date(list.createdAt).toLocaleString() : ""}
        </p>
        <DeleteModal _id={list._id} />
      </div>
    </div>
  );
}
