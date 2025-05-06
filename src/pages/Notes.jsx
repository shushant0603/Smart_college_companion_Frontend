import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    title: '',
    content: '',
    tags: '',
  });
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/notes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setNotes(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Failed to load notes');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map((tag) => tag.trim()),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add note');
      }

      await fetchNotes();
      setShowForm(false);
      setFormData({
        subject: '',
        title: '',
        content: '',
        tags: '',
      });
      toast.success('Note added successfully');
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error('Failed to add note');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to delete note');
      }

      await fetchNotes();
      setSelectedNote(null);
      toast.success('Note deleted successfully');
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
    }
  };

  const regenerateSummary = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/notes/${id}/summarize`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to regenerate summary');
      }

      const updatedNote = await response.json();
      setNotes(notes.map((note) => (note._id === id ? updatedNote : note)));
      toast.success('Summary regenerated successfully');
    } catch (error) {
      console.error('Error regenerating summary:', error);
      toast.error('Failed to regenerate summary');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Notes</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setSelectedNote(null);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          {showForm ? 'Cancel' : 'Add Note'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notes List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">All Notes</h2>
          </div>
          <ul className="divide-y divide-gray-200 max-h-[calc(100vh-300px)] overflow-y-auto">
            {notes.length === 0 ? (
              <li className="p-4 text-center text-gray-500">No notes found</li>
            ) : (
              notes.map((note) => (
                <li
                  key={note._id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer ${
                    selectedNote?._id === note._id ? 'bg-gray-50' : ''
                  }`}
                  onClick={() => setSelectedNote(note)}
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{note.title}</h3>
                      <p className="text-sm text-gray-500">{note.subject}</p>
                    </div>
                    <p className="text-xs text-gray-400">
                      {format(new Date(note.createdAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Note Form or Selected Note */}
        <div className="lg:col-span-2">
          {showForm ? (
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Content</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={10}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="e.g. lecture, important, exam"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Add Note
                </button>
              </div>
            </form>
          ) : selectedNote ? (
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedNote.title}</h2>
                  <p className="text-sm text-gray-500">{selectedNote.subject}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => regenerateSummary(selectedNote._id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Regenerate Summary
                  </button>
                  <button
                    onClick={() => handleDelete(selectedNote._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="prose max-w-none">
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Summary</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-gray-700">{selectedNote.summary}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Content</h3>
                  <div className="whitespace-pre-wrap text-gray-700">
                    {selectedNote.content}
                  </div>
                </div>

                {selectedNote.tags && selectedNote.tags.length > 0 && (
                  <div className="mt-6">
                    <div className="flex flex-wrap gap-2">
                      {selectedNote.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
              Select a note to view or create a new one
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes; 