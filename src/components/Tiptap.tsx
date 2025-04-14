import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import { useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  List, 
  ListOrdered, 
  Link as LinkIcon, 
  Trash2 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface TiptapProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  onDelete?: () => void;
  title?: string;
  isMobile?: boolean;
}

export default function Tiptap({ 
  content, 
  onChange, 
  placeholder = 'Write something...', 
  onDelete,
  title = 'New Additions',
  isMobile = false
}: TiptapProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      try {
        onChange(editor.getHTML());
      } catch (error) {
        console.error('Error updating content:', error);
        toast.error('Failed to update content');
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none max-w-none min-h-[150px] mt-2 px-1 text-gray-900',
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      try {
        editor.commands.setContent(content);
      } catch (error) {
        console.error('Error setting content:', error);
        toast.error('Failed to load content');
      }
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const handleDelete = () => {
    if (onDelete) {
      try {
        onDelete();
      } catch (error) {
        console.error('Error deleting:', error);
        toast.error('Failed to delete');
      }
    }
  };

  const btnClass = isMobile 
    ? "p-1 rounded hover:bg-gray-100 flex items-center justify-center w-8 h-8"
    : "p-1 rounded hover:bg-gray-100";

  const iconSize = isMobile ? 16 : 18;

  return (
    <div className={`tiptap-editor ${isMobile ? '' : 'bg-white rounded-md shadow-sm'} overflow-hidden`}>
      {!isMobile && (
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {onDelete && (
            <button 
              onClick={handleDelete} 
              className="text-gray-500 hover:text-gray-700"
              aria-label="Delete"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      )}
      
      <div className={`border-b border-gray-200 ${isMobile ? 'px-1 py-1' : 'px-4 py-2'} flex flex-wrap ${isMobile ? 'justify-between' : 'gap-1'} bg-white ${isMobile ? '' : 'rounded-t-md'}`}>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${btnClass} ${editor.isActive('bold') ? 'bg-gray-100 text-black' : 'text-gray-700'}`}
          aria-label="Bold"
        >
          <Bold size={iconSize} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${btnClass} ${editor.isActive('italic') ? 'bg-gray-100 text-black' : 'text-gray-700'}`}
          aria-label="Italic"
        >
          <Italic size={iconSize} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`${btnClass} ${editor.isActive('underline') ? 'bg-gray-100 text-black' : 'text-gray-700'}`}
          aria-label="Underline"
        >
          <UnderlineIcon size={iconSize} />
        </button>
        {!isMobile && <div className="w-px h-6 bg-gray-200 mx-1 self-center"></div>}
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`${btnClass} ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-100 text-black' : 'text-gray-700'}`}
          aria-label="Align left"
        >
          <AlignLeft size={iconSize} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`${btnClass} ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-100 text-black' : 'text-gray-700'}`}
          aria-label="Align center"
        >
          <AlignCenter size={iconSize} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`${btnClass} ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-100 text-black' : 'text-gray-700'}`}
          aria-label="Align right"
        >
          <AlignRight size={iconSize} />
        </button>
        {!isMobile && <div className="w-px h-6 bg-gray-200 mx-1 self-center"></div>}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${btnClass} ${editor.isActive('bulletList') ? 'bg-gray-100 text-black' : 'text-gray-700'}`}
          aria-label="Bullet list"
        >
          <List size={iconSize} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`${btnClass} ${editor.isActive('orderedList') ? 'bg-gray-100 text-black' : 'text-gray-700'}`}
          aria-label="Ordered list"
        >
          <ListOrdered size={iconSize} />
        </button>
        <button
          onClick={() => {
            const url = window.prompt('URL')
            if (url) {
              try {
                editor.chain().focus().setLink({ href: url }).run()
              } catch (error) {
                console.error('Error setting link:', error);
                toast.error('Failed to set link');
              }
            }
          }}
          className={`${btnClass} ${editor.isActive('link') ? 'bg-gray-100 text-black' : 'text-gray-700'}`}
          aria-label="Link"
        >
          <LinkIcon size={iconSize} />
        </button>
      </div>
      
      <div className={`${isMobile ? 'px-0' : 'px-4'} py-2 relative bg-white ${isMobile ? '' : 'rounded-b-md'}`}>
        <EditorContent editor={editor} className="text-gray-900" />
        {editor.isEmpty && (
          <div className="absolute top-3 left-4 text-gray-400 pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
} 