import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import {
  CalendarIcon,
  DocumentTextIcon,
  TrashIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import Tiptap from "./Tiptap";

interface Todo {
  _id: string;
  title: string;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

interface TodoDetailProps {
  todo: Todo | null;
  onUpdate: (id: string, data: Partial<Todo>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onClose?: () => void;
  isMobile?: boolean;
}

export default function TodoDetail({
  todo,
  onUpdate,
  onDelete,
  onClose,
  isMobile = false,
}: TodoDetailProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const isMounted = useRef(false);

  // Initialize form values when todo changes
  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDate(todo.date);
      setDescription(todo.description);
    }
  }, [todo]);

  // Auto-save changes
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    if (!todo) return;

    let saveTimer: NodeJS.Timeout;
    
    const handleSave = async () => {
      // Only update if values have changed and all required fields are valid
      if (
        (title !== todo.title ||
        date !== todo.date ||
        description !== todo.description) &&
        title.trim() !== '' && 
        date && 
        description
      ) {
        try {
          setIsUpdating(true);
          console.log('Auto-saving todo:', todo._id, {
            title: title.trim(),
            date,
            description
          });
          
          await onUpdate(todo._id, {
            title: title.trim(),
            date,
            description,
          });
          // Don't show success toast on auto-save for better UX
        } catch (error) {
          console.error("Error updating todo:", error);
          toast.error("Failed to update todo. Please try again.");
          
          // Revert to original values on error
          setTitle(todo.title);
          setDate(todo.date);
          setDescription(todo.description);
        } finally {
          setIsUpdating(false);
        }
      }
    };

    // Debounce the save operation
    saveTimer = setTimeout(handleSave, 1000);

    return () => {
      clearTimeout(saveTimer);
    };
  }, [title, date, description, todo, onUpdate]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
  };

  const handleDelete = async () => {
    if (!todo) return;

    try {
      setIsDeleting(true);
      await onDelete(todo._id);
      toast.success("Todo deleted");
    } catch (error) {
      toast.error("Failed to delete todo");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (titleRef.current) {
      adjustTextareaHeight(titleRef.current);
    }
  }, [title]);

  if (!todo) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
        <DocumentTextIcon className="h-16 w-16 mb-4" />
        <h3 className="text-xl font-medium">No todo selected</h3>
        <p className="text-sm mt-2 text-center">
          Select a todo from the list or create a new one
        </p>
      </div>
    );
  }

  const formattedDate = todo.updatedAt
    ? format(new Date(todo.updatedAt), "MMM d, yyyy h:mm a")
    : "";

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white text-gray-900 shadow-md rounded-md mx-2 my-2">
      {isMobile && (
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center space-x-2">
            {isUpdating && (
              <span className="text-xs text-gray-500 ml-2">Saving...</span>
            )}
          </div>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-gray-500 hover:text-red-500 disabled:opacity-50"
            aria-label="Delete todo"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          <div>
            <textarea
              ref={titleRef}
              value={title}
              onChange={handleTitleChange}
              placeholder="Todo title"
              rows={1}
              className="block w-full text-xl font-medium bg-transparent border-0 p-0 placeholder-gray-400 focus:ring-0 resize-none overflow-hidden"
              onInput={(e) => adjustTextareaHeight(e.target as HTMLTextAreaElement)}
            />
          </div>

          <div className="flex items-center space-x-2 text-gray-500 text-sm">
            <CalendarIcon className="h-4 w-4" />
            <input
              type="date"
              value={date}
              onChange={handleDateChange}
              className="border-0 p-0 bg-transparent focus:ring-0 text-gray-700"
            />
          </div>

          <div className="pt-2 border-t border-gray-100">
            <Tiptap
              content={description}
              onChange={handleDescriptionChange}
              placeholder="Write some details..."
              onDelete={handleDelete}
              title={title}
              isMobile={isMobile}
            />
          </div>
        </div>
      </div>

      {!isMobile && (
        <div className="border-t border-gray-200 p-4 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {isUpdating ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </span>
            ) : (
              <>Last updated: {formattedDate}</>
            )}
          </div>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-gray-500 hover:text-red-500 disabled:opacity-50"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
} 